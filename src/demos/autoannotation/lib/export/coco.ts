import { SKIN_LABELS } from '@aa/lib/mock/labels'
import type { LabelingImage } from '@aa/store/labelingStore'
import type { BBoxAnnotation, PolygonAnnotation } from '@aa/lib/types/annotation'

const CATEGORY_ID: Record<string, number> = Object.fromEntries(
  SKIN_LABELS.map((l, i) => [l.id, i + 1])
)

export function buildCocoJson(images: LabelingImage[]): string {
  const cocoImages = images.map((img, i) => ({
    id: i + 1,
    file_name: img.filename,
    width: img.width,
    height: img.height,
  }))

  let annId = 1
  const annotations: object[] = []

  images.forEach((img, imgIdx) => {
    const imageId = imgIdx + 1
    img.annotations.forEach(ann => {
      if (ann.type === 'bbox') {
        const a = ann as BBoxAnnotation
        annotations.push({
          id: annId++,
          image_id: imageId,
          category_id: CATEGORY_ID[a.label] ?? 1,
          bbox: [a.x, a.y, a.width, a.height],
          segmentation: [],
          area: a.width * a.height,
          iscrowd: 0,
        })
      } else {
        const a = ann as PolygonAnnotation
        const xs = a.points.filter((_, i) => i % 2 === 0)
        const ys = a.points.filter((_, i) => i % 2 !== 0)
        const minX = Math.min(...xs),
          maxX = Math.max(...xs)
        const minY = Math.min(...ys),
          maxY = Math.max(...ys)
        annotations.push({
          id: annId++,
          image_id: imageId,
          category_id: CATEGORY_ID[a.label] ?? 1,
          bbox: [minX, minY, maxX - minX, maxY - minY],
          segmentation: [a.points],
          area: (maxX - minX) * (maxY - minY),
          iscrowd: 0,
        })
      }
    })
  })

  const categories = SKIN_LABELS.map((l, i) => ({
    id: i + 1,
    name: l.id,
    supercategory: 'skin_lesion',
  }))

  return JSON.stringify({ images: cocoImages, annotations, categories }, null, 2)
}
