'use client'

import dynamic from 'next/dynamic'

const ReviewPageClient = dynamic(() => import('./ReviewPageClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center" style={{ background: 'hsl(0 0% 6%)' }}>
      <p style={{ color: 'hsl(220 9% 36%)', fontSize: '13px' }}>검토 도구 로딩 중...</p>
    </div>
  ),
})

export default function ReviewPageDynamic() {
  return <ReviewPageClient />
}
