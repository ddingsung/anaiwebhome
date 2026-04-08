import type { LabelingImage } from '@aa/store/labelingStore'
import type { BBoxAnnotation, PolygonAnnotation } from '@aa/lib/types/annotation'

export function buildLabelmeFiles(images: LabelingImage[]): { filename: string; content: string }[] {
  return images.map(img => {
    const shapes = img.annotations.map(ann => {
      if (ann.type === 'bbox') {
        const a = ann as BBoxAnnotation
        return {
          label: a.label,
          points: [[a.x, a.y], [a.x + a.width, a.y + a.height]],
          group_id: null,
          description: '',
          shape_type: 'rectangle',
          flags: {},
        }
      } else {
        const a = ann as PolygonAnnotation
        const points: [number, number][] = []
        for (let i = 0; i < a.points.length; i += 2) {
          points.push([a.points[i], a.points[i + 1]])
        }
        return {
          label: a.label,
          points,
          group_id: null,
          description: '',
          shape_type: 'polygon',
          flags: {},
        }
      }
    })

    const stem = img.filename.replace(/\.[^.]+$/, '')
    const data = {
      version: '5.0.0',
      flags: {},
      shapes,
      imagePath: img.filename,
      imageData: null,
      imageHeight: img.height,
      imageWidth: img.width,
    }
    return { filename: `${stem}.json`, content: JSON.stringify(data, null, 2) }
  })
}
