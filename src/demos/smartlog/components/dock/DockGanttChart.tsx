'use client';

import { useEffect, useState } from 'react';
import { RiBarChart2Line } from 'react-icons/ri';
import { useAppStore } from '@sl/store/useAppStore';
import PanelHeader from '@sl/components/ui/PanelHeader';

const RANGE_MINUTES  = 150; // -30 ~ +120
const OFFSET_MINUTES = 30;  // 현재 시각이 좌측에서 20% 지점
const LABEL_WIDTH    = 64;
const ROW_HEIGHT     = 30;
const UNLOAD_MINS    = 60;  // 대기 차량 예측 하차 소요시간 기준

/** HH:MM 문자열 → 현재 시각 기준 상대 분 (음수 = 과거) */
function minutesFromNow(timeStr: string): number | null {
  if (!timeStr?.match(/^\d{2}:\d{2}$/)) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const t   = new Date();
  t.setHours(h, m, 0, 0);
  return Math.round((t.getTime() - now.getTime()) / 60000);
}

/** ETA 전용: HH:MM 문자열 → 상대 분, 과거이면 내일로 보정 */
function etaMinutesFromNow(timeStr: string): number | null {
  if (!timeStr?.match(/^\d{2}:\d{2}$/)) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const t   = new Date();
  t.setHours(h, m, 0, 0);
  let diff = Math.round((t.getTime() - now.getTime()) / 60000);
  if (diff < 0) { t.setDate(t.getDate() + 1); diff = Math.round((t.getTime() - now.getTime()) / 60000); }
  return diff;
}

