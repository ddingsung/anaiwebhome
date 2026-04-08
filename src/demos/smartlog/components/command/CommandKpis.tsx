'use client';

import { useAppStore } from '@sl/store/useAppStore';
import KpiSummaryCard from './KpiSummaryCard';
import { RiTimeLine, RiSpeedUpLine, RiRobotLine, RiPulseLine } from 'react-icons/ri';

export default function CommandKpis() {
  const { centerKpis } = useAppStore();

  const throughputTrend = centerKpis.throughput >= 1200 ? 'up' : 'down';
  const waitTrend = centerKpis.avgWaitingMinutes <= 20 ? 'down' : 'up';
  const dockStatus = centerKpis.dockUtilization >= 85 ? 'normal' : centerKpis.dockUtilization >= 70 ? 'warning' : 'critical';
  const waitStatus = centerKpis.avgWaitingMinutes <= 20 ? 'normal' : centerKpis.avgWaitingMinutes <= 30 ? 'warning' : 'critical';

  return (
    <div
      className="shrink-0 grid grid-cols-4 gap-4 px-5 py-4"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <KpiSummaryCard
        label="센터 처리량"
        value={centerKpis.throughput.toLocaleString()}
        unit="박스/h"
        trend={throughputTrend}
        trendLabel={throughputTrend === 'up' ? '+8% vs 어제' : '-4% vs 어제'}
        trendPositive={true}
        status="normal"
        subLabel={`목표: 1,500 박스/h`}
        icon={<RiPulseLine size={14} />}
      />
      <KpiSummaryCard
        label="도크 가동률"
        value={`${centerKpis.dockUtilization}%`}
        trend="down"
        trendLabel="-5% (목표: 85%)"
        trendPositive={false}
        status={dockStatus}
        subLabel="7/9 슬롯 운영중"
        icon={<RiSpeedUpLine size={14} />}
      />
      <KpiSummaryCard
        label="평균 대기시간"
        value={centerKpis.avgWaitingMinutes}
        unit="분"
        trend={waitTrend}
        trendLabel={waitTrend === 'up' ? '+7분 (임계값 초과)' : '정상 범위'}
        trendPositive={false}
        status={waitStatus}
        subLabel="임계값: 20분"
        icon={<RiTimeLine size={14} />}
      />
      <KpiSummaryCard
        label="AI 추천 대기"
        value={centerKpis.pendingActions}
        unit="건"
        status={centerKpis.pendingActions > 0 ? 'critical' : 'normal'}
        subLabel={centerKpis.pendingActions > 0 ? '즉시 검토 필요' : '모두 처리됨'}
        icon={<RiRobotLine size={14} />}
      />
    </div>
  );
}
