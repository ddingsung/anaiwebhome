'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@sl/store/useAppStore';
import { useRouter } from 'next/navigation';
import {
  RiRobotLine, RiCheckboxCircleLine, RiCloseCircleLine, RiTestTubeLine, RiTimeLine,
  RiArrowRightSLine, RiArrowRightDownLine, RiArrowRightUpLine
} from 'react-icons/ri';
import Badge from '@sl/components/ui/Badge';
import ConfirmModal from '@sl/components/ui/ConfirmModal';
import { clsx } from 'clsx';
import type { AiAction, ActionStatus, Priority } from '@sl/types';
import DetailModal from '@sl/components/ui/DetailModal';

type TabValue = 'pending' | 'executing' | 'completed' | 'rejected';

const PRIORITY_BADGE: Record<Priority, React.ComponentProps<typeof Badge>['variant']> = {
  urgent: 'critical',
  high:   'warning',
  normal: 'normal',
  low:    'idle',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: '긴급', high: '주의', normal: '권장', low: '정보',
};

const TYPE_LABEL: Record<string, string> = {
  dock_assignment:      '도크 배정',
  conveyor_bypass:      '컨베이어 우회',
  equipment_maintenance:'설비 점검',
  worker_reallocation:  '작업자 재배치',
  priority_change:      '우선순위 변경',
};

const TYPE_COLOR: Record<string, string> = {
  dock_assignment:      'rgba(6,182,212,0.15)',
  conveyor_bypass:      'rgba(139,92,246,0.15)',
  equipment_maintenance:'rgba(245,158,11,0.12)',
  worker_reallocation:  'rgba(16,185,129,0.12)',
  priority_change:      'rgba(255,255,255,0.06)',
};

