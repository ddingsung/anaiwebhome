export function CtaSection() {
  return (
    <section className="py-28 px-6" style={{ background: '#4C6EF5' }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="font-bold text-white mb-6"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          지금 바로 시작해보세요
        </h2>
        <p
          className="text-white/70 mb-12"
          style={{ fontSize: '18px', lineHeight: 1.6 }}
        >
          도입 문의부터 데모 체험까지,<br />
          부담 없이 연락주세요
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-10 py-4 rounded-button font-semibold text-[#4C6EF5] bg-white hover:opacity-90 transition-opacity"
            style={{ fontSize: '18px' }}
          >
            데모 신청하기
          </button>
          <button
            className="px-10 py-4 rounded-button font-semibold text-white border-2 border-white/40 hover:border-white/80 transition-colors"
            style={{ fontSize: '18px' }}
          >
            문의하기
          </button>
        </div>

        <p className="mt-20 text-white/30 text-sm font-mono">
          © 2026 Anai_IDP. All rights reserved.
        </p>
      </div>
    </section>
  )
}