/** 분 → 타임라인 X 좌표 % */
function toX(mins: number): number {
  return Math.max(0, Math.min(100, ((mins + OFFSET_MINUTES) / RANGE_MINUTES) * 100));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getTickLabels(now: Date) {
  return Array.from({ length: 6 }, (_, i) => {
    const off = -30 + i * 30;
    return {
      pct: ((off + OFFSET_MINUTES) / RANGE_MINUTES) * 100,
      label: formatTime(new Date(now.getTime() + off * 60000)),
    };
  });
}

export default function DockGanttChart() {
  const { docks, vehicles } = useAppStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const ticks      = getTickLabels(now);
  const currentPct = toX(0); // 현재 시각 위치

  // 대기 중인 차량을 우선순위 순으로 정렬
  const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  const waitingVehicles = vehicles
    .filter((v) => v.status === 'waiting' || v.status === 'approaching')
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3));

  // 빈 도크에 대기 차량 순서대로 예측 배정
  let waitIdx = 0;
  const projections: Record<string, { vehicle: typeof vehicles[0]; startMins: number }> = {};
  docks.forEach((dock) => {
    if (dock.status === 'idle' && waitIdx < waitingVehicles.length) {
      projections[dock.id] = {
        vehicle: waitingVehicles[waitIdx],
        startMins: 10 + waitIdx * 15, // 10분 후부터 15분 간격으로 배정 예측
      };
      waitIdx++;
    }
  });

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <PanelHeader
        variant="compact"
        icon={<RiBarChart2Line size={11} />}
        title="Dock Schedule"
        description="도착 ~ 완료 예측 타임라인"
        badge={
          <span className="text-[10px] font-mono" style={{ color: 'var(--accent-cyan)' }}>
            {formatTime(now)}
          </span>
        }
      />

      {/* 눈금 라벨 */}
      <div className="relative shrink-0" style={{ height: '18px' }}>
        <div className="absolute inset-0" style={{ left: `${LABEL_WIDTH}px` }}>
          {ticks.map((tick) => (
            <span
              key={tick.pct}
              className="absolute text-[10px] font-mono"
              style={{ left: `${tick.pct}%`, transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.30)', top: '3px' }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      {/* 도크 행 */}
      <div className="overflow-hidden">
        {docks.map((dock) => {
          const vehicle = dock.currentVehicleId
            ? vehicles.find((v) => v.id === dock.currentVehicleId)
            : null;

          const arrivalMins = vehicle ? minutesFromNow(vehicle.arrivalTime) : null;
          const etaMins     = dock.estimatedCompletionTime ? etaMinutesFromNow(dock.estimatedCompletionTime) : null;

          const hasActiveBar  = arrivalMins !== null && etaMins !== null && etaMins > -OFFSET_MINUTES;
          const isHatch       = dock.status === 'maintenance' || dock.status === 'error';
          const projection    = projections[dock.id];

          // 바 좌표 계산
          const barStartX = hasActiveBar ? toX(arrivalMins!) : 0;
          const barEndX   = hasActiveBar ? toX(etaMins!)     : 0;
          const barWidth  = barEndX - barStartX;

          // 현재 시각 이전 구간(과거)과 이후 구간(미래) 분리
          const pastEndX    = Math.min(currentPct, barEndX);
          const pastWidth   = Math.max(0, pastEndX - barStartX);
          const futureStartX = Math.max(currentPct, barStartX);
          const futureWidth  = Math.max(0, barEndX - futureStartX);

          // 바 색상
          const activeColor = dock.status === 'congested'
            ? { past: 'rgba(251,146,60,0.30)', future: 'rgba(251,146,60,0.70)' }
            : { past: 'rgba(6,182,212,0.25)',  future: 'rgba(6,182,212,0.70)' };

          const hatchStyle = {
            background: dock.status === 'error'
              ? 'repeating-linear-gradient(45deg, rgba(239,68,68,0.25) 0px, rgba(239,68,68,0.25) 4px, transparent 4px, transparent 10px)'
              : 'repeating-linear-gradient(45deg, rgba(100,116,139,0.25) 0px, rgba(100,116,139,0.25) 4px, transparent 4px, transparent 10px)',
          };

          return (
            <div
              key={dock.id}
              className="flex items-center"
              style={{ height: `${ROW_HEIGHT}px`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              {/* 라벨 */}
              <div
                className="shrink-0 flex items-center justify-between px-2"
                style={{ width: `${LABEL_WIDTH}px`, borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {dock.id}
                </span>
                <span
                  className="text-[9px] font-mono"
                  style={{
                    color: dock.status === 'operating'   ? '#06b6d4'
                         : dock.status === 'congested'   ? '#fb923c'
                         : dock.status === 'error'       ? '#f87171'
                         : dock.status === 'maintenance' ? '#94a3b8'
                         : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {dock.status === 'operating'   ? `${dock.unloadingProgress}%`
                 : dock.status === 'congested'   ? '혼잡'
                 : dock.status === 'maintenance' ? '점검'
                 : dock.status === 'error'       ? '오류'
                 : ''}
                </span>
              </div>

              {/* 타임라인 */}
              <div className="relative flex-1 h-full overflow-hidden">
                {/* 눈금선 */}
                {ticks.map((tick) => (
                  <div
                    key={tick.pct}
                    className="absolute top-0 bottom-0"
                    style={{ left: `${tick.pct}%`, borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                  />
                ))}

                {/* 현재 시각 라인 */}
                <div
                  className="absolute top-0 bottom-0 z-20"
                  style={{ left: `${currentPct}%`, borderLeft: '1.5px solid rgba(239,68,68,0.65)' }}
                />

                {/* 해치 (maintenance / error) */}
                {isHatch && (
                  <div className="absolute inset-y-[3px] inset-x-0 rounded-sm" style={hatchStyle} />
                )}

                {/* 활성 바: 과거 구간 (도착 → 현재) */}
                {hasActiveBar && pastWidth > 0 && (
                  <div
                    className="absolute inset-y-[5px] rounded-l"
                    style={{ left: `${barStartX}%`, width: `${pastWidth}%`, background: activeColor.past }}
                  />
                )}

                {/* 활성 바: 미래 구간 (현재 → ETA) */}
                {hasActiveBar && futureWidth > 0 && (
                  <div
                    className="absolute inset-y-[5px] flex items-center overflow-hidden rounded-r"
                    style={{ left: `${futureStartX}%`, width: `${futureWidth}%`, background: activeColor.future }}
                  >
                    <span
                      className="text-[10px] font-mono px-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ color: 'rgba(255,255,255,0.95)' }}
                    >
                      {vehicle?.id}
                    </span>
                  </div>
                )}

                {/* 과거 구간 시작 레이블 (도착 시각) */}
                {hasActiveBar && arrivalMins! < 0 && barStartX > 0 && (
                  <div
                    className="absolute top-0 bottom-0 z-10"
                    style={{ left: `${barStartX}%`, borderLeft: '1px dashed rgba(255,255,255,0.20)' }}
                  />
                )}

                {/* 예측 배정 바 (대기 차량) */}
                {!isHatch && !hasActiveBar && projection && (() => {
                  const pStartX = toX(projection.startMins);
                  const pEndX   = toX(projection.startMins + UNLOAD_MINS);
                  const pWidth  = Math.max(0, pEndX - pStartX);
                  return pWidth > 0 ? (
                    <div
                      className="absolute inset-y-[5px] flex items-center overflow-hidden rounded"
                      style={{
                        left: `${pStartX}%`,
                        width: `${pWidth}%`,
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px dashed rgba(139,92,246,0.40)',
                      }}
                    >
                      <span
                        className="text-[10px] font-mono px-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ color: 'rgba(139,92,246,0.85)' }}
                      >
                        {projection.vehicle.id}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div
        className="flex items-center gap-4 px-3 py-1.5 text-[10px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-2 rounded-sm inline-block" style={{ background: 'rgba(6,182,212,0.65)' }} />
          하차 중 (미래)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-6 h-2 rounded-sm inline-block" style={{ background: 'rgba(6,182,212,0.25)' }} />
          하차 중 (경과)
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-6 h-2 rounded-sm inline-block"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px dashed rgba(139,92,246,0.40)' }}
          />
          배정 예측
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-3 inline-block" style={{ borderLeft: '1.5px solid rgba(239,68,68,0.65)' }} />
          현재
        </span>
      </div>
    </div>
  );
}
