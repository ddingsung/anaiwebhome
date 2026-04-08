'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@sl/store/useAppStore';
import type { SimulationResult } from '@sl/types';
import {
  RiTestTubeLine, RiFlashlightLine, RiArrowRightUpLine, RiArrowRightDownLine,
  RiArrowUpSLine, RiArrowDownSLine, RiLoader4Line, RiCheckboxCircleLine, RiAlertLine,
  RiBarChartLine,
} from 'react-icons/ri';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { clsx } from 'clsx';
import ConfirmModal from '@sl/components/ui/ConfirmModal';

export default function TwinPage() {
  const {
    policyConfig, updatePolicy,
    simulationResult, isSimulating,
    runSimulation, promoteToLive,
    centerKpis,
  } = useAppStore();

  const [promoteConfirm, setPromoteConfirm] = useState(false);
  const [promotedSnapshot, setPromotedSnapshot] = useState<SimulationResult | null>(null);
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [openSections, setOpenSections] = useState({
    dockStrategy: true,
    conveyor: false,
    buffer: false,
    priority: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePromote = () => {
    setPromotedSnapshot(simulationResult);
    promoteToLive();
    setPromoteConfirm(false);
    setCountdown(5);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          setPromotedSnapshot(null);
          return 5;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* 좌: 정책 파라미터 패널 */}
      <div data-tour="twin-params" className="w-[260px] lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col overflow-hidden"
        style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <RiTestTubeLine size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Shadow 정책 파라미터
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {/* 도크 배정 전략 */}
          <div>
            <button
              onClick={() => toggleSection('dockStrategy')}
              className="w-full flex items-center justify-between mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-[11px] font-medium">도크 배정 전략</span>
              {openSections.dockStrategy ? <RiArrowUpSLine size={12} /> : <RiArrowDownSLine size={12} />}
            </button>
            {openSections.dockStrategy && (
              <div className="flex flex-col gap-1.5">
                {[
                  { value: 'fifo', label: '선입선출 (FIFO)', desc: '도착 순서대로 배정' },
                  { value: 'priority', label: '우선순위 기반', desc: '화물·긴급도 기반 정렬' },
                  { value: 'hybrid', label: '혼합 전략', desc: '우선순위 + 장비 매칭 최적화' },
                ].map((opt) => (
                  <label key={opt.value}
                    className="flex items-start gap-2.5 p-2.5 rounded-md cursor-pointer transition-colors"
                    style={{
                      background: policyConfig.dockAssignmentStrategy === opt.value
                        ? 'rgba(6,182,212,0.08)'
                        : 'var(--bg-elevated)',
                      border: `1px solid ${policyConfig.dockAssignmentStrategy === opt.value
                        ? 'rgba(6,182,212,0.35)'
                        : 'var(--border-subtle)'}`,
                    }}>
                    <input
                      type="radio"
                      name="strategy"
                      value={opt.value}
                      checked={policyConfig.dockAssignmentStrategy === opt.value}
                      onChange={() => updatePolicy({ dockAssignmentStrategy: opt.value as 'fifo' | 'priority' | 'hybrid' })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <div>
                      <div className="text-xs font-medium text-white/80">{opt.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 컨베이어 우회 임계값 */}
          <div>
            <button
              onClick={() => toggleSection('conveyor')}
              className="w-full flex items-center justify-between mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-[11px] font-medium">컨베이어 우회 임계값</span>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span className="font-mono">{policyConfig.conveyorBypassThreshold}%</span>
                {openSections.conveyor ? <RiArrowUpSLine size={12} /> : <RiArrowDownSLine size={12} />}
              </div>
            </button>
            {openSections.conveyor && (
              <>
                <input
                  type="range" min={50} max={95} step={5}
                  value={policyConfig.conveyorBypassThreshold}
                  onChange={(e) => updatePolicy({ conveyorBypassThreshold: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#06b6d4', background: `linear-gradient(to right, #06b6d4 ${(policyConfig.conveyorBypassThreshold - 50) / 45 * 100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>50%</span><span>95%</span>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                  처리량이 임계값 초과 시 자동 우회 경로 추천
                </p>
              </>
            )}
          </div>

          {/* 버퍼 한도 */}
          <div>
            <button
              onClick={() => toggleSection('buffer')}
              className="w-full flex items-center justify-between mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-[11px] font-medium">버퍼 한도</span>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span className="font-mono">{policyConfig.bufferLimit}박스</span>
                {openSections.buffer ? <RiArrowUpSLine size={12} /> : <RiArrowDownSLine size={12} />}
              </div>
            </button>
            {openSections.buffer && (
              <>
                <input
                  type="range" min={5} max={50} step={5}
                  value={policyConfig.bufferLimit}
                  onChange={(e) => updatePolicy({ bufferLimit: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#06b6d4' }}
                />
                <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>5</span><span>50</span>
                </div>
              </>
            )}
          </div>

          {/* 우선순위 가중치 */}
          <div>
            <button
              onClick={() => toggleSection('priority')}
              className="w-full flex items-center justify-between mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-[11px] font-medium">우선순위 가중치</span>
              {openSections.priority ? <RiArrowUpSLine size={12} /> : <RiArrowDownSLine size={12} />}
            </button>
            {openSections.priority && (
              <>
                {[
                  { key: 'cargoType' as const, label: '화물 유형' },
                  { key: 'waitingTime' as const, label: '대기 시간' },
                  { key: 'dockEquipment' as const, label: '도크 장비 매칭' },
                ].map(({ key, label }) => (
                  <div key={key} className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {policyConfig.priorityWeights[key]}%
                      </span>
                    </div>
                    <input
                      type="range" min={10} max={60} step={5}
                      value={policyConfig.priorityWeights[key]}
                      onChange={(e) => updatePolicy({
                        priorityWeights: { ...policyConfig.priorityWeights, [key]: Number(e.target.value) }
                      })}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: '#8b5cf6' }}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 시뮬레이션 실행 버튼 */}
        <div data-tour="twin-run" className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            style={{ background: '#06b6d4', color: 'black' }}
          >
            {isSimulating ? (
              <><RiLoader4Line size={15} className="animate-spin" /> 시뮬레이션 실행 중…</>
            ) : (
              <><RiTestTubeLine size={15} /> Shadow 시뮬레이션 실행</>
            )}
          </button>
        </div>
      </div>

      {/* 우: 결과 비교 */}
      <div data-tour="twin-result" className="flex-1 flex flex-col overflow-hidden">
        {/* 모드 배너 */}
        <div className="flex items-center gap-4 px-4 py-2.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-semibold text-red-400">LIVE</span>
          </div>
          <span style={{ color: 'var(--border-default)' }}>↔</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs font-semibold text-blue-400">SHADOW</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {promotedSnapshot ? 'LIVE 승격 완료' : simulationResult ? '시뮬레이션 완료' : '파라미터를 조정하고 시뮬레이션을 실행하세요'}
          </span>
        </div>

        {/* 승격 성공 화면 */}
        {promotedSnapshot ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
            {/* 성공 아이콘 */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)' }}
            >
              <RiCheckboxCircleLine size={36} className="text-emerald-400" />
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400 mb-1">LIVE 승격 완료</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Shadow 정책이 실운영 시스템에 반영되었습니다
              </div>
            </div>

            {/* 적용된 KPI 요약 */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {promotedSnapshot.improvementSummary.slice(0, 4).map((item) => (
                <div
                  key={item.metric}
                  className="rounded-lg p-3 text-center"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}
                >
                  <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{item.metric}</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono text-xs text-white/40 line-through">{item.liveBefore.toLocaleString()}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>→</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{item.shadowAfter.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mt-1 text-[10px] text-emerald-400">
                    <RiArrowRightUpLine size={10} />+{item.improvementPct}%
                  </div>
                </div>
              ))}
            </div>

            {/* AI 액션 안내 */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full max-w-sm"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.20)' }}
            >
              <RiBarChartLine size={16} style={{ color: '#06b6d4', flexShrink: 0 }} />
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: '#06b6d4', fontWeight: 600 }}>AI 추천 피드</span>에 모니터링 액션이 추가되었습니다. 처음 4시간 동안 집중 모니터링을 권장합니다.
              </div>
            </div>

            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {countdown}초 후 초기화됩니다
            </div>
          </div>
        ) : simulationResult ? (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* KPI 비교 카드 */}
            <div className="grid grid-cols-4 gap-3">
              {simulationResult.improvementSummary.map((item) => (
                <KpiCompareCard
                  key={item.metric}
                  metric={item.metric}
                  live={item.liveBefore}
                  shadow={item.shadowAfter}
                  unit={item.unit}
                  pct={item.improvementPct}
                  positive={item.positive}
                />
              ))}
            </div>

            {/* 비교 차트 */}
            <div className="rounded-lg p-4 flex-1"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  처리량 비교 (LIVE vs SHADOW)
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-red-400 inline-block" />
                    <span style={{ color: 'var(--text-muted)' }}>LIVE</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-blue-400 inline-block border-dashed" />
                    <span style={{ color: 'var(--text-muted)' }}>SHADOW</span>
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={simulationResult.timeSeriesComparison}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: '11px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                  />
                  <Line type="monotone" dataKey="live" stroke="#ef4444" strokeWidth={1.5} dot={false} name="LIVE" />
                  <Line type="monotone" dataKey="shadow" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="SHADOW" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 검증 요약 + 승격 버튼 */}
            <div className="rounded-lg p-4"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiCheckboxCircleLine size={16} className="text-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-400">검증 완료 — 개선 효과 확인됨</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      신뢰도 {Math.round(simulationResult.validationConfidence * 100)}% ·
                      위험도: {simulationResult.riskAssessment === 'low' ? '낮음' : simulationResult.riskAssessment === 'medium' ? '보통' : '높음'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPromoteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: '#10b981', color: 'black' }}
                >
                  <RiFlashlightLine size={14} />
                  Shadow → LIVE 승격
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <RiTestTubeLine size={28} style={{ color: '#06b6d4' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/70 mb-1">
                Shadow 시뮬레이션 준비됨
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                좌측에서 정책 파라미터를 조정하고<br />시뮬레이션을 실행하세요
              </p>
            </div>
            {isSimulating && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#06b6d4' }}>
                <RiLoader4Line size={16} className="animate-spin" />
                시뮬레이션 실행 중...
              </div>
            )}
          </div>
        )}
      </div>


      <ConfirmModal
        open={promoteConfirm}
        title="Shadow 정책을 LIVE에 적용"
        description="이 조치는 즉시 실운영 정책에 반영됩니다. Shadow 시뮬레이션에서 검증된 결과를 바탕으로 진행하시겠습니까?"
        confirmLabel="LIVE 적용"
        onConfirm={handlePromote}
        onCancel={() => setPromoteConfirm(false)}
      />
    </div>
  );
}

function KpiCompareCard({
  metric, live, shadow, unit, pct, positive
}: {
  metric: string; live: number; shadow: number;
  unit: string; pct: number; positive: boolean;
}) {
  const improved = positive ? shadow > live : shadow < live;

  return (
    <div className="rounded-lg p-3"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{metric}</div>
      <div className="flex items-center gap-1 mb-1">
        <span className="font-mono text-sm text-white/40 line-through">{live.toLocaleString()}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>→</span>
        <span className="font-mono text-sm font-bold text-emerald-400">{shadow.toLocaleString()}</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{unit}</span>
      </div>
      <div className={clsx('flex items-center gap-0.5 text-[11px]', improved ? 'text-emerald-400' : 'text-red-400')}>
        {improved ? <RiArrowRightUpLine size={11} /> : <RiArrowRightDownLine size={11} />}
        {improved ? '+' : ''}{pct}%
      </div>
    </div>
  );
}
