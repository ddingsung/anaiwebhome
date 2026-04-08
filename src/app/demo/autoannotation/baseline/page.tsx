'use client'

import dynamic from 'next/dynamic'

const BaselinePageContent = dynamic(() => import('@aa/components/labeling/BaselinePageContent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-bg-app">
      <p className="text-text-muted text-[13px]">라벨링 도구 로딩 중...</p>
    </div>
  ),
})

export default function BaselinePage() {
  return <BaselinePageContent />
}
