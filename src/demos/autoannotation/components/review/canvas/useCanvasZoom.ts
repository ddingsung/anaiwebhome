import { useCallback } from 'react'
import type Konva from 'konva'

interface Size { width: number; height: number }
interface Point { x: number; y: number }

export function calculateFitZoom(container: Size, image: Size): number {
  const scaleX = container.width / image.width
  const scaleY = container.height / image.height
  return Math.min(scaleX, scaleY)
}

export function screenToCanvas(screen: Point, offset: Point, zoom: number): Point {
  return {
    x: (screen.x - offset.x) / zoom,
    y: (screen.y - offset.y) / zoom,
  }
}

interface UseCanvasZoomOptions {
  minZoom?: number
  maxZoom?: number
}

export function useCanvasZoom(
  stageRef: React.RefObject<Konva.Stage | null>,
  { minZoom = 0.1, maxZoom = 10 }: UseCanvasZoomOptions = {}
) {
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = stageRef.current
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const direction = e.evt.deltaY > 0 ? -1 : 1
    const factor = 1.1
    const newScale = direction > 0
      ? Math.min(maxZoom, oldScale * factor)
      : Math.max(minZoom, oldScale / factor)

    stage.scale({ x: newScale, y: newScale })

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }, [stageRef, minZoom, maxZoom])

  const fitToContainer = useCallback((containerSize: Size, imageSize: Size) => {
    const stage = stageRef.current
    if (!stage) return

    const zoom = calculateFitZoom(containerSize, imageSize)
    const offsetX = (containerSize.width - imageSize.width * zoom) / 2
    const offsetY = (containerSize.height - imageSize.height * zoom) / 2

    stage.scale({ x: zoom, y: zoom })
    stage.position({ x: offsetX, y: offsetY })
  }, [stageRef])

  return { handleWheel, fitToContainer }
}
