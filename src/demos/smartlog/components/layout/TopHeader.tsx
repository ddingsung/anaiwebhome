'use client';

import { useEffect, useState } from 'react';
import { RiBellLine, RiQuestionLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import { clsx } from 'clsx';
import type { ActiveRole } from '@sl/types';

const ROLES: { value: ActiveRole; label: string; desc: string }[] = [
  { value: 'controller', label: '관제자', desc: 'Ops Controller' },
  { value: 'supervisor', label: '슈퍼바이저', desc: 'Dock Supervisor' },
  { value: 'operator', label: '현장 작업자', desc: 'Floor Operator' },
];

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/command':  { title: 'Ops Command Center', subtitle: '전체 운영 관제' },
  '/dock':     { title: 'Dock & Yard Control', subtitle: '도크 배정 관리' },
  '/conveyor': { title: 'Conveyor Flow Monitor', subtitle: '컨베이어 병목 감지' },
  '/actions':  { title: 'AI Action Panel', subtitle: '추천 · 승인 · 실행' },
  '/twin':     { title: 'Shadow Digital Twin', subtitle: '정책 검증 시뮬레이션' },
};

interface TopHeaderProps {
  pathname: string;
  onStartTour?: () => void;
}

export default function TopHeader({ pathname, onStartTour }: TopHeaderProps) {
  const { activeRole, setActiveRole, alerts, actions } = useAppStore();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () =>
      setTimeStr(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pageInfo = PAGE_TITLES[pathname] ?? { title: 'SmartLog OCC', subtitle: '' };
  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;
  const pendingActionsCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <header
      className="flex items-center gap-4 px-4 shrink-0"
      style={{
        height: '52px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* 페이지 타이틀 */}
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="text-sm font-semibold text-white/90 whitespace-nowrap">
          {pageInfo.title}
        </h1>
        <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
          {pageInfo.subtitle}
        </span>
      </div>

      <div className="flex-1" />

      {/* 역할 전환 탭 — lg 이상에서 전체, md에서 압축 */}
      <div
        className="flex items-center gap-1 p-1 rounded-md"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => setActiveRole(role.value)}
            className={clsx(
              'py-1 text-xs rounded transition-all whitespace-nowrap',
              'px-2 lg:px-3',
              activeRole === role.value ? 'text-white font-medium' : 'hover:text-white/70'
            )}
            style={
              activeRole === role.value
                ? { background: 'var(--bg-overlay)', color: 'var(--text-primary)' }
                : { color: 'var(--text-muted)' }
            }
            title={role.desc}
          >
            {/* md: 축약 라벨, lg+: 전체 라벨 */}
            <span className="lg:hidden">
              {role.value === 'controller' ? '관제' : role.value === 'supervisor' ? '슈퍼' : '작업'}
            </span>
            <span className="hidden lg:inline">{role.label}</span>
          </button>
        ))}
      </div>

      {/* AI 추천 대기 배지 */}
      {pendingActionsCount > 0 && (
        <div
          className="flex items-center gap-1.5 px-2 lg:px-2.5 py-1 rounded-md text-xs font-medium"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#a78bfa',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-warning"
            style={{ background: '#a78bfa' }}
          />
          <span className="hidden lg:inline">AI 추천 </span>{pendingActionsCount}건
        </div>
      )}

      {/* 투어 도움말 버튼 */}
      {onStartTour && (
        <button
          onClick={onStartTour}
          title="화면 가이드 보기"
          className="relative flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-white/5"
          style={{ color: 'rgba(6,182,212,0.55)', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          <RiQuestionLine size={15} />
        </button>
      )}

      {/* 알림 벨 */}
      <button className="relative flex items-center justify-center w-8 h-8 rounded-md text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
        <RiBellLine size={16} />
        {activeAlertsCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold text-white"
            style={{ background: 'var(--status-critical)' }}
          >
            {activeAlertsCount}
          </span>
        )}
      </button>

      {/* 실시간 시각 */}
      {timeStr && (
        <span className="font-mono text-xs hidden xl:block" style={{ color: 'var(--text-muted)' }}>
          {timeStr}
        </span>
      )}
    </header>
  );
}
