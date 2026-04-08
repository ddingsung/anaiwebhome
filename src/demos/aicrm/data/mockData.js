// ─── Date helpers (always relative to today — safe for demos) ────────────────
const _ago = (days, hour = 9, min = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, min, 0, 0)
  return d.toISOString().slice(0, 19)
}
const _fromNow = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
// Days in stage — grows naturally from anchor date (Mar 27, 2026)
const _ANCHOR = new Date('2026-03-27')
const _daysSinceAnchor = Math.floor((new Date() - _ANCHOR) / 86400000)
const _stageAge = (daysAtAnchor) => daysAtAnchor + Math.max(0, _daysSinceAnchor)

// M/D format (e.g. "4/3")
const _dateStr = (offsetDays) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
// Korean day-of-week (e.g. "화")
const _dayOfWeek = (offsetDays) => {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return days[d.getDay()]
}
// English "Mon DD" format (e.g. "Apr 30")
const _monthDayEn = (offsetDays) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${months[d.getMonth()]} ${d.getDate()}`
}

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
export const accounts = [
  {
    id: 'acc_001',
    name: 'Nexus Analytics',
    domain: 'nexusanalytics.io',
    industry: 'Data & Analytics SaaS',
    fundingStage: 'Series B ($45M)',
    employees: '280',
    location: 'San Francisco, CA',
    arr: 420000,
    urgencyScore: 94,
    riskLevel: 'critical',
    relationshipTemp: 65,
    successProbability: 42,
    dealId: 'deal_001',
    trend: 'declining',
    lastActivity: '2h ago',
    tags: ['High Value', 'Competitor Risk', 'Champion Leaving'],
    signalIds: ['sig_001', 'sig_002', 'sig_003'],
    contactIds: ['con_001', 'con_002'],
    recommendationId: 'rec_001',
    summary: '챔피언 이탈 임박 + 경쟁사 데모 전 — 제안서 열람 급증으로 개입 최적 타이밍.',
    urgencyDeadline: `Salesforce 데모 D-2 (${_dateStr(2)}) · Champion 이탈 D-34`,
    rankDrivers: ['챔피언 이탈 임박', '경쟁사 데모 내일모레', '제안서 48h 내 7회 열람'],
  },
  {
    id: 'acc_002',
    name: 'Meridian Health Systems',
    domain: 'meridianhealth.com',
    industry: 'Enterprise Healthcare Tech',
    fundingStage: 'PE-backed (Blackstone)',
    employees: '1,200',
    location: 'Boston, MA',
    arr: 680000,
    urgencyScore: 88,
    riskLevel: 'high',
    relationshipTemp: 72,
    successProbability: 58,
    dealId: 'deal_002',
    trend: 'stable',
    lastActivity: '1d ago',
    tags: ['Largest Deal', 'Legal Stall', 'Gong Competitor'],
    signalIds: ['sig_004', 'sig_005', 'sig_006'],
    contactIds: ['con_003', 'con_004'],
    recommendationId: 'rec_002',
    summary: 'HIPAA 검토 23일 지연 + Gong.io 경쟁 데모 화요일 예정. 법무 블로커 제거가 핵심.',
    urgencyDeadline: `Gong.io 데모 내일(${_dateStr(1)}) · Legal Review 23일째 지연`,
    rankDrivers: ['$680K 딜 위험', '경쟁사 데모 내일', 'Exec 스폰서 이탈 감지'],
  },
  {
    id: 'acc_003',
    name: 'Cascade Systems',
    domain: 'cascadesystems.io',
    industry: 'Manufacturing Ops SaaS',
    fundingStage: 'Series A ($12M)',
    employees: '85',
    location: 'Austin, TX',
    arr: 180000,
    urgencyScore: 76,
    riskLevel: 'medium',
    relationshipTemp: 58,
    successProbability: 61,
    dealId: 'deal_003',
    trend: 'declining',
    lastActivity: '8d ago',
    tags: ['No Response', 'Budget Shift', 'Ref Pending'],
    signalIds: ['sig_007', 'sig_008'],
    contactIds: ['con_005'],
    recommendationId: 'rec_003',
    summary: 'COO 데모에서 47개 질문했으나 8일 침묵. 약속한 레퍼런스 미이행 → 신뢰 회복 필요.',
    urgencyDeadline: '8일째 무응답 · 신뢰 회복 시간 줄어드는 중',
    rankDrivers: ['8일 무응답', '약속한 레퍼런스 미이행', '예산 우선순위 변동 리스크'],
  },
  {
    id: 'acc_004',
    name: 'Vertex Commerce',
    domain: 'vertexcommerce.com',
    industry: 'E-commerce Growth Platform',
    fundingStage: 'Seed+ ($8M)',
    employees: '45',
    location: 'New York, NY',
    arr: 95000,
    urgencyScore: 71,
    riskLevel: 'low',
    relationshipTemp: 88,
    successProbability: 82,
    dealId: 'deal_004',
    trend: 'improving',
    lastActivity: '3h ago',
    tags: ['Ready to Close', 'Legal Only', 'Hot'],
    signalIds: ['sig_009'],
    contactIds: ['con_006'],
    recommendationId: 'rec_004',
    summary: '모든 이해관계자 승인 완료. 법무 검토만 남음. 이번 주 클로징 가능.',
    urgencyDeadline: `Q1 클로징 가능 — 이번 주 금요일(${_dateStr(1)})`,
    rankDrivers: ['모든 이해관계자 승인 완료', '법무 검토만 남음', 'Q1 클로징 가능'],
  },
  {
    id: 'acc_005',
    name: 'Pinnacle Logistics',
    domain: 'pinnaclelogistics.com',
    industry: 'Enterprise Logistics & SCM',
    fundingStage: 'Series C ($78M)',
    employees: '850',
    location: 'Chicago, IL',
    arr: 340000,
    urgencyScore: 62,
    riskLevel: 'medium',
    relationshipTemp: 52,
    successProbability: 54,
    dealId: 'deal_005',
    trend: 'stable',
    lastActivity: '3d ago',
    tags: ['Security Review', 'Slow Eval', 'Q2 Risk'],
    signalIds: ['sig_010', 'sig_011'],
    contactIds: ['con_007', 'con_008'],
    recommendationId: 'rec_005',
    summary: 'CTO는 긍정적이나 IT 보안팀 12개 질문 미해소. 35일 평가 — Q2 슬립 위험.',
    urgencyDeadline: '35일째 평가 진행 · Q2 슬립 위험 64%',
    rankDrivers: ['보안 검토 답변 5개 미완', '평가 기간 초과', 'Q2 이월 위험'],
  },
  {
    id: 'acc_006',
    name: 'Summit Logistics Group',
    domain: 'summitlogistics.com',
    industry: 'Enterprise Logistics & SCM',
    fundingStage: 'Series B ($62M)',
    employees: '620',
    location: 'Dallas, TX',
    arr: 520000,
    urgencyScore: 79,
    riskLevel: 'high',
    relationshipTemp: 61,
    successProbability: 58,
    dealId: 'deal_006',
    trend: 'declining',
    lastActivity: '2d ago',
    tags: ['Competitor Risk', 'SAP', 'Legal Review'],
    signalIds: ['sig_012', 'sig_013'],
    contactIds: ['con_009'],
    recommendationId: 'rec_006',
    summary: 'SAP 경쟁사 데모 진행 중. Exec 스폰서 응답 5일 중단. 법무 검토 단계에서 경쟁 우위 확보 필요.',
    urgencyDeadline: `SAP 경쟁 평가 진행 중 · D-${_stageAge(12)} 결정 예상`,
    rankDrivers: ['SAP 경쟁 평가', 'Exec 스폰서 이탈', '$520K ARR 딜 위험'],
  },
  {
    id: 'acc_007',
    name: 'Apex Financial Tech',
    domain: 'apexfintech.io',
    industry: 'FinTech SaaS',
    fundingStage: 'Series A ($28M)',
    employees: '140',
    location: 'Chicago, IL',
    arr: 285000,
    urgencyScore: 65,
    riskLevel: 'high',
    relationshipTemp: 74,
    successProbability: 71,
    dealId: 'deal_007',
    trend: 'stable',
    lastActivity: '1d ago',
    tags: ['Budget Risk', 'Q2 Freeze', 'Contract Review'],
    signalIds: ['sig_014'],
    contactIds: ['con_010'],
    recommendationId: 'rec_007',
    summary: 'Q2 예산 동결 전 계약 서명 필수. CFO 최종 승인 대기 중. 이번 주 클로징 가능.',
    urgencyDeadline: `Q2 예산 동결 전 계약 필요 · D-5`,
    rankDrivers: ['Q2 예산 동결 리스크', 'CFO 승인 대기', '계약 단계 진입'],
  },
  {
    id: 'acc_008',
    name: 'Helix Biotech',
    domain: 'helixbiotech.com',
    industry: 'Life Sciences SaaS',
    fundingStage: 'Series A ($19M)',
    employees: '95',
    location: 'San Diego, CA',
    arr: 175000,
    urgencyScore: 51,
    riskLevel: 'medium',
    relationshipTemp: 67,
    successProbability: 55,
    dealId: 'deal_008',
    trend: 'stable',
    lastActivity: '4d ago',
    tags: ['Security Review', 'Life Sciences'],
    signalIds: ['sig_015'],
    contactIds: ['con_011'],
    recommendationId: 'rec_008',
    summary: 'CTO 기술 검토 완료. FDA 컴플라이언스 문서 요청 대기 중. 보안 검토가 유일한 블로커.',
    urgencyDeadline: 'FDA 컴플라이언스 문서 제출 대기 중',
    rankDrivers: ['컴플라이언스 문서 미완', '기술 검토 완료', '클로징 잠재력 높음'],
  },
  {
    id: 'acc_009',
    name: 'NovaTech Systems',
    domain: 'novatechsys.com',
    industry: 'Enterprise Infrastructure',
    fundingStage: 'PE-backed (KKR)',
    employees: '2,400',
    location: 'Seattle, WA',
    arr: 1100000,
    urgencyScore: 44,
    riskLevel: 'medium',
    relationshipTemp: 55,
    successProbability: 38,
    dealId: 'deal_009',
    trend: 'stable',
    lastActivity: '6d ago',
    tags: ['Multi-Stakeholder', 'Long Cycle', 'Enterprise'],
    signalIds: ['sig_016'],
    contactIds: ['con_012'],
    recommendationId: 'rec_009',
    summary: '7명 이해관계자 조율 중. 제안서 검토 2주째. 구매위원회 승인 프로세스 진행 중.',
    urgencyDeadline: '구매위원회 검토 2주째 진행 중',
    rankDrivers: ['다수 이해관계자 조율', '장기 사이클', '대형 ARR 잠재'],
  },
  {
    id: 'acc_010',
    name: 'Driftwood Media',
    domain: 'driftwoodmedia.com',
    industry: 'Media & Content SaaS',
    fundingStage: 'Seed+ ($5M)',
    employees: '38',
    location: 'Los Angeles, CA',
    arr: 92000,
    urgencyScore: 38,
    riskLevel: 'low',
    relationshipTemp: 83,
    successProbability: 72,
    dealId: 'deal_010',
    trend: 'improving',
    lastActivity: '5h ago',
    tags: ['Ready to Close', 'Hot'],
    signalIds: ['sig_017'],
    contactIds: ['con_013'],
    recommendationId: 'rec_010',
    summary: '모든 검토 완료. CEO 구두 승인. 계약서 최종 서명만 남은 상태.',
    urgencyDeadline: '최종 서명 단계 — 이번 주 내 클로징 가능',
    rankDrivers: ['CEO 구두 승인', '클로징 임박', '모든 검토 완료'],
  },
]

// ─── DEALS ───────────────────────────────────────────────────────────────────
export const deals = [
  {
    id: 'deal_001', accountId: 'acc_001',
    name: 'Enterprise Intelligence Suite',
    value: 420000, stage: 'Final Proposal',
    probability: 42, riskLevel: 'critical',
    closeDate: _fromNow(19), daysInStage: _stageAge(18),
    competitors: ['Salesforce', 'HubSpot'],
    nextStep: 'Jennifer Park 즉시 접촉 — 경쟁사 데모 전 포지셔닝 선점',
  },
  {
    id: 'deal_002', accountId: 'acc_002',
    name: 'Full Platform License',
    value: 680000, stage: 'Legal Review',
    probability: 58, riskLevel: 'high',
    closeDate: _fromNow(4), daysInStage: _stageAge(23),
    competitors: ['Gong.io'],
    nextStep: 'HIPAA 완성 문서 즉시 제출 + Dr. Walsh 직접 재접촉',
  },
  {
    id: 'deal_003', accountId: 'acc_003',
    name: 'Team Operations License',
    value: 180000, stage: 'Proposal Sent',
    probability: 61, riskLevel: 'medium',
    closeDate: _fromNow(34), daysInStage: _stageAge(8),
    competitors: ['Pipedrive'],
    nextStep: '레퍼런스 고객 소개 + COO 직접 전화 재접촉',
  },
  {
    id: 'deal_004', accountId: 'acc_004',
    name: 'Revenue Acceleration Pack',
    value: 95000, stage: 'Contract Review',
    probability: 82, riskLevel: 'low',
    closeDate: _fromNow(1), daysInStage: _stageAge(2),
    competitors: [],
    nextStep: '법무팀 직접 연결 — 48h 내 계약 완료 목표',
  },
  {
    id: 'deal_005', accountId: 'acc_005',
    name: 'Supply Chain Intelligence',
    value: 340000, stage: 'Technical Evaluation',
    probability: 54, riskLevel: 'medium',
    closeDate: _fromNow(65), daysInStage: _stageAge(35),
    competitors: ['Clari', 'Gong.io'],
    nextStep: '미답변 보안 질문 5개 이번 주 완료 + 평가 마감일 설정',
  },
  {
    id: 'deal_006', accountId: 'acc_006',
    name: 'Enterprise SCM Suite',
    value: 310000, stage: 'Legal Review',
    probability: 58, riskLevel: 'high',
    closeDate: _fromNow(8), daysInStage: _stageAge(11),
    competitors: ['SAP', 'Oracle'],
    nextStep: 'SAP 차별화 자료 준비 + Exec 스폰서 직접 재접촉',
  },
  {
    id: 'deal_007', accountId: 'acc_007',
    name: 'FinTech Revenue Intelligence',
    value: 140000, stage: 'Contract Review',
    probability: 71, riskLevel: 'high',
    closeDate: _fromNow(5), daysInStage: _stageAge(6),
    competitors: [],
    nextStep: 'CFO와 직접 계약 조건 합의 — 이번 주 서명 목표',
  },
  {
    id: 'deal_008', accountId: 'acc_008',
    name: 'Life Sciences Analytics Platform',
    value: 220000, stage: 'Technical Evaluation',
    probability: 55, riskLevel: 'medium',
    closeDate: _fromNow(42), daysInStage: _stageAge(14),
    competitors: ['Veeva'],
    nextStep: 'FDA 컴플라이언스 패키지 제출 + 보안팀 직접 미팅',
  },
  {
    id: 'deal_009', accountId: 'acc_009',
    name: 'Enterprise Infrastructure Intelligence',
    value: 480000, stage: 'Proposal Sent',
    probability: 38, riskLevel: 'medium',
    closeDate: _fromNow(58), daysInStage: _stageAge(16),
    competitors: ['Clari', 'Salesforce'],
    nextStep: '구매위원회 핵심 스폰서 파악 + 개별 미팅 요청',
  },
  {
    id: 'deal_010', accountId: 'acc_010',
    name: 'Content Intelligence Suite',
    value: 68000, stage: 'Contract Review',
    probability: 72, riskLevel: 'low',
    closeDate: _fromNow(5), daysInStage: _stageAge(3),
    competitors: [],
    nextStep: '계약서 최종 검토 완료 — 서명 요청',
  },
]

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export const contacts = [
  { id: 'con_001', accountId: 'acc_001', name: 'Marcus Chen', role: `VP of Data (Departing ${_monthDayEn(34)})`, status: 'at_risk', lastContact: '5d ago', note: 'Databricks 이직 확정. 핵심 챔피언. 이탈 전 관계 이전 필수.' },
  { id: 'con_002', accountId: 'acc_001', name: 'Jennifer Park', role: 'VP Engineering (Joining May 1)', status: 'new', lastContact: '미접촉', note: 'Stripe 출신. 데이터 엔지니어링 배경. 신규 의사결정권자 — 즉시 접촉 필요.' },
  { id: 'con_003', accountId: 'acc_002', name: 'Sarah Kim', role: 'Director of Operations', status: 'champion', lastContact: '1d ago', note: '강력한 내부 챔피언. 평가 주도 중. 단독 추진으로 exec 커버 필요.' },
  { id: 'con_004', accountId: 'acc_002', name: 'Dr. Richard Walsh', role: 'Chief Medical Officer', status: 'active', lastContact: '9d ago', note: '최종 서명 권한 보유. 최근 9일 미응답 — 직접 재접촉 필요.' },
  { id: 'con_005', accountId: 'acc_003', name: 'David Rodriguez', role: 'Chief Operating Officer', status: 'cold', lastContact: '8d ago', note: '데모 당시 47개 질문할 정도로 관심 높았으나 제안서 이후 침묵.' },
  { id: 'con_006', accountId: 'acc_004', name: 'Lisa Chen', role: 'Head of Revenue', status: 'champion', lastContact: '3h ago', note: 'CEO와 CTO 모두 정렬 완료. 법무만 남음. 매우 적극적 챔피언.' },
  { id: 'con_007', accountId: 'acc_005', name: 'Robert Kim', role: 'Chief Technology Officer', status: 'active', lastContact: '3d ago', note: '기술적 검증 완료. 보안팀 통과가 유일한 관건이라고 직접 언급.' },
  { id: 'con_008', accountId: 'acc_005', name: 'Janet Torres', role: 'VP Information Security', status: 'active', lastContact: '5d ago', note: '12개 보안 질문 제출. 현재 5개 미답변. 결정적 블로커.' },
  { id: 'con_009', accountId: 'acc_006', name: 'Kevin Park', role: 'VP of Operations', status: 'active', lastContact: '2d ago', note: 'SAP 평가와 병행 중. 기술 검토 긍정적이나 CFO 승인 필요.' },
  { id: 'con_010', accountId: 'acc_007', name: 'Christine Lee', role: 'CFO', status: 'champion', lastContact: '1d ago', note: 'Q2 예산 동결 전 계약 완료 원함. 계약 조건 협의 단계.' },
  { id: 'con_011', accountId: 'acc_008', name: 'Dr. James Yoo', role: 'CTO', status: 'active', lastContact: '4d ago', note: '기술 검토 완료. FDA 컴플라이언스 문서만 남은 상황.' },
  { id: 'con_012', accountId: 'acc_009', name: 'Sandra Wells', role: 'VP of Procurement', status: 'cold', lastContact: '6d ago', note: '구매위원회 프로세스 진행 중. 7명 이해관계자 조율 담당.' },
  { id: 'con_013', accountId: 'acc_010', name: 'Marcus Webb', role: 'CEO', status: 'champion', lastContact: '5h ago', note: '서명 준비 완료. 계약서 법무 최종 검토만 남음.' },
]

// ─── SIGNALS ─────────────────────────────────────────────────────────────────
export const signals = [
  { id: 'sig_001', accountId: 'acc_001', type: 'proposal_view_spike', severity: 'high', label: '제안서 열람 급증', summary: '48시간 내 7회 열람 — 복수 검토자 추정', evidence: '3/23 3회, 3/24 4회. IP 분석: 상이한 4개 단말. 평균 열람 시간 8분 42초 → 내부 논의 활발.' },
  { id: 'sig_002', accountId: 'acc_001', type: 'champion_risk', severity: 'critical', label: '챔피언 이탈 임박', summary: `Marcus Chen — Databricks 이직 (${_monthDayEn(34)})`, evidence: 'LinkedIn: "Excited for next chapter". 내부 소스 확인. 의사결정 공백 D-34.' },
  { id: 'sig_003', accountId: 'acc_001', type: 'competitor_evaluation', severity: 'high', label: '경쟁사 데모 예정', summary: `Salesforce Enterprise Demo — ${_dateStr(2)} (이틀 후)`, evidence: 'Marcus Chen 직접 언급. Salesforce AE가 Jennifer Park LinkedIn 접촉 확인됨.' },
  { id: 'sig_004', accountId: 'acc_002', type: 'legal_review_delay', severity: 'high', label: '법무 검토 지연', summary: 'HIPAA 컴플라이언스 검토 23일째 진행 중', evidence: '미결 항목: BAA 조항 수정, PHI 처리 정책, SOC 2 Type II 인증 확인. 3회 이상 수정 요청.' },
  { id: 'sig_005', accountId: 'acc_002', type: 'competitor_evaluation', severity: 'high', label: '경쟁사 데모 예정', summary: `Gong.io 데모 — ${_dateStr(1)} ${_dayOfWeek(1)}요일`, evidence: 'Sarah Kim 이메일: "팀이 다른 솔루션도 살펴볼 예정". CFO가 전 직장에서 Gong.io 사용 이력.' },
  { id: 'sig_006', accountId: 'acc_002', type: 'executive_disengagement', severity: 'medium', label: 'Exec Sponsor 이탈 감지', summary: 'Dr. Walsh 응답 주기 +40% 증가 (9일 미응답)', evidence: '직전 3주 평균 응답: 1.2일 → 현재 미응답 9일. 참여도 저하 패턴.' },
  { id: 'sig_007', accountId: 'acc_003', type: 'response_delay', severity: 'high', label: '응답 8일 전무', summary: '의사결정자 David Rodriguez 8일 미응답', evidence: '이메일 3회, LinkedIn DM 1회 발송 전부 미응답. 마지막 접촉: 3/17 제안서 발송 직후.' },
  { id: 'sig_008', accountId: 'acc_003', type: 'budget_deprioritization', severity: 'medium', label: '예산 우선순위 변동', summary: 'Q1 채용 확대 → 소프트웨어 예산 밀릴 가능성', evidence: 'Engineering 채용 공고 5개 신규 게시 (3주 이내). Q1 채용 예산 집중 시 구독 예산 이월 패턴.' },
  { id: 'sig_009', accountId: 'acc_004', type: 'close_signal', severity: 'low', label: '클로징 임박', summary: '모든 이해관계자 정렬 완료 — 법무만 남음', evidence: 'CEO Brandon Park 이메일 구두 승인. Lisa Chen: "이번 주 안에 마무리될 것 같아요."' },
  { id: 'sig_010', accountId: 'acc_005', type: 'security_concern', severity: 'medium', label: '보안 질문 미완', summary: 'IT 보안팀 12개 질문 중 5개 미답변', evidence: 'SOC 2 범위, 데이터 레지던시, API 보안 정책, 취약점 관리 SLA 미답변.' },
  { id: 'sig_011', accountId: 'acc_005', type: 'evaluation_delay', severity: 'low', label: '평가 기간 초과', summary: '35일 평가 진행 — 업계 평균 2.4배 초과', evidence: '유사 Enterprise 딜 평균 Technical Eval: 14일. 현재 35일. Q2 슬립 확률 64%.' },
  { id: 'sig_012', accountId: 'acc_006', type: 'competitor_evaluation', severity: 'high', label: 'SAP 경쟁 평가', summary: 'SAP S/4HANA 병행 평가 진행 중 — 결정 2주 내 예상', evidence: 'Kevin Park LinkedIn: "SCM 솔루션 최종 평가 중". SAP 구현 파트너 미팅 확인됨.' },
  { id: 'sig_013', accountId: 'acc_006', type: 'executive_disengagement', severity: 'medium', label: 'Exec 스폰서 응답 중단', summary: 'CFO 5일째 미응답 — SAP 선호도 증가 추정', evidence: '이전 응답 주기 1.5일 → 현재 5일 무응답. SAP 도입 경험 있는 CFO 배경.' },
  { id: 'sig_014', accountId: 'acc_007', type: 'budget_deprioritization', severity: 'high', label: 'Q2 예산 동결 임박', summary: 'Q2 시작 전 계약 완료 필수 — 동결 시 Q3 이월 위험', evidence: 'Christine Lee 직접 언급: "Q2 시작 전 처리해야 해요." 연간 예산 주기 패턴 확인.' },
  { id: 'sig_015', accountId: 'acc_008', type: 'security_concern', severity: 'medium', label: 'FDA 컴플라이언스 검토', summary: 'FDA 21 CFR Part 11 컴플라이언스 문서 요청 대기', evidence: 'CTO James Yoo: "기술은 OK. FDA 문서만 법무에서 확인하면 됩니다." 문서 제출 시 바로 진행 가능.' },
  { id: 'sig_016', accountId: 'acc_009', type: 'response_delay', severity: 'medium', label: '구매위원회 프로세스 지연', summary: '7명 이해관계자 검토 2주째 — 의사결정 경로 불명확', evidence: '제안서 발송 후 전체 이해관계자 열람 완료. 그러나 다음 단계 응답 없음. 내부 조율 중 추정.' },
  { id: 'sig_017', accountId: 'acc_010', type: 'close_signal', severity: 'low', label: '클로징 임박 — CEO 구두 승인', summary: 'CEO Marcus Webb 서명 의사 확인 — 계약서 최종 검토 중', evidence: '"준비됐습니다. 법무만 마무리하면 바로 진행할게요." 법무 검토 72시간 내 완료 예상.' },
]

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export const activities = [
  { id: 'act_001', accountId: 'acc_001', type: 'email', timestamp: _ago(2, 9), actor: 'Marcus Chen', summary: '제안서 추가 검토 및 가격 조건 재확인 요청', details: '가격 조건 및 Q1 구현 타임라인 재확인. 법무팀 검토 완료 여부 문의. 처음으로 "팀 리뷰" 표현 사용 → 내부 다수 이해관계자 논의 신호.', aiTag: 'internal_discussion', sentiment: 'neutral' },
  { id: 'act_002', accountId: 'acc_001', type: 'call', timestamp: _ago(7, 15), actor: 'Marcus Chen', summary: 'Salesforce와 AI 기능 비교 문의', details: 'HubSpot, Salesforce 대비 AI 분석 기능 비교 요청. "데이터 팀이 특히 관심 있어요" 언급. 결정 과정에 복수 이해관계자 관여 확인.', aiTag: 'competitor_mention', sentiment: 'concerned' },
  { id: 'act_003', accountId: 'acc_001', type: 'email', timestamp: _ago(9, 11, 30), actor: 'Marcus Chen', summary: 'Series B SaaS 레퍼런스 2개 요청', details: '비슷한 규모 SaaS 고객사 레퍼런스 요청. "Series B 이후 확장 중인 팀 사례가 좋겠습니다." → 내부 설득 위한 사회적 증거 필요.', aiTag: 'buying_signal', sentiment: 'positive' },
  { id: 'act_004', accountId: 'acc_001', type: 'meeting', timestamp: _ago(17, 14), actor: 'Marcus Chen + Jennifer Park', summary: '최종 제안 프레젠테이션 — VP 3명 참석', details: '1시간 30분 연장 진행. VP Data, Head of Engineering, Finance 참석. 예산 승인 구두 확인. 법무 검토만 남음. 당시 관계 온도 82°.', aiTag: 'milestone', sentiment: 'positive' },
  { id: 'act_005', accountId: 'acc_002', type: 'email', timestamp: _ago(3, 16), actor: 'Sarah Kim', summary: 'HIPAA BAA 조항 3차 수정 요청', details: '데이터 보존 기간 조항 이의 제기. 3번째 법무 수정 → 평균 대비 1.8배 긴 검토 진행 중. 법무팀 내 새 담당자 배정된 것으로 추정.', aiTag: 'legal_review_delay', sentiment: 'neutral' },
  { id: 'act_006', accountId: 'acc_002', type: 'call', timestamp: _ago(6, 10), actor: 'Sarah Kim', summary: 'Gong.io 경쟁사 첫 언급', details: '"CFO가 다른 솔루션도 한번 보자고 해서요." CFO가 전 직장(Stripe)에서 Gong.io 사용. 평가 기준 재설정 위험.', aiTag: 'competitor_mention', sentiment: 'concerned' },
  { id: 'act_007', accountId: 'acc_002', type: 'email', timestamp: _ago(12, 9), actor: 'Dr. Richard Walsh', summary: 'Exec Sponsor 마지막 응답 — 12일 전', details: '"Sarah 팀이 잘 진행하고 있는 걸로 압니다." 이후 미응답. CFO 개입 이후 에스컬레이션 필요.', aiTag: 'executive_disengagement', sentiment: 'neutral' },
  { id: 'act_008', accountId: 'acc_003', type: 'meeting', timestamp: _ago(10, 13), actor: 'David Rodriguez', summary: '데모 — 2시간 연장, 47개 질문', details: '구체적 질문: "우리 ERP와 통합되나요?", "구현까지 몇 주?", "전 팀원이 써야 하나요?" → 명확한 구매 의사. 이후 침묵이 더욱 이례적.', aiTag: 'high_engagement', sentiment: 'positive' },
  { id: 'act_009', accountId: 'acc_003', type: 'email', timestamp: _ago(10, 18), actor: 'AE Team', summary: '제안서 발송 + 레퍼런스 약속 (미이행)', details: '제조업 레퍼런스 2개 약속했으나 8일째 미제공. 레퍼런스 공백이 침묵의 원인일 가능성 높음.', aiTag: 'follow_up_required', sentiment: 'neutral' },
  { id: 'act_010', accountId: 'acc_004', type: 'call', timestamp: _ago(2, 10), actor: 'Lisa Chen', summary: '계약 조건 최종 합의 완료', details: '가격, SLA, 데이터 처리 조항 전부 동의. "법무팀에 넘겼어요. 이번 주 안에 될 것 같아요." CEO도 구두 승인.', aiTag: 'close_signal', sentiment: 'positive' },
  { id: 'act_011', accountId: 'acc_004', type: 'email', timestamp: _ago(4, 14), actor: 'Brandon Park (CEO)', summary: 'CEO 직접 구두 승인', details: '"Lisa 팀이 정말 좋아하더라고요. 계약만 처리되면 바로 시작하고 싶습니다." → 최고 수준의 내부 지지.', aiTag: 'executive_buy_in', sentiment: 'positive' },
  { id: 'act_012', accountId: 'acc_005', type: 'email', timestamp: _ago(5, 9), actor: 'Janet Torres (CISO)', summary: '12개 보안 질문 제출 — 5개 미답변', details: 'SOC 2 감사 범위, 데이터 레지던시 옵션, API 인증 방식, 취약점 패치 SLA, 접근 제어 정책 미답변.', aiTag: 'security_concern', sentiment: 'neutral' },
  { id: 'act_013', accountId: 'acc_005', type: 'call', timestamp: _ago(9, 11), actor: 'Robert Kim', summary: 'CTO 기술 검증 완료 — 보안만 남음', details: '"기술적으로는 납득이 됩니다. 보안팀 통과가 관건이에요." 아키텍처, API 레이턴시, 데이터 파이프라인 모두 검증 완료.', aiTag: 'technical_validation', sentiment: 'positive' },
]

// ─── AI RECOMMENDATIONS ───────────────────────────────────────────────────────
export const aiRecommendations = [
  {
    id: 'rec_001', accountId: 'acc_001', dealId: 'deal_001', priority: 1,
    type: 'urgent_action',
    title: `Jennifer Park 즉시 접촉 — Salesforce 데모(${_dateStr(2)}) 전 포지션 선점`,
    rationale: [
      `Marcus Chen 이탈 전 의사결정 연속성 확보 필수 (D-34 · ${_monthDayEn(34)})`,
      'Salesforce 데모 전 48h 내 첫 접촉 시 Win Rate +34% (과거 데이터)',
      '제안서 7회 열람 = 내부 논의 활발 → 개입 최적 타이밍',
    ],
    urgency: 94, confidence: 87, status: 'pending',
    emailDraft: {
      subject: 'Nexus Analytics × Revenue OS — Seamless transition for your team',
      body: `Hi Jennifer,

