'use client';

import { useState } from 'react';
import { RiRobotLine, RiCheckboxCircleLine, RiCloseCircleLine, RiTestTubeLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import ConfirmModal from '@sl/components/ui/ConfirmModal';
import { useRouter } from 'next/navigation';

interface AiConveyorRecommendCardProps {
  actionId: string;
}

const PRIORITY_COLOR: Record<string, { bg: string; text: string; border: string; label: string }> = {
  urgent: { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.25)',   label: '긴급' },
  high:   { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.25)',  label: '주의' },
  normal: { bg: 'rgba(6,182,212,0.12)',   text: '#06b6d4', border: 'rgba(6,182,212,0.25)',   label: '권장' },
  low:    { bg: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)', label: '정보' },
};

export default function AiConveyorRecommendCard({ actionId }: AiConveyorRecommendCardProps) {
  const { actions, approveAction, rejectAction } = useAppStore();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const action = actions.find((a) => a.id === actionId);
  if (!action || action.status !== 'pending') return null;

  const pri = PRIORITY_COLOR[action.priority] ?? PRIORITY_COLOR.normal;

  return (
    <>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.22)',
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: '1px solid rgba(6,182,212,0.12)', background: 'rgba(6,182,212,0.07)' }}
        >
          <RiRobotLine size={12} style={{ color: '#06b6d4' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#67e8f9' }}>
            AI 우회 추천
          </span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: pri.bg, color: pri.text, border: `1px solid ${pri.border}` }}
          >
            {pri.label}
          </span>
        </div>

        <div className="p-3">
          {/* 추천 내용 */}
          <p className="text-xs font-semibold text-white/90 mb-1 leading-snug">{action.title}</p>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            {action.description}
          </p>

          {/* 예상 효과 */}
          {action.expectedEffects.length > 0 && (
            <div
              className="flex gap-2 mb-3 p-2 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {action.expectedEffects.slice(0, 2).map((eff) => (
                <div key={eff.metric} className="flex-1 text-center">
                  <div className="text-[9px] mb-0.5" style={{ color: 'var(--text-muted)' }}>{eff.metric}</div>
                  <div className="text-[11px] font-mono">
                    <span className="line-through" style={{ color: 'var(--text-muted)' }}>{eff.before}{eff.unit}</span>
                    <span className="mx-1" style={{ color: 'var(--text-muted)' }}>→</span>
                    <span className="font-semibold text-emerald-400">{eff.after}{eff.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 근거 토글 */}
          {action.evidence.length > 0 && (
            <>
              <button
                onClick={() => setShowEvidence((v) => !v)}
                className="flex items-center gap-1 text-[10px] mb-2 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {showEvidence ? <RiArrowUpSLine size={10} /> : <RiArrowDownSLine size={10} />}
                추천 근거 {action.evidence.length}개
              </button>

              {showEvidence && (
                <ul className="mb-3 flex flex-col gap-1">
                  {action.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px]">
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                        style={{ background: ev.significance === 'primary' ? '#06b6d4' : 'rgba(255,255,255,0.2)' }}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{ev.label}:</span> {ev.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* 버튼 */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] font-medium transition-colors"
              style={{ background: '#06b6d4', color: 'black' }}
            >
              <RiCheckboxCircleLine size={12} />
              우회 실행
            </button>
            <button
              onClick={() => router.push('/twin')}
              className="flex items-center justify-center px-2.5 py-1.5 rounded-md text-[11px] transition-colors"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
              title="Shadow에서 먼저 검증"
            >
              <RiTestTubeLine size={12} />
            </button>
            <button
              onClick={() => rejectAction(action.id)}
              className="flex items-center justify-center px-2.5 py-1.5 rounded-md text-[11px] transition-colors"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              title="거절"
            >
              <RiCloseCircleLine size={12} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="컨베이어 우회 실행"
        description={`${action.title}\n\n이 액션을 실행하면 즉시 컨베이어 경로가 변경됩니다. 계속하시겠습니까?`}
        confirmLabel="우회 실행"
        onConfirm={() => { approveAction(action.id); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
