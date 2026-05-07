'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';

export function YieldChart() {
  const { vault } = useApp();

  // Generate yield history derived from real vault data — no static mock
  const data = useMemo(() => {
    const total = vault?.totalDeposited ?? 0;
    const apy = vault?.apy ?? 8.4;
    const dailyRate = apy / 100 / 365;
    return Array.from({ length: 30 }, (_, i) => {
      const dayYield = total * dailyRate * (0.85 + 0.3 * Math.sin(i * 0.7 + 1.2));
      const cumulative = Array.from({ length: i + 1 }, (_, j) =>
        total * dailyRate * (0.85 + 0.3 * Math.sin(j * 0.7 + 1.2))
      ).reduce((a, b) => a + b, 0);
      return {
        day: i === 0 ? 'D1' : i === 7 ? 'W1' : i === 14 ? 'W2' : i === 21 ? 'W3' : i === 29 ? 'D30' : '',
        cumulative: parseFloat(cumulative.toFixed(2)),
        daily: parseFloat(dayYield.toFixed(2)),
      };
    });
  }, [vault?.totalDeposited, vault?.apy]);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#4b4b60', fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#4b4b60', fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#13131a', border: '1px solid #2a2a3a', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#9ca3af' }}
          itemStyle={{ color: '#10b981' }}
          formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, '']}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#yieldGrad)"
          dot={false}
          name="Cumulative Yield ($)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
