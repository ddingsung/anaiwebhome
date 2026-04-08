'use client';

import { useAppStore } from '@sl/store/useAppStore';

export default function StatusBar() {
  const { centerKpis } = useAppStore();

  return (
    <footer
      className="flex items-center gap-6 px-4 text-xs shrink-0"
      style={{
        height: '32px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-muted)',
      }}
    >
      {/* 센터명 */}
      <span className="font-medium hidden lg:block" style={{ color: 'var(--text-secondary)' }}>
        SmartLog OCC — 인천 허브센터
      </span>
      <span className="font-medium lg:hidden" style={{ color: 'var(--text-secondary)' }}>
        SmartLog OCC
      </span>

      <span style={{ color: 'var(--border-default)' }}>|</span>

      {/* 전체 처리량 — lg 이상만 표시 */}
      <span className="hidden lg:flex items-center gap-1.5">
        <span>처리량</span>
        <span className="font-mono font-medium" style={{ color: 'var(--accent-primary)' }}>
          {centerKpis.throughput.toLocaleString()}
        </span>
        <span>박스/h</span>
      </span>

      <span className="hidden lg:block" style={{ color: 'var(--border-default)' }}>|</span>

      {/* 도크 가동률 — lg 이상만 표시 */}
      <span className="hidden lg:flex items-center gap-1.5">
        <span>도크 가동률</span>
        <span
          className="font-mono font-medium"
          style={{ color: centerKpis.dockUtilization >= 85 ? 'var(--status-normal)' : 'var(--status-warning)' }}
        >
          {centerKpis.dockUtilization}%
        </span>
      </span>

      <span className="hidden lg:block" style={{ color: 'var(--border-default)' }}>|</span>

      {/* 활성 알림 */}
      <span className="flex items-center gap-1.5">
        <span className="hidden md:inline">활성 알림</span>
        <span
          className="font-mono font-medium"
          style={{ color: centerKpis.activeAlerts > 0 ? 'var(--status-critical)' : 'var(--status-normal)' }}
        >
          {centerKpis.activeAlerts}<span className="hidden md:inline">건</span>
        </span>
      </span>

      <div className="flex-1" />

      {/* 시스템 상태 */}
      <span className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--status-normal)' }}
        />
        <span>시스템 정상</span>
      </span>

      <span style={{ color: 'var(--border-default)' }}>|</span>

      {/* LIVE 시뮬레이터 인디케이터 */}
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>LIVE</span>
      </span>

      {/* 데모 배지 */}
      <span
        className="px-2 py-0.5 rounded text-[10px] font-medium"
        style={{
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
          color: '#a78bfa',
        }}
      >
        DEMO
      </span>
    </footer>
  );
}