I wanted to reach out before your official start date at Nexus.

Marcus has been a fantastic partner throughout our evaluation, and I know he's been briefing you on where things stand. I'd love to connect directly so you have the full picture from day one — especially before Thursday.

A few things I think would be valuable to cover quickly:
  • Our Q1 implementation cohort closes this week — I want to make sure Nexus keeps the slot your team planned for
  • I can walk you through how our platform integrates with your existing data stack (Stripe background will make this very familiar)
  • Happy to share a reference from Amplitude — similar stage, similar team — who went live in 3 weeks

Would a 20-minute call on Wednesday work for you?

Best,
Alex`,
    },
    callScript: {
      opening: `Hi Jennifer, this is Alex from Adaptive Revenue OS. Marcus mentioned you'd be joining soon — I wanted to reach out directly. Is now a good time for 10 minutes?`,
      keyPoints: [
        '데이터 엔지니어링 배경에 맞춘 기술 통합 세부 사항 바로 공유 가능',
        'Q1 구현 슬롯이 이번 주 마감 — 기존 Nexus 팀 계획한 일정 유지 가능',
        'Salesforce 데모 전 비교 포인트 3가지 미리 공유',
      ],
      objections: {
        '아직 역할 파악 중입니다': 'Marcus가 이미 잘 정리해 두셨어요. 제가 추가로 필요한 모든 자료를 15분 안에 정리해 드릴 수 있습니다.',
        '다른 솔루션도 검토 중입니다': '어떤 기준으로 비교하고 계신지 알려주시면, 우리가 어디서 실질적으로 다른지 정확하게 보여드리겠습니다.',
      },
    },
    proposalPoints: [
      'Native AI — 데이터가 환경 외부로 나가지 않음 (Stripe 수준 보안 기준 충족)',
      '구현 타임라인: 3주 vs Salesforce 평균 3-6개월',
      'Q1 클로징 시 Enterprise Priority Support 무상 ($45K/yr 상당)',
      '유사 SaaS Series B 고객 Amplitude — 영업 사이클 28% 단축 사례',
    ],
  },
  {
    id: 'rec_002', accountId: 'acc_002', dealId: 'deal_002', priority: 2,
    type: 'risk_mitigation',
    title: 'HIPAA 완성 문서 오늘 제출 + Dr. Walsh 직접 재접촉',
    rationale: [
      `Gong.io 데모(${_dateStr(1)}) 전 법무 블로커 제거 = 경쟁 우위 결정`,
      'Dr. Walsh 9일 미응답 → CFO Gong.io 추천 채널 차단 필요',
      '법무 완결 시 이번 주 내 $680K 계약 가능',
    ],
    urgency: 88, confidence: 79, status: 'pending',
    emailDraft: {
      subject: 'Meridian Health — HIPAA 문서 완성 패키지 + 다음 단계 제안',
      body: `Dr. Walsh,

요청하신 HIPAA 컴플라이언스 관련 모든 문서를 완성했습니다.

첨부 자료:
  • BAA (Business Associate Agreement) — 수정 최종본
  • SOC 2 Type II 인증서 (2025년 갱신)
  • PHI 데이터 처리 정책 상세 명세
  • 의료기관 레퍼런스 3건 (UCSF, Mayo Clinic, Penn Medicine)

다음 주 화요일 30분 미팅으로 법무팀 우려 사항을 직접 해소하고 싶습니다.
가능하신 시간 알려주시면 바로 일정 잡겠습니다.

감사합니다,
Alex`,
    },
    callScript: {
      opening: `Dr. Walsh, 안녕하세요. Adaptive Revenue OS의 Alex입니다. HIPAA 문서 완성 건과 다음 단계 논의를 위해 연락드렸습니다.`,
      keyPoints: [
        'HIPAA 완성 문서 패키지 오늘 전달 가능 — 법무팀 직접 연결 지원',
        'Mayo Clinic, UCSF 레퍼런스 콜 이번 주 주선 가능',
        'Q1 클로징 시 구현 팀 우선 배정 + 연간 15% 절감',
      ],
      objections: {
        '법무 시간이 더 필요합니다': '법무팀과 직접 기술 세션을 잡겠습니다. 24시간 내 모든 질문에 답변 드릴 수 있어요.',
      },
    },
    proposalPoints: [
      'HIPAA BAA 표준 조항 전면 수용 — 계약 수정 없이 진행 가능',
      'SOC 2 Type II + HITRUST CSF 인증 보유',
      '의료기관 고객 23개사 — 동일 법무 절차 완료 경험',
    ],
  },
  {
    id: 'rec_003', accountId: 'acc_003', dealId: 'deal_003', priority: 3,
    type: 're_engagement',
    title: 'David Rodriguez 지금 전화 — 신뢰 회복하고 레퍼런스 경로 재개',
    rationale: [
      '8일 침묵 = 내부 우선순위 변화 or 미해소 objection 신호',
      '47개 질문 = 높은 구매 의도 확인 → 포기보다 막힌 것',
      '약속한 레퍼런스 미이행 = 신뢰 회복이 선행 조건',
    ],
    urgency: 76, confidence: 71, status: 'pending',
    emailDraft: {
      subject: 'David — 약속드린 제조업 레퍼런스 + 간단한 근황 확인',
      body: `David,

지난 데모에서 제조업 레퍼런스를 부탁하셨는데, 드디어 연결이 됐습니다.

Autoflow Systems의 VP Operations James Park를 소개해 드릴게요.
Cascade와 비슷한 80명 규모의 제조 SaaS 기업이고, 도입 6개월 만에 영업 사이클을 23% 단축했습니다.

이번 주에 15분 시간이 되시면, 근황도 나누고 남은 궁금증을 같이 해소하고 싶습니다.

언제가 좋으신가요?

Alex`,
    },
    callScript: {
      opening: `David, 안녕하세요. Alex입니다. 지난 데모 이후 연락 드리려 했는데 — 요즘 어떻게 지내세요?`,
      keyPoints: [
        '제조업 레퍼런스 준비됐습니다 — 이번 주 Autoflow James Park 소개 가능',
        '데모에서 나온 47개 질문 중 미답변 있으면 지금 해소하고 싶어요',
        'Q2 예산으로 넘어가더라도 지금 계약하면 Q1 가격 유지 가능',
      ],
      objections: {
        '지금은 타이밍이 안 맞아요': 'Q2 시작에 맞춰 구현하더라도, 지금 계약하면 Q1 가격 그대로 유지됩니다. 어떤 방식이 더 맞을까요?',
      },
    },
    proposalPoints: [
      'Q1 계약 + Q2 구현 옵션 (유연한 스케줄링)',
      '제조업 전용 온보딩 패키지 — ERP 통합 포함',
      '6개월 ROI 보장: 영업 사이클 15% 단축 미달 시 환불',
    ],
  },
  {
    id: 'rec_004', accountId: 'acc_004', dealId: 'deal_004', priority: 4,
    type: 'close_assist',
    title: `법무 검토 가속 지원 — 이번 주 금요일(${_dateStr(1)}) 클로징 목표`,
    rationale: [
      '법무만 남음 — CEO, Head of Revenue 승인 완료',
      '우리 법무팀 직접 지원 시 24-48h 내 계약 완료 가능',
      `${_dateStr(1)} 클로징 = Q1 수치 확보 + 고객 Q1 구현 일정 유지`,
    ],
    urgency: 71, confidence: 91, status: 'pending',
    emailDraft: {
      subject: 'Vertex Commerce — 이번 주 계약 완료를 위한 제안',
      body: `Lisa,

빠르게 진행해 주셔서 감사합니다! 법무팀 검토 중이신 거 알고 있고, 속도를 높일 수 있도록 도움 드리고 싶습니다.

우리 측 법무팀이 귀사 법무팀과 직접 연결되어 표준 조항들을 24시간 내 처리해 드릴 수 있어요.

이번 주 금요일(${_dateStr(1)}) 완료하면 Q1 구현 팀 첫 번째 슬롯에 배정해 드립니다.

어떻게 진행하면 좋을까요?

Alex`,
    },
    callScript: {
      opening: `안녕하세요 Lisa! 계약 진행 중이시죠 — 법무 쪽에서 필요한 게 있으면 뭐든 지원하고 싶어서요.`,
      keyPoints: [
        '우리 법무팀이 24h 내 레드라인 검토 완료 가능',
        `${_dateStr(1)} 클로징 시 Q1 구현 팀 우선 배정`,
        '표준 MSA + Order Form — 통상 48h 내 완료',
      ],
      objections: {},
    },
    proposalPoints: [
      '표준 계약 조항 — 수정 없이 바로 진행 가능',
      'Q1 구현 완료 시 6월 기준 첫 ROI 보고서 제공',
    ],
  },
  {
    id: 'rec_005', accountId: 'acc_005', dealId: 'deal_005', priority: 5,
    type: 'technical_acceleration',
    title: '미답변 보안 질문 5개 이번 주 완료 + 평가 종료 일정 확정',
    rationale: [
      '35일 평가 = Q2 슬립 위험 64%. 데드라인 없이는 Q3까지 밀릴 수 있음',
      '5개 미답변 완료 시 Janet Torres 최종 승인 기대',
      'Robert Kim 기술 검증 완료 — 보안만 통과하면 계약 직행',
    ],
    urgency: 62, confidence: 68, status: 'pending',
    emailDraft: {
      subject: 'Pinnacle Logistics — 보안 질문 5개 완료 + 평가 완료 일정 제안',
      body: `Janet,

지난번 제출하신 12개 보안 질문 중 나머지 5개에 대한 답변을 첨부합니다.

포함 자료:
  • SOC 2 감사 보고서 전문 (2025)
  • 데이터 레지던시 정책 (AWS Seoul Region 포함)
  • API 보안 명세서 + 취약점 관리 프로세스

보안 기술 팀장과 30분 세션을 잡아서 남은 궁금증을 모두 해소하고 싶습니다.
다음 주 화요일 또는 수요일 어떠신가요?

Alex`,
    },
    callScript: {
      opening: `Janet, 안녕하세요. 5개 미답변 보안 질문 자료를 완성했습니다. 검토 일정을 잡고 싶어서요.`,
      keyPoints: [
        'ISO 27001 + SOC 2 Type II — 모든 인증 최신',
        '데이터 레지던시: AWS Seoul Region 옵션 제공 가능',
        '보안 기술 세션 — CISO 수준 심층 질의 응대 가능',
      ],
      objections: {
        '내부 검토 일정 조율 필요': '이해합니다. 언제까지 내부 검토가 완료되면 좋은지 공유해 주시면 맞춰 지원하겠습니다.',
      },
    },
    proposalPoints: [
      'SOC 2 Type II + ISO 27001 + GDPR 완전 준수',
      '데이터 레지던시 국내 옵션 (AWS Seoul)',
      '보안 SLA: 취약점 패치 24h 내 적용 보장',
    ],
  },
  {
    id: 'rec_006', accountId: 'acc_006', dealId: 'deal_006', priority: 6,
    type: 'risk_mitigation',
    title: 'SAP 대비 차별화 자료 즉시 전달 + CFO 직접 재접촉',
    rationale: [
      'SAP 평가 병행 중 — 2주 내 결정. 지금 개입하지 않으면 SAP 우선순위 고착',
      'Kevin Park 기술 검토 긍정적 — CFO 설득이 유일한 관문',
      '$310K 딜 + Legal Review 단계 — 지금이 최적 개입 타이밍',
    ],
    urgency: 79, confidence: 72, status: 'pending',
    emailDraft: {
      subject: 'Summit Logistics — SAP 대비 ROI 비교 자료 + 다음 단계 제안',
      body: `Kevin,

SAP 평가와 병행하신다는 것 알고 있습니다. 공정한 비교를 위해 자료를 준비했습니다.

핵심 차이점:
  • 구현 기간: 우리 3주 vs SAP 평균 6-18개월
  • 총 소유 비용: SAP 대비 연간 40% 절감 (유사 SCM 기업 기준)
  • SCM 전용 AI 인텔리전스 — SAP는 범용 ERP

CFO분과 30분 미팅으로 ROI 모델을 직접 보여드리고 싶습니다.

Alex`,
    },
    callScript: {
      opening: `Kevin, 안녕하세요. SAP 평가 진행 중이신 거 알고 있어요. 공정한 비교 자료를 준비했습니다.`,
      keyPoints: [
        'SAP 구현 6-18개월 vs 우리 3주 — 즉시 ROI 실현 가능',
        'SCM 전문 AI — SAP ERP 범용 대비 40% 높은 예측 정확도',
        'CFO ROI 미팅 요청 — 30분으로 의사결정 근거 완성',
      ],
      objections: {
        'SAP가 기존 시스템과 통합이 쉬울 것 같아요': '저희는 SAP와 네이티브 통합을 지원합니다. SAP 환경에서 더 잘 작동해요.',
      },
    },
    proposalPoints: [
      'SAP 네이티브 통합 지원 — 기존 인프라 활용 가능',
      '구현 3주 — Q2 시작 전 ROI 실현',
      'SCM 전문 고객 12개사 레퍼런스 제공 가능',
    ],
  },
  {
    id: 'rec_007', accountId: 'acc_007', dealId: 'deal_007', priority: 7,
    type: 'close_assist',
    title: 'CFO와 계약 조건 최종 합의 — Q2 예산 동결 전 서명',
    rationale: [
      'Q2 예산 동결 전 계약 시 $140K 확보. 동결 시 Q3 이월',
      'Christine Lee 직접 승인 의사 확인 — 조건만 합의하면 즉시 서명',
      '계약서 검토 단계 — 법무 지원으로 48h 내 완료 가능',
    ],
    urgency: 65, confidence: 81, status: 'pending',
    emailDraft: {
      subject: 'Apex Financial — 계약 조건 최종 확인 + 이번 주 서명 제안',
      body: `Christine,

빠른 진행 감사합니다. 계약 조건 최종 확인을 위해 연락드립니다.

우리 법무팀이 표준 조항 기준으로 48시간 내 검토를 완료할 수 있습니다.
Q2 예산 주기 전에 서명이 완료되면 구현팀 우선 배정이 가능합니다.

내일 또는 모레 30분 콜로 남은 조건을 확인하고 싶습니다.

Alex`,
    },
    callScript: {
      opening: `Christine, 안녕하세요. 계약 최종 단계 지원을 위해 연락드렸습니다.`,
      keyPoints: [
        '법무팀 48h 내 계약서 검토 완료 지원 가능',
        'Q2 시작 전 서명 시 구현팀 우선 배정',
        '표준 MSA — 수정 없이 바로 진행 가능',
      ],
      objections: {},
    },
    proposalPoints: [
      '표준 계약 조항 — 즉시 진행 가능',
      'Q2 시작 전 온보딩 완료 보장',
      '첫 분기 ROI 리포트 무상 제공',
    ],
  },
  {
    id: 'rec_008', accountId: 'acc_008', dealId: 'deal_008', priority: 8,
    type: 'technical_acceleration',
    title: 'FDA 컴플라이언스 패키지 즉시 제출 + 보안팀 기술 세션 요청',
    rationale: [
      'CTO 기술 검토 완료 — 컴플라이언스 문서가 유일한 블로커',
      'FDA 21 CFR Part 11 인증 보유 — 즉시 제출 가능',
      '문서 제출 시 법무 검토 1주 내 완료 예상',
    ],
    urgency: 51, confidence: 74, status: 'pending',
    emailDraft: {
      subject: 'Helix Biotech — FDA 컴플라이언스 문서 패키지 + 기술 세션 제안',
      body: `Dr. Yoo,

요청하신 FDA 21 CFR Part 11 컴플라이언스 자료를 완성했습니다.

포함 자료:
  • FDA 21 CFR Part 11 준수 명세서
  • GxP 검증 문서
  • Audit Trail 정책 및 기술 명세
  • Life Sciences 레퍼런스 고객 3개사

다음 주 기술 세션으로 법무팀 질문에 직접 답변드리고 싶습니다.

Alex`,
    },
    callScript: {
      opening: `Dr. Yoo, 안녕하세요. FDA 컴플라이언스 문서 준비 완료했습니다.`,
      keyPoints: [
        'FDA 21 CFR Part 11 완전 준수 — 즉시 검증 가능',
        'Life Sciences 고객 8개사 레퍼런스 제공 가능',
        '기술 세션으로 법무팀 직접 질의응답 지원',
      ],
      objections: {
        '내부 법무 검토 일정이 불확실합니다': '법무팀과 직접 기술 세션을 잡겠습니다. 24시간 내 모든 질문 답변 가능합니다.',
      },
    },
    proposalPoints: [
      'FDA 21 CFR Part 11 + GxP 인증 보유',
      'Life Sciences 전문 구현 팀 배정',
      '검증 완료 시 6주 내 Go-live 보장',
    ],
  },
  {
    id: 'rec_009', accountId: 'acc_009', dealId: 'deal_009', priority: 9,
    type: 're_engagement',
    title: '구매위원회 핵심 스폰서 파악 + 개별 챔피언 미팅 요청',
    rationale: [
      '7명 이해관계자 중 최종 결정권자 불명확 — 개별 접근 필요',
      '제안서 전원 열람 완료 — 내부 논의 중 추정',
      '장기 사이클 방지를 위해 핵심 스폰서 조기 확보 필요',
    ],
    urgency: 44, confidence: 58, status: 'pending',
    emailDraft: {
      subject: 'NovaTech Systems — 구매 프로세스 지원 + 개별 미팅 제안',
      body: `Sandra,

제안서 검토해 주셔서 감사합니다. 팀 내 논의가 잘 진행되고 있길 바랍니다.

구매위원회 프로세스를 지원하기 위해 각 이해관계자별 맞춤 자료를 준비했습니다.
CTO, CFO, COO 각자의 관심사에 맞춘 개별 자료를 제공할 수 있습니다.

이번 주 Sandra와 15분 미팅으로 다음 단계를 정하고 싶습니다.

Alex`,
    },
    callScript: {
      opening: `Sandra, 안녕하세요. 구매 프로세스 지원을 위해 연락드렸습니다.`,
      keyPoints: [
        '이해관계자별 맞춤 자료 준비 완료',
        'Enterprise 레퍼런스 — 유사 규모 기업 구현 사례 공유 가능',
        '구매위원회 프레젠테이션 지원 가능',
      ],
      objections: {
        '내부 프로세스가 시간이 걸립니다': '이해합니다. 위원회 일정에 맞춰 자료를 준비해 드릴게요.',
      },
    },
    proposalPoints: [
      'Enterprise 전담 구현 팀 배정',
      '이해관계자별 맞춤 ROI 분석 제공',
      '파일럿 프로그램 — 3개월 성과 검증 후 계약 확대 옵션',
    ],
  },
  {
    id: 'rec_010', accountId: 'acc_010', dealId: 'deal_010', priority: 10,
    type: 'close_assist',
    title: '계약서 최종 서명 요청 — CEO 구두 승인 완료',
    rationale: [
      'CEO 구두 승인 완료 — 계약서 서명만 남은 상태',
      '법무 검토 72h 내 완료 예상 — 이번 주 클로징 가능',
      '소규모 딜이지만 레퍼런스 가치 높음 (미디어 섹터)',
    ],
    urgency: 38, confidence: 88, status: 'pending',
    emailDraft: {
      subject: 'Driftwood Media — 계약서 최종 서명 안내',
      body: `Marcus,

긍정적인 피드백 감사합니다! 계약서 최종본을 첨부합니다.

표준 조항으로 구성되어 있어 법무 검토가 빠르게 완료될 것 같습니다.
이번 주 내 서명 완료되면 다음 주부터 온보딩을 시작할 수 있습니다.

서명 후 전달 방법을 알려주시면 바로 처리하겠습니다.

Alex`,
    },
    callScript: {
      opening: `Marcus, 안녕하세요! 계약서 보내드렸습니다. 빠른 진행 도와드리려고요.`,
      keyPoints: [
        '표준 계약 조항 — 법무 검토 48h 내 예상',
        '서명 완료 시 다음 주 온보딩 시작 가능',
        '전담 Customer Success 매니저 배정',
      ],
      objections: {},
    },
    proposalPoints: [
      '온보딩 2주 완료 보장',
      '미디어 섹터 전문 구현 지원',
      '첫 30일 성과 리뷰 미팅 포함',
    ],
  },
]

