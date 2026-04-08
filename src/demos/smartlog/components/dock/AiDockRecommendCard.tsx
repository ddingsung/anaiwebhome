'use client';

import { useState } from 'react';
import { RiRobotLine, RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine, RiTestTubeLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import ConfirmModal from '@sl/components/ui/ConfirmModal';
import { useRouter } from 'next/navigation';

interface AiDockRecommendCardProps {
  actionId: string;
}

export default function AiDockRecommendCard({ actionId }: AiDockRecommendCardProps) {
  const { actions, approveAction, rejectAction, docks } = useAppStore();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const action = actions.find((a) => a.id === actionId);
  if (!action || action.status !== 'pending') return null;

  const targetDock = action.affectedDockId ? docks.find((d) => d.id === action.affectedDockId) : null;

  const handleApprove = () => {
    approveAction(action.id);
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.25)',
        }}
      >
        {/* AI 배지 헤더 */}
        <div className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.08)' }}>
          <RiRobotLine size={13} style={{ color: '#a78bfa' }} />
          <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>
            AI 배정 추천
          </span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            긴급
          </span>
        </div>

        <div className="p-4">
          {/* 추천 내용 */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-white/90 mb-1">{action.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {action.description}
            </p>
          </div>

          {/* 예상 효과 */}
          {action.expectedEffects.length > 0 && (
            <div className="flex gap-3 mb-3 p-2.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {action.expectedEffects.map((eff) => (
                <div key={eff.metric} className="flex-1 text-center">
                  <div className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>{eff.metric}</div>
                  <div className="text-xs font-mono">
                    <span className="line-through" style={{ color: 'var(--text-muted)' }}>{eff.before}{eff.unit}</span>
                    <span className="mx-1" style={{ color: 'var(--text-muted)' }}>→</span>
                    <span className="font-semibold text-emerald-400">{eff.after}{eff.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 근거 토글 */}
          <button
            onClick={() => setShowEvidence((v) => !v)}
            className="flex items-center gap-1 text-[11px] mb-3 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {showEvidence ? <RiArrowUpSLine size={11} /> : <RiArrowDownSLine size={11} />}
            추천 근거 {action.evidence.length}개
          </button>

          {showEvidence && (
            <ul className="mb-3 flex flex-col gap-1.5">
              {action.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px]">
                  <span
                    className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                    style={{ background: ev.significance === 'primary' ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{ev.label}:</span> {ev.value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors"
              style={{ background: '#06b6d4', color: 'black' }}
            >
              <RiCheckboxCircleLine size={13} />
              승인 실행
            </button>
            <button
              onClick={() => router.push('/twin')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors"
              style={{
                background: 'rgba(139,92,246,0.1)',
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
              title="Shadow에서 먼저 검증"
            >
              <RiTestTubeLine size={13} />
            </button>
            <button
              onClick={() => rejectAction(action.id)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
              title="거절"
            >
              <RiCloseCircleLine size={13} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="도크 배정 실행"
        description={`${action.title}\n\n이 액션을 실행하면 즉시 도크 배정이 변경됩니다. 계속하시겠습니까?`}
        confirmLabel="배정 실행"
        onConfirm={handleApprove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
