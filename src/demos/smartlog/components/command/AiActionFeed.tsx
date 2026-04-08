'use client';

import { useRouter } from 'next/navigation';
import { RiRobotLine, RiArrowRightSLine, RiCheckboxCircleLine, RiCloseCircleLine, RiTimeLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import Badge from '@sl/components/ui/Badge';
import PanelHeader from '@sl/components/ui/PanelHeader';
import { Card } from '@sl/components/tremor/Card';
import { cx } from '@sl/lib/utils';
import type { ComponentProps } from 'react';
import type { AiAction, Priority } from '@sl/types';

const PRIORITY_BADGE: Record<Priority, ComponentProps<typeof Badge>['variant']> = {
  urgent: 'critical',
  high:   'warning',
  normal: 'normal',
  low:    'idle',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: '긴급',
  high:   '주의',
  normal: '권장',
  low:    '정보',
};

const ACTION_TYPE_LABEL: Record<string, string> = {
  dock_assignment:       '도크 배정',
  conveyor_bypass:       '컨베이어 우회',
  equipment_maintenance: '설비 점검',
  worker_reallocation:   '작업자 재배치',
  priority_change:       '우선순위 변경',
};

const PRIORITY_ORDER: Priority[] = ['urgent', 'high', 'normal', 'low'];

const PRIORITY_CARD_STYLE: Record<Priority, React.CSSProperties> = {
  urgent: {
    background: 'rgba(239,68,68,0.10)',
    border: '1px solid rgba(239,68,68,0.30)',
    boxShadow: '0 0 0 1px rgba(239,68,68,0.15), 0 0 20px rgba(239,68,68,0.15)',
  },
  high: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.25)',
    boxShadow: '0 0 0 1px rgba(245,158,11,0.10), 0 0 14px rgba(245,158,11,0.10)',
  },
  normal: {
    background: 'var(--bg-elevated)',
    border: '1px solid rgba(16,185,129,0.20)',
    boxShadow: 'none',
  },
  low: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'none',
  },
};

const PENDING_CARD_STYLE: Record<Priority, React.CSSProperties> = PRIORITY_CARD_STYLE;
const DONE_CARD_STYLE: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  borderColor: 'var(--border-subtle)',
};

interface ActionCardProps {
  action: AiAction;
  onClick: () => void;
}

function ActionCard({ action, onClick }: ActionCardProps) {
  const { approveAction, rejectAction } = useAppStore();
  const isPending = action.status === 'pending';

  return (
    <Card
      className="p-3 cursor-pointer transition-colors"
      style={isPending ? PENDING_CARD_STYLE[action.priority] : DONE_CARD_STYLE}
      onClick={onClick}
    >
      {/* 헤더 */}
      <div className="flex items-start gap-1.5 mb-1.5 min-w-0">
        <RiRobotLine size={13} style={{ color: 'var(--accent-ai)', flexShrink: 0, marginTop: 1 }} />
        <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {action.title}
        </span>
      </div>

      {/* 유형 + 시각 */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] px-1.5 py-0.5 rounded"
          style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}
        >
          {ACTION_TYPE_LABEL[action.type] ?? action.type}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <RiTimeLine size={10} className="inline mr-0.5" />
          {action.createdAt}
        </span>
      </div>

      {/* 버튼 */}
      {isPending && (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => approveAction(action.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors"
            style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}
          >
            <RiCheckboxCircleLine size={10} /> 승인
          </button>
          <button
            onClick={() => rejectAction(action.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <RiCloseCircleLine size={10} /> 거절
          </button>
        </div>
      )}

      {action.status === 'executing' && (
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#06b6d4' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#06b6d4' }} />
          실행 중...
        </div>
      )}

      {action.status === 'completed' && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <RiCheckboxCircleLine size={10} /> 완료
        </div>
      )}

      {action.status === 'rejected' && (
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <RiCloseCircleLine size={10} /> 거절됨
        </div>
      )}
    </Card>
  );
}

export default function AiActionFeed() {
  const { actions } = useAppStore();
  const router = useRouter();

  const pending   = actions.filter((a) => a.status === 'pending');
  const executing = actions.filter((a) => a.status === 'executing');
  const recent    = actions.filter((a) => a.status === 'completed' || a.status === 'rejected').slice(0, 3);
  const displayed = [...pending, ...executing, ...recent];

  const grouped = PRIORITY_ORDER
    .map((priority) => ({
      priority,
      label: PRIORITY_LABEL[priority],
      items: displayed.filter((a) => a.priority === priority),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        icon={<RiRobotLine size={13} />}
        title="AI 추천 피드"
        description="대기 중인 AI 조치 목록"
        badge={
          pending.length > 0 ? (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(139,92,246,0.12)',
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              {pending.length}건 대기
            </span>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <RiRobotLine size={24} style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              대기 중인 추천이 없습니다
            </p>
          </div>
        ) : (
          grouped.map(({ priority, label, items }) => (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={PRIORITY_BADGE[priority]} size="sm">{label}</Badge>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{items.length}건</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {items.map((action) => (
                  <ActionCard key={action.id} action={action} onClick={() => router.push('/actions')} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => router.push('/actions')}
        className="flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors hover:bg-white/[0.03]"
        style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        전체 액션 보기 <RiArrowRightSLine size={12} />
      </button>
    </div>
  );
}