export default function ActionsPage() {
  const { actions, approveAction, rejectAction } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    actions.find((a) => a.status === 'pending')?.id ?? null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);

  const filteredActions = actions.filter((a) => a.status === activeTab);
  const selectedAction = actions.find((a) => a.id === selectedActionId);

  const TABS: { value: TabValue; label: string }[] = [
    { value: 'pending',   label: `대기중 (${actions.filter(a => a.status === 'pending').length})` },
    { value: 'executing', label: `실행중 (${actions.filter(a => a.status === 'executing').length})` },
    { value: 'completed', label: `완료 (${actions.filter(a => a.status === 'completed').length})` },
    { value: 'rejected',  label: `거절됨 (${actions.filter(a => a.status === 'rejected').length})` },
  ];

  // 탭 전환 시 첫 번째 항목 자동 선택
  useEffect(() => {
    const inTab = actions.filter((a) => a.status === activeTab);
    if (!selectedAction || selectedAction.status !== activeTab) {
      setSelectedActionId(inTab[0]?.id ?? null);
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // 승인/거절 후 다음 pending 액션 자동 선택
  const selectNextPending = (excludeId: string) => {
    const next = actions.find((a) => a.status === 'pending' && a.id !== excludeId);
    setSelectedActionId(next?.id ?? null);
  };

  const handleApprove = (id: string) => {
    setPendingApproveId(id);
    setConfirmOpen(true);
  };

  const handleReject = (id: string) => {
    rejectAction(id);
    selectNextPending(id);
  };

  const confirmApprove = () => {
    if (pendingApproveId) {
      approveAction(pendingApproveId);
      selectNextPending(pendingApproveId);
      setConfirmOpen(false);
      setPendingApproveId(null);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* 좌: 액션 목록 */}
      <div data-tour="act-list" className="w-[300px] lg:w-[330px] xl:w-[360px] shrink-0 flex flex-col overflow-hidden"
        style={{ borderRight: '1px solid var(--border-subtle)' }}>
        {/* 탭 */}
        <div data-tour="act-tabs" className="flex shrink-0 px-2 pt-2 gap-0.5"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'flex-1 pb-2 text-[11px] font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.value
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent hover:text-white/60'
              )}
              style={{ color: activeTab === tab.value ? '#06b6d4' : 'var(--text-muted)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
          {filteredActions.length === 0 ? (
            <EmptyTabState tab={activeTab} />
          ) : (
            filteredActions.map((action) => (
              <ActionListItem
                key={action.id}
                action={action}
                selected={selectedActionId === action.id}
                onClick={() => setSelectedActionId(action.id)}
                onApprove={() => handleApprove(action.id)}
                onReject={() => handleReject(action.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* 우: 액션 상세 */}
      <div data-tour="act-detail" className="flex-1 overflow-hidden">
        {selectedAction ? (
          <ActionDetailPane
            action={selectedAction}
            onApprove={() => handleApprove(selectedAction.id)}
            onReject={() => handleReject(selectedAction.id)}
            onShadow={() => router.push('/twin')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <RiRobotLine size={36} style={{ color: 'rgba(255,255,255,0.08)' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                액션을 선택하세요
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                좌측 목록에서 항목을 클릭하면<br />상세 내용과 근거가 표시됩니다
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="액션 실행 확인"
        description={`${actions.find(a => a.id === pendingApproveId)?.title ?? ''}\n\n이 조치를 즉시 실행합니다. 계속하시겠습니까?`}
        confirmLabel="실행"
        onConfirm={confirmApprove}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

// ─── 탭별 빈 상태 ────────────────────────────────────────────

const EMPTY_STATE: Record<TabValue, { icon: React.ReactNode; title: string; desc: string }> = {
  pending:   { icon: <RiCheckboxCircleLine size={28} className="text-emerald-400/50" />, title: '모든 추천 처리 완료', desc: 'AI가 제안한 모든 액션을 검토했습니다' },
  executing: { icon: <RiRobotLine size={28} style={{ color: 'var(--text-muted)' }} />, title: '실행 중인 액션 없음', desc: '승인된 액션이 실행되면 여기에 표시됩니다' },
  completed: { icon: <RiCheckboxCircleLine size={28} style={{ color: 'var(--text-muted)' }} />, title: '완료된 액션 없음', desc: '액션을 승인하면 실행 후 완료 목록에 추가됩니다' },
  rejected:  { icon: <RiCloseCircleLine size={28} style={{ color: 'var(--text-muted)' }} />, title: '거절된 액션 없음', desc: '거절된 액션이 없습니다' },
};

function EmptyTabState({ tab }: { tab: TabValue }) {
  const s = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
      {s.icon}
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{s.title}</p>
        <p className="text-xs leading-relaxed px-4" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
      </div>
    </div>
  );
}

// ─── 목록 아이템 ─────────────────────────────────────────────

function ActionListItem({
  action, selected, onClick, onApprove, onReject
}: {
  action: AiAction;
  selected: boolean;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 cursor-pointer transition-all"
      style={{
        background: selected ? 'rgba(6,182,212,0.06)' : 'var(--bg-elevated)',
        borderTop: `1px solid ${selected ? 'rgba(6,182,212,0.35)' : 'var(--border-subtle)'}`,
        borderRight: `1px solid ${selected ? 'rgba(6,182,212,0.35)' : 'var(--border-subtle)'}`,
        borderBottom: `1px solid ${selected ? 'rgba(6,182,212,0.35)' : 'var(--border-subtle)'}`,
        borderLeft: `2px solid ${action.priority === 'urgent' ? '#ef4444' : action.priority === 'high' ? '#f59e0b' : '#10b981'}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <RiRobotLine size={11} style={{ color: 'var(--accent-ai)', flexShrink: 0 }} />
          <span className="text-xs font-medium text-white/80 truncate">{action.title}</span>
        </div>
        <Badge variant={PRIORITY_BADGE[action.priority]} size="sm">
          {PRIORITY_LABEL[action.priority]}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: TYPE_COLOR[action.type] ?? 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
          {TYPE_LABEL[action.type]}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <RiTimeLine size={9} className="inline mr-0.5" />{action.createdAt}
        </span>
      </div>

      {action.status === 'pending' && (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={onApprove}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium"
            style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}>
            <RiCheckboxCircleLine size={10} /> 승인
          </button>
          <button onClick={onReject}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px]"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            <RiCloseCircleLine size={10} /> 거절
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 상세 패널 ───────────────────────────────────────────────

function ActionDetailPane({
  action, onApprove, onReject, onShadow
}: {
  action: AiAction;
  onApprove: () => void;
  onReject: () => void;
  onShadow: () => void;
}) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const isPending = action.status === 'pending';

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RiRobotLine size={14} style={{ color: 'var(--accent-ai)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--accent-ai)' }}>AI 추천</span>
            <Badge variant={PRIORITY_BADGE[action.priority]}>
              {PRIORITY_LABEL[action.priority]}
            </Badge>
          </div>
          <h2 className="text-base font-semibold text-white/90 mb-0.5">{action.title}</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {action.description}
          </p>
        </div>
      </div>

      {/* 메타 */}
      <div className="flex items-center gap-4 text-[11px] mb-5"
        style={{ color: 'var(--text-muted)' }}>
        <span>ID: <span className="font-mono text-white/50">{action.id}</span></span>
        <span>유형: <span style={{ color: 'var(--text-secondary)' }}>{TYPE_LABEL[action.type]}</span></span>
        <span>생성: <span style={{ color: 'var(--text-secondary)' }}>{action.createdAt}</span></span>
        <span>위험도:
          <span className={clsx('ml-1',
            action.riskLevel === 'low' ? 'text-emerald-400' :
            action.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400'
          )}>
            {action.riskLevel === 'low' ? '낮음' : action.riskLevel === 'medium' ? '보통' : '높음'}
          </span>
        </span>
      </div>

      {/* 상세 근거 버튼 */}
      {(action.expectedEffects.length > 0 || action.evidence.length > 0) && (
        <div className="mb-5">
          <button
            onClick={() => setEvidenceOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
            style={{
              background: 'rgba(139,92,246,0.08)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <RiArrowRightDownLine size={12} />
            상세 근거 보기
          </button>
        </div>
      )}

      {/* 상세 근거 모달 */}
      <DetailModal
        open={evidenceOpen}
        title="추천 근거 및 예상 효과"
        onClose={() => setEvidenceOpen(false)}
      >
        {/* 예상 효과 */}
        {action.expectedEffects.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--text-secondary)' }}>
              <RiArrowRightDownLine size={12} className="text-emerald-400" />
              예상 효과
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {action.expectedEffects.map((eff) => {
                const improved = eff.after < eff.before;
                const pct = Math.round(Math.abs(eff.after - eff.before) / eff.before * 100);
                return (
                  <div key={eff.metric} className="rounded-lg p-3"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      {eff.metric}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-white/50 line-through">
                        {eff.before}{eff.unit}
                      </span>
                      <RiArrowRightSLine size={12} style={{ color: 'var(--text-muted)' }} />
                      <span className="font-mono text-sm font-semibold text-emerald-400">
                        {eff.after}{eff.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400">
                      {improved ? <RiArrowRightDownLine size={10} /> : <RiArrowRightUpLine size={10} />}
                      {pct}% 개선
                      <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>
                        신뢰도 {Math.round(eff.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 추천 근거 */}
        {action.evidence.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              추천 근거
            </h4>
            <ul className="flex flex-col gap-2">
              {action.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[12px]">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: ev.significance === 'primary' ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}
                  />
                  <div>
                    <span className="font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {ev.label}:
                    </span>
                    <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>{ev.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DetailModal>

      {/* 실제 효과 (완료된 경우) */}
      {action.actualEffects && action.actualEffects.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold mb-2.5 text-emerald-400">실제 효과 검증</h3>
          <div className="grid grid-cols-2 gap-2">
            {action.actualEffects.map((eff) => (
              <div key={eff.metric} className="rounded-lg p-3"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{eff.metric}</div>
                <span className="font-mono text-sm font-semibold text-emerald-400">
                  {eff.before} → {eff.after}{eff.unit}
                </span>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  측정: {eff.measuredAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      {isPending && (
        <div className="flex gap-2 mt-auto pt-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#06b6d4', color: 'black' }}
          >
            <RiCheckboxCircleLine size={15} />
            승인 실행
          </button>
          <button
            onClick={onShadow}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm transition-colors"
            style={{
              background: 'rgba(139,92,246,0.12)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
            title="Shadow에서 먼저 검증"
          >
            <RiTestTubeLine size={15} />
            Shadow 검증
          </button>
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm transition-colors"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <RiCloseCircleLine size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