// ─── CHANNEL PERFORMANCE ──────────────────────────────────────────────────────
export const channelPerformance = [
  { id: 'ch_001', channel: 'LinkedIn Ads', spend: 18000, leads: 47, conversions: 6, conversionRate: 12.8, trend: 'up', trendDelta: '+32%', recommendation: 'ICP 매칭률 최고점. 예산 40% 증액 권장.', priority: 'increase' },
  { id: 'ch_002', channel: 'Outbound Email', spend: 3200, leads: 31, conversions: 3, conversionRate: 9.7, trend: 'stable', trendDelta: '+2%', recommendation: '전환율 안정적. 시퀀스 A/B 테스트 권장.', priority: 'maintain' },
  { id: 'ch_003', channel: 'Content / SEO', spend: 8500, leads: 22, conversions: 2, conversionRate: 9.1, trend: 'up', trendDelta: '+18%', recommendation: '유기 트래픽 상승 중. 기술 콘텐츠 강화 권장.', priority: 'maintain' },
  { id: 'ch_004', channel: 'Paid Search', spend: 12000, leads: 18, conversions: 1, conversionRate: 5.6, trend: 'down', trendDelta: '-8%', recommendation: '전환율 하락 지속. 예산 30% 감축 후 LinkedIn 이동.', priority: 'decrease' },
  { id: 'ch_005', channel: 'Webinar / Events', spend: 6000, leads: 28, conversions: 4, conversionRate: 14.3, trend: 'up', trendDelta: '+45%', recommendation: '최고 전환율 채널. 빈도 증가 권장 (월 2회 → 주 1회).', priority: 'increase' },
]

