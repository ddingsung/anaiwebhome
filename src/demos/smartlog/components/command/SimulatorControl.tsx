'use client';

import { useAppStore } from '@sl/store/useAppStore';

export default function SimulatorControl() {
  const { simulatorRunning, startSimulator, stopSimulator, resetSimulator } = useAppStore();

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-1.5 ml-auto">
        {simulatorRunning && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-cyan)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        )}
        <button
          onClick={simulatorRunning ? stopSimulator : startSimulator}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors"
          style={{
            background: simulatorRunning ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.07)',
            color: simulatorRunning ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            border: `1px solid ${simulatorRunning ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {simulatorRunning ? '⏸ PAUSE' : '▶ START SIM'}
        </button>
        {!simulatorRunning && (
          <button
            onClick={resetSimulator}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            ↺ RESET
          </button>
        )}
      </div>
    </div>
  );
}
