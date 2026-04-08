// src/components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-32"
      style={{ background: '#0a0a0a', minHeight: '100vh' }}
    >
      {/* 로고 */}
      <div className="mb-10 text-white/40 text-sm font-mono tracking-widest uppercase">
        Anai_IDP
      </div>

      {/* 헤드라인 */}
      <h1
        className="font-bold text-white leading-tight mb-6"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
      >
        서류 더미가 데이터로 바뀌는 시간,
        <br />
        <span style={{ color: '#4C6EF5' }}>45초</span>
      </h1>

      {/* 서브카피 */}
      <p
        className="text-white/60 mb-12 max-w-xl"
        style={{ fontSize: 'clamp(16px, 2vw, 22px)', lineHeight: 1.6 }}
      >
        세금계산서, 발주서, 거래명세서 —<br />
        AI가 읽고 ERP에 자동 입력합니다
      </p>

      {/* CTA */}
      <button
        className="px-10 py-4 rounded-button font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: '#4C6EF5', fontSize: '18px' }}
      >
        데모 신청하기
      </button>

      {/* 데모 영상 플레이스홀더 */}
      <div
        className="mt-20 rounded-card overflow-hidden w-full max-w-4xl"
        style={{
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="text-white/30 text-lg font-mono">[ 데모 영상 ]</span>
      </div>
    </section>
  )
}