// ─── TEAM ACTIVITIES ──────────────────────────────────────────────────────────
export const teamActivities = [
  { id: 'ta_001', actor: 'Sarah J.', action: 'Nexus Analytics 이메일 초안 승인', time: '23m ago', type: 'approval', accountId: 'acc_001' },
  { id: 'ta_002', actor: 'Mike K.', action: 'Meridian Health 딜 스테이지 → Legal Review', time: '1h ago', type: 'update', accountId: 'acc_002' },
  { id: 'ta_003', actor: 'AI System', action: '제안서 열람 급증 감지 — Nexus Analytics (7×)', time: '2h ago', type: 'signal', accountId: 'acc_001' },
  { id: 'ta_004', actor: 'Lisa P.', action: 'Cascade Systems COO 후속 이메일 발송', time: '3h ago', type: 'outreach', accountId: 'acc_003' },
  { id: 'ta_005', actor: 'AI System', action: '챔피언 리스크 알림 — Marcus Chen LinkedIn 업데이트', time: '4h ago', type: 'alert', accountId: 'acc_001' },
  { id: 'ta_006', actor: 'David C.', action: 'Pinnacle Logistics CISO에 보안 문서 제출', time: '5h ago', type: 'outreach', accountId: 'acc_005' },
  { id: 'ta_007', actor: 'Sarah J.', action: '할인 추천 거절 — Meridian ($68K 할인 불가)', time: '6h ago', type: 'rejection', accountId: 'acc_002' },
  { id: 'ta_008', actor: 'AI System', action: '학습 업데이트: 가격 방어 성향 +18% 반영', time: '6h ago', type: 'learning' },
]

