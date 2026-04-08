const STATS = [
  {
    value: '45초',
    label: '문서 1장 처리 시간',
    sub: '기존 평균 20분 대비',
  },
  {
    value: '99%+',
    label: '필드 추출 정확도',
    sub: '사람보다 실수가 적습니다',
  },
  {
    value: '월 40h',
    label: '팀당 절약 시간',
    sub: '더 중요한 일에 쓸 수 있는 시간',
  },
]

export function ImpactSection() {
  return (
    <section className="py-28 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="font-bold text-white mb-4"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          숫자로 말합니다
        </h2>
        <p className="mb-20" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>
          실제 도입 고객 데이터 기준
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STATS.map((stat) => (
            <div key={stat.value}>
              <div
                className="font-mono font-bold mb-3"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#4C6EF5' }}
              >
                {stat.value}
              </div>
              <div
                className="font-semibold mb-2 text-white"
                style={{ fontSize: '20px' }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
