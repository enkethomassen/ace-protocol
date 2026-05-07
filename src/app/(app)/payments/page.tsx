'use client';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatUsd, formatTimestamp, formatShortAddress, formatRelativeTime } from '@/lib/utils';
import { Plus, Calendar, CheckCircle2, Clock, XCircle, Loader2, Repeat, Play, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScheduledPayment } from '@/types';
import { validatePayment, simulatePaymentExecution } from '@/lib/paymentAdapter';
import { routeExecution, estimateCurrentFee } from '@/lib/executionRouter';
import { appendLog } from '@/lib/activityLog';

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; variant: 'success' | 'gold' | 'ocean' | 'danger' | 'muted' }> = {
  scheduled:  { label: 'Scheduled',  icon: Clock,         variant: 'ocean' },
  executing:  { label: 'Executing',  icon: Loader2,       variant: 'gold' },
  completed:  { label: 'Completed',  icon: CheckCircle2,  variant: 'success' },
  failed:     { label: 'Failed',     icon: XCircle,       variant: 'danger' },
};

const RECURRENCE_LABEL: Record<string, string> = {
  once: 'One-time', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
};

export default function PaymentsPage() {
  const { payments, vault, isLoading, addPayment, updatePayment, updateVault, addTransaction } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newRecurrence, setNewRecurrence] = useState<'once' | 'weekly' | 'monthly'>('monthly');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const upcoming = payments.filter(p => p.status === 'scheduled');
  const completed = payments.filter(p => p.status === 'completed');
  const totalUpcoming = upcoming.reduce((s, p) => s + p.amountUsd, 0);

  function handleSchedule() {
    const amount = parseFloat(newAmount);
    if (!newLabel.trim()) { setFeedback({ type: 'error', msg: 'Label is required.' }); return; }
    if (!newRecipient.trim() || newRecipient.length < 32) { setFeedback({ type: 'error', msg: 'Enter a valid Solana address.' }); return; }
    if (!amount || amount <= 0) { setFeedback({ type: 'error', msg: 'Enter a valid amount.' }); return; }

    const now = Math.floor(Date.now() / 1000);
    const p: ScheduledPayment = {
      id: `pay-${Date.now()}`,
      vaultId: vault?.id ?? 'vault-001',
      recipient: newRecipient.trim(),
      amountUsd: amount,
      currency: 'USDC',
      status: 'scheduled',
      scheduledAt: now,
      label: newLabel.trim(),
      recurrence: newRecurrence,
      nextDue: now + (newRecurrence === 'weekly' ? 7 * 86400 : newRecurrence === 'monthly' ? 30 * 86400 : 86400),
    };

    addPayment(p);
    appendLog({
      type: 'payment',
      message: `Payment scheduled: ${p.label}`,
      detail: `${formatUsd(amount)} → ${p.recipient.slice(0, 8)}… every ${RECURRENCE_LABEL[newRecurrence]}`,
    });

    setFeedback({ type: 'success', msg: `"${p.label}" scheduled for ${formatUsd(amount)}.` });
    setNewLabel(''); setNewRecipient(''); setNewAmount(''); setNewRecurrence('monthly');
    setTimeout(() => setShowNew(false), 1200);
  }

  async function handleExecute(payment: ScheduledPayment) {
    if (!vault) return;
    setExecutingId(payment.id);

    const validation = validatePayment(payment, vault);
    if (!validation.ok) {
      appendLog({ type: 'error', message: `Payment blocked: ${payment.label}`, detail: validation.reason });
      setFeedback({ type: 'error', msg: validation.reason });
      setExecutingId(null);
      return;
    }

    const { feeLamports } = estimateCurrentFee();
    // eslint-disable-next-line react-hooks/purity -- event handler, not render
    const urgencyHours = Math.max(0, (payment.nextDue - Math.floor(Date.now() / 1000)) / 3600);
    const route = routeExecution({
      amountUsd: payment.amountUsd,
      urgencyHours,
      networkFeeLamports: feeLamports,
      baselineFeeLamports: 5000,
      hasPendingBatchable: upcoming.length > 1,
    });

    appendLog({
      type: 'execution_decision',
      message: `Execution decision: ${route.decision.replace('_', ' ')} — ${payment.label}`,
      detail: route.reason,
    });

    // Simulate brief "executing" state
    updatePayment(payment.id, { status: 'executing' as any });
    await new Promise(r => setTimeout(r, 1400));

    const result = simulatePaymentExecution(payment, vault);

    if (result.success) {
      updatePayment(payment.id, {
        status: 'completed',
        executedAt: Math.floor(Date.now() / 1000),
      });
      updateVault({
        reserveBalance: result.reserveAfter,
        liquidBalance: result.liquidAfter,
        totalDeposited: vault.totalDeposited - payment.amountUsd,
      });
      addTransaction({
        id: `tx-${Date.now()}`,
        vaultId: vault.id,
        type: 'payout',
        amountUsd: payment.amountUsd,
        status: 'confirmed',
        txHash: result.txSig,
        timestamp: Math.floor(Date.now() / 1000),
        description: `Auto-payout: ${payment.label}`,
        executionCost: feeLamports / 1e9,
      });
      appendLog({
        type: 'payment',
        message: `Payment executed: ${payment.label}`,
        detail: `${formatUsd(payment.amountUsd)} sent. Reserve: $${result.reserveAfter.toFixed(2)}`,
        txSig: result.txSig,
      });
      setFeedback({ type: 'success', msg: `${payment.label} executed successfully.` });
    } else {
      updatePayment(payment.id, { status: 'scheduled' });
      appendLog({ type: 'error', message: `Payment failed: ${payment.label}`, detail: result.failureReason });
      setFeedback({ type: 'error', msg: result.failureReason ?? 'Execution failed.' });
    }

    setExecutingId(null);
    setTimeout(() => setFeedback(null), 4000);
  }

  if (isLoading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Feedback toast */}
        {feedback && (
          <div className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium',
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400',
          )}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            {feedback.msg}
          </div>
        )}

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Upcoming payments',  value: upcoming.length.toString(), sub: `${formatUsd(totalUpcoming)} total` },
            { label: 'Completed this month', value: completed.length.toString(), sub: `${formatUsd(completed.reduce((s, p) => s + p.amountUsd, 0))} sent` },
            { label: 'Next due', value: upcoming.length > 0 ? formatRelativeTime(Math.min(...upcoming.map(p => p.nextDue))) : '—', sub: 'Earliest payment' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-xl border border-[#2a2a3a] bg-[#13131a] p-4">
              <p className="text-xs text-gray-600 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-white mt-1">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* New payment toggle */}
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { setShowNew(!showNew); setFeedback(null); }}>
            <Plus className="w-3.5 h-3.5" /> Schedule Payment
          </Button>
        </div>

        {showNew && (
          <Card>
            <CardHeader><CardTitle>New Scheduled Payment</CardTitle></CardHeader>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Label</label>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Crew Server Bill"
                  className="w-full bg-[#0f0f16] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Recipient Wallet</label>
                <input value={newRecipient} onChange={e => setNewRecipient(e.target.value)} placeholder="Solana address"
                  className="w-full bg-[#0f0f16] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 font-mono" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Amount (USDC)</label>
                <input type="number" min="0.01" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="0.00"
                  className="w-full bg-[#0f0f16] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Recurrence</label>
                <select value={newRecurrence} onChange={e => setNewRecurrence(e.target.value as any)}
                  className="w-full bg-[#0f0f16] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50">
                  <option value="once">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleSchedule}>Schedule</Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowNew(false); setFeedback(null); }}>Cancel</Button>
            </div>
          </Card>
        )}

        {/* Upcoming payments */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Payments</CardTitle>
            <Badge variant="ocean">{upcoming.length}</Badge>
          </CardHeader>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-6">No upcoming payments.</p>
            )}
            {upcoming.map(p => (
              <PaymentRow
                key={p.id}
                payment={p}
                executing={executingId === p.id}
                onExecute={() => handleExecute(p)}
              />
            ))}
          </div>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <Badge variant="success">{completed.length}</Badge>
          </CardHeader>
          <div className="space-y-2">
            {completed.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-6">No completed payments yet.</p>
            )}
            {completed.map(p => (
              <PaymentRow key={p.id} payment={p} executing={false} />
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function PaymentRow({
  payment,
  executing,
  onExecute,
}: {
  payment: ScheduledPayment;
  executing: boolean;
  onExecute?: () => void;
}) {
  const cfg = statusConfig[payment.status] ?? statusConfig.scheduled;
  const Icon = cfg.icon;
  const isExecuting = payment.status === 'executing' || executing;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#2a2a3a] bg-[#0f0f16] hover:border-[#3a3a4a] transition-all">
      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Calendar className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{payment.label}</p>
        <p className="text-xs text-gray-600 font-mono">{formatShortAddress(payment.recipient)}</p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="text-sm font-bold text-white">{formatUsd(payment.amountUsd)}</p>
        <div className="flex items-center gap-1 justify-end">
          <Repeat className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] text-gray-600">{RECURRENCE_LABEL[payment.recurrence] ?? payment.recurrence}</span>
        </div>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <Badge variant={cfg.variant}>
          <Icon className={cn('w-3 h-3 mr-1', isExecuting && 'animate-spin')} />
          {cfg.label}
        </Badge>
        <p className="text-[10px] text-gray-600">
          {payment.status === 'completed'
            ? formatTimestamp(payment.executedAt!)
            : `Due ${formatRelativeTime(payment.nextDue)}`}
        </p>
      </div>
      {payment.status === 'scheduled' && onExecute && (
        <Button
          size="sm"
          variant="outline"
          onClick={onExecute}
          disabled={isExecuting}
          className="shrink-0 text-xs"
        >
          {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          {isExecuting ? 'Executing…' : 'Execute'}
        </Button>
      )}
    </div>
  );
}
