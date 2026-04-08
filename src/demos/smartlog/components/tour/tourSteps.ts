export interface TourStep {
  page: string;
  target: string;   // [data-tour="..."] 어트리뷰트로 DOM 요소를 찾음
  title: string;
  description: string;
  bubbleSide: 'top' | 'bottom' | 'left' | 'right';
  badge?: string;
}

export const TOUR_STEPS: TourStep[] = [
  // ─── Command ─────────────────────────────────────────────────
  {
    page: '/command',
    target: 'cmd-kpi',
    title: '실시간 핵심 지표 (KPI)',
    description: '처리량·평균 대기시간·도크 가동률·활성 알림 4개 지표가 3초마다 자동 갱신됩니다. 색상이 바뀌면 임계값 초과 상태를 의미합니다.',
    bubbleSide: 'bottom',
    badge: '전체 관제',
  },
  {
    page: '/command',
    target: 'cmd-ai-feed',
    title: 'AI 추천 피드',
    description: 'AI가 분류한 긴급·주의·권장 액션이 우선순위 순서로 표시됩니다. Actions 탭에서 승인하면 실운영에 즉시 반영됩니다.',
    bubbleSide: 'right',
    badge: 'AI 추천',
  },
  {
    page: '/command',
    target: 'cmd-dock',
    title: '도크 실시간 현황',
    description: '9개 도크의 운영 상태를 실시간으로 표시합니다. Dock 탭으로 이동하면 도크 클릭 시 배정 상세 및 간트 차트를 확인할 수 있습니다.',
    bubbleSide: 'right',
    badge: '운영 핵심',
  },
  {
    page: '/command',
    target: 'cmd-conveyor',
    title: '컨베이어 흐름 미니맵',
    description: '컨베이어 노드별 utilization을 축약해서 표시합니다. 붉은 노드는 병목 임계값 초과 상태이며, Conveyor 탭에서 전체 토폴로지를 확인할 수 있습니다.',
    bubbleSide: 'left',
    badge: '컨베이어',
  },
  {
    page: '/command',
    target: 'cmd-alerts',
    title: '설비 알림 패널',
    description: '임계값을 초과한 설비 알림을 실시간으로 표시합니다. 빨간 점이 Critical, 노란 점이 Warning 상태이며 클릭하면 Actions 탭에서 대응 방법을 확인할 수 있습니다.',
    bubbleSide: 'left',
  },

  // ─── Dock ─────────────────────────────────────────────────────
  {
    page: '/dock',
    target: 'dock-yard',
    title: '야드 배치도',
    description: '물류센터 야드의 물리적 도크 배치를 표시합니다. 도크 색상이 운영 상태를 나타내며, 클릭하면 해당 도크가 선택됩니다. AI 추천 카드가 있을 경우 하단에 표시됩니다.',
    bubbleSide: 'right',
    badge: '야드 관제',
  },
  {
    page: '/dock',
    target: 'dock-grid',
    title: '도크 슬롯 그리드',
    description: '9개 도크의 상태·차량·하차 진행률을 카드로 표시합니다. 카드를 클릭하면 우측에 도크 상세 드로어가 열려 배정 차량 정보와 예측 완료 시각을 확인할 수 있습니다.',
    bubbleSide: 'right',
  },
  {
    page: '/dock',
    target: 'dock-queue',
    title: '대기 차량 큐',
    description: '입차 대기 중인 차량을 우선순위 순으로 표시합니다. Urgent → High → Normal → Low 순으로 정렬되며, 하차 완료된 도크에 자동으로 재배정됩니다.',
    bubbleSide: 'left',
    badge: '대기열',
  },
  {
    page: '/dock',
    target: 'dock-gantt',
    title: '도크 스케줄 Gantt',
    description: '도크별 도착→하차 완료 예측 타임라인입니다. 밝은 색은 미래 구간, 어두운 색은 경과 구간이며, 보라색 점선은 대기 차량 예측 배정 일정입니다.',
    bubbleSide: 'top',
    badge: '예측 스케줄',
  },

  // ─── Conveyor ─────────────────────────────────────────────────
  {
    page: '/conveyor',
    target: 'conv-layers',
    title: '레이어 토글',
    description: '처리량 / 설비 상태 / 백로그 3가지 뷰로 전환할 수 있습니다. 병목 원인 파악에 따라 레이어를 전환하며 분석하세요.',
    bubbleSide: 'bottom',
  },
  {
    page: '/conveyor',
    target: 'conv-bottleneck',
    title: '병목 감지 패널',
    description: 'critical·warning 상태 노드를 실시간으로 감지합니다. 목록을 클릭하면 해당 노드가 토폴로지에서 선택되어 강조 표시됩니다.',
    bubbleSide: 'right',
    badge: '병목 감지',
  },
  {
    page: '/conveyor',
    target: 'conv-topology',
    title: '컨베이어 토폴로지',
    description: '노드를 클릭하면 utilization·throughput·backlog 상세 정보가 우측 패널에 표시됩니다. 붉은 노드가 병목 지점, 노란 노드가 경고 상태입니다.',
    bubbleSide: 'left',
    badge: '토폴로지',
  },

  // ─── Actions ──────────────────────────────────────────────────
  {
    page: '/actions',
    target: 'act-tabs',
    title: 'AI 액션 탭',
    description: '대기·실행 중·완료·거절 4가지 상태로 분류됩니다. 대기 탭이 핵심이며, 처리되지 않은 AI 추천이 여기 쌓입니다.',
    bubbleSide: 'bottom',
  },
  {
    page: '/actions',
    target: 'act-list',
    title: '액션 목록',
    description: '우선순위 배지와 액션 유형이 표시됩니다. 항목을 클릭하면 우측에 AI 추천 근거와 예상 효과가 펼쳐집니다. 승인/거절 후 자동으로 다음 항목이 선택됩니다.',
    bubbleSide: 'right',
    badge: '액션 목록',
  },
  {
    page: '/actions',
    target: 'act-detail',
    title: '근거 · 예상 효과',
    description: 'AI가 추천한 근거(지표·예측·이력)와 예상 효과, 위험도가 표시됩니다. 승인 버튼을 누르면 도크·KPI·컨베이어 상태에 즉시 사이드이펙트가 반영됩니다.',
    bubbleSide: 'left',
    badge: '상세 분석',
  },

  // ─── Twin ─────────────────────────────────────────────────────
  {
    page: '/twin',
    target: 'twin-params',
    title: '정책 파라미터',
    description: '도크 배정 전략(FIFO/우선순위/혼합)·컨베이어 우회 임계값·버퍼 한도·우선순위 가중치를 조정합니다. 각 파라미터가 시뮬레이션 결과에 직접 반영됩니다.',
    bubbleSide: 'right',
    badge: 'Shadow Twin',
  },
  {
    page: '/twin',
    target: 'twin-run',
    title: 'Shadow 시뮬레이션 실행',
    description: '파라미터 조정 후 이 버튼으로 Shadow 환경에서 효과를 미리 검증합니다. 실운영 데이터에는 아무 영향이 없으며, 결과 확인 후 LIVE 승격 여부를 결정합니다.',
    bubbleSide: 'right',
  },
  {
    page: '/twin',
    target: 'twin-result',
    title: 'LIVE vs SHADOW 비교',
    description: '시뮬레이션 완료 후 현재 LIVE 지표와 Shadow 예측 지표를 카드와 차트로 비교합니다. 개선 효과가 확인되면 "Shadow → LIVE 승격" 버튼으로 실운영에 반영합니다.',
    bubbleSide: 'left',
    badge: '결과 비교',
  },
];
