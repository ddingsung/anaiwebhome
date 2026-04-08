export interface BBoxAnnotation {
  id: string
  type: 'bbox'
  label: string
  confidence: number
  isModified: boolean
  x: number
  y: number
  width: number
  height: number
}

export interface PolygonAnnotation {
  id: string
  type: 'polygon'
  label: string
  confidence: number
  isModified: boolean
  points: number[]   // [x1, y1, x2, y2, ...]
}

export type Annotation = BBoxAnnotation | PolygonAnnotation

export interface TaskAnnotations {
  taskId: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  annotations: Annotation[]
}
