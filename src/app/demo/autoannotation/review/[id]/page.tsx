import ReviewPageDynamic from '@aa/components/review/ReviewPageDynamic'
import train from '@aa/lib/mock/roboflow/train.json'
import valid from '@aa/lib/mock/roboflow/valid.json'
import test from '@aa/lib/mock/roboflow/test.json'

export function generateStaticParams() {
  const taskIds = Array.from({ length: 30 }, (_, i) => ({
    id: `task-${String(i + 1).padStart(3, '0')}`,
  }))
  const rfIds = [
    ...(train as { images: { id: number }[] }).images.map(img => ({ id: `rf-train-${img.id}` })),
    ...(valid as { images: { id: number }[] }).images.map(img => ({ id: `rf-valid-${img.id}` })),
    ...(test as { images: { id: number }[] }).images.map(img => ({ id: `rf-test-${img.id}` })),
  ]
  return [...taskIds, ...rfIds]
}

export default function ReviewPage() {
  return <ReviewPageDynamic />
}
