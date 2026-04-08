const STEPS = [
  {
    number: '01',
    title: '문서 업로드',
    desc: '팩스, 스캔본, PDF 그대로 드래그해서 올리세요. 어떤 형식이든 OK.',
    icon: '⬆️',
  },
  {
    number: '02',
    title: 'AI 자동 추출',
    desc: 'AI가 거래처, 금액, 날짜 등 핵심 필드를 자동으로 읽어냅니다. 틀린 건 클릭 한 번으로 수정.',
    icon: '🤖',
  },
  {
    number: '03',
    title: 'ERP 전송',
    desc: '검토가 끝나면 버튼 하나로 ERP에 바로 반영. 수작업 없이 끝.',
    icon: '✅',
  },
]

export function SolutionSection() {
  return (
    <section className="py-28 px-6" style={{ background: '#F3F4F6' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-bold text-center mb-4"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#111827' }}
        >
          Anai_IDP가 대신합니다
        </h2>
        <p
          className="text-center mb-16"
          style={{ fontSize: '18px', color: '#6B7280' }}
        >
          업로드부터 ERP 전송까지, 3단계로 끝납니다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-card p-8"
              style={{ background: '#fff', border: '1px solid #E5E7EB' }}
            >
              <div
                className="font-mono font-bold mb-4"
                style={{ fontSize: '13px', color: '#4C6EF5', letterSpacing: '0.1em' }}
              >
                STEP {step.number}
              </div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3
                className="font-semibold mb-3"
                style={{ fontSize: '22px', color: '#111827' }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
