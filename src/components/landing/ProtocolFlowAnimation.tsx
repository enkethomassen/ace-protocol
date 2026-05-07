'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ProtocolFlowScene = dynamic(
  () => import('./ProtocolFlowScene').then(m => m.ProtocolFlowScene),
  { ssr: false }
);

export function ProtocolFlowAnimation() {
  return (
    <Suspense fallback={
      <div className="w-full h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] animate-pulse" />
          <p className="text-sm text-[#3a3650]">Loading protocol visualization…</p>
        </div>
      </div>
    }>
      <ProtocolFlowScene />
    </Suspense>
  );
}