// ─── COACHING FEEDBACK ────────────────────────────────────────────────────────
export const coachingFeedback = []

// ─── LEARNING METRICS ────────────────────────────────────────────────────────
export const learningMetrics = {
  totalFeedbacks: 0,
  approvalRate: 0,
  systemConfidence: 72,
  lastUpdated: '—',
  adaptations: [],
}

// ─── COACHING INSIGHTS ────────────────────────────────────────────────────────
export const coachingInsights = [
  {
    id: 'ci_001',
    type: 'win_pattern',
    title: '챔피언 조기 확보 전략',
    body: '딜 초반 90일 이내에 챔피언을 확보한 경우 Win Rate +38% 차이 발생. 현재 파이프라인의 40%가 챔피언 미확보 상태.',
    impact: 'high',
  },
  {
    id: 'ci_002',
    type: 'risk_pattern',
    title: '법무 검토 기간 관리',
    body: '법무 단계 15일 초과 시 딜 슬립 확률 2.4배 증가. 평균 법무 기간: 17일. 조기 법무 킥오프로 3주 단축 가능.',
    impact: 'high',
  },
  {
    id: 'ci_003',
    type: 'engagement',
    title: '멀티스레딩 효과',
    body: '3명 이상 이해관계자 접촉 시 Win Rate 62% vs 1-2명 접촉 시 41%. 현재 단일 연락처 의존 딜: 2건.',
    impact: 'medium',
  },
  {
    id: 'ci_004',
    type: 'timing',
    title: '최적 후속 타이밍',
    body: '제안서 발송 후 72시간 이내 후속 접촉 시 응답률 3.1배 향상. 현재 8일 이상 대기 중인 딜: 1건.',
    impact: 'medium',
  },
]

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
export const teamMembers = [
  { id: 'tm_001', name: 'Alex Morgan', role: 'Account Executive', status: 'active', deals: 3, winRate: 68, quota: 87 },
  { id: 'tm_002', name: 'Jamie Lee', role: 'Senior AE', status: 'active', deals: 2, winRate: 74, quota: 94 },
  { id: 'tm_003', name: 'Sam Chen', role: 'AE (New)', status: 'onboarding', deals: 0, winRate: null, quota: 12 },
]

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
export const integrations = [
  { id: 'int_001', name: 'Salesforce', status: 'connected', lastSync: '2m ago', records: '1,247' },
  { id: 'int_002', name: 'HubSpot', status: 'connected', lastSync: '15m ago', records: '843' },
  { id: 'int_003', name: 'Gong.io', status: 'pending', lastSync: null, records: null },
]
