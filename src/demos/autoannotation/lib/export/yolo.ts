import { SKIN_LABELS } from '@aa/lib/mock/labels'
import type { LabelingImage } from '@aa/store/labelingStore'
import type { BBoxAnnotation, PolygonAnnotation } from '@aa/lib/types/annotation'

const CLASS_ID: Record<string, number> = Object.fromEntries(
  SKIN_LABELS.map((l, i) => [l.id, i])
)

function round(n: number): string {
  return parseFloat(n.toFixed(4)).toString()
}

export function buildYoloFiles(images: LabelingImage[]): { filename: string; content: string }[] {
  return images.map(img => {
    const lines = img.annotations.map(ann => {
      const cls = CLASS_ID[ann.label] ?? 0
      if (ann.type === 'bbox') {
        const a = ann as BBoxAnnotation
        const cx = (a.x + a.width / 2) / img.width
        const cy = (a.y + a.height / 2) / img.height
        const w = a.width / img.width
        const h = a.height / img.height
        return `${cls} ${round(cx)} ${round(cy)} ${round(w)} ${round(h)}`
      } else {
        const a = ann as PolygonAnnotation
        const normPoints = a.points.map((v, i) =>
          round(i % 2 === 0 ? v / img.width : v / img.height)
        )
        return `${cls} ${normPoints.join(' ')}`
      }
    })
    const stem = img.filename.replace(/\.[^.]+$/, '')
    return { filename: `${stem}.txt`, content: lines.join('\n') }
  })
}
