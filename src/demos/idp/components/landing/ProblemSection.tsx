// src/components/landing/ProblemSection.tsx
const PAIN_POINTS = [
  {
    icon: '📄',
    title: '팩스로 온 서류, 손으로 다시 입력',
    desc: '종이 문서를 보면서 ERP에 한 줄씩 타이핑. 하루에 몇 번이나 반복하고 있나요?',
  },
  {
    icon: '⏱',
    title: '문서 한 장에 20분, 하루에 수십 장',
    desc: '처리할 서류는 쌓이는데 손은 두 개뿐. 정작 중요한 업무는 뒷전으로 밀립니다.',
  },
  {
    icon: '❌',
    title: '오타·누락으로 인한 오류와 재작업',
    desc: '사람이 하는 입력에는 실수가 따릅니다. 한 번의 오타가 결제·정산 전체를 흔들죠.',
  },
]

export function ProblemSection() {
  return (
    <section className="py-28 px-6" style={{ background: '#fff' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-bold text-center mb-4"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#111827' }}
        >
          아직도 이렇게 하고 계신가요?
        </h2>
        <p
          className="text-center mb-16"
          style={{ fontSize: '18px', color: '#6B7280' }}
        >
          많은 경리·구매 담당자들이 여전히 같은 문제를 겪고 있습니다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-card p-8"
              style={{
                background: '#F8F9FA',
                border: '1px solid #E5E7EB',
              }}
            >
              <div className="text-4xl mb-5">{point.icon}</div>
              <h3
                className="font-semibold mb-3"
                style={{ fontSize: '20px', color: '#111827' }}
              >
                {point.title}
              </h3>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7 }}>
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
