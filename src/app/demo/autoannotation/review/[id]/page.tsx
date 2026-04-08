import ReviewPageDynamic from '@aa/components/review/ReviewPageDynamic'

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `task-${String(i + 1).padStart(3, '0')}`,
  }))
}

export default function ReviewPage() {
  return <ReviewPageDynamic />
}
