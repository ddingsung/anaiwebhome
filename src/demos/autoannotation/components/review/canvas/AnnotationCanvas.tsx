'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { BBoxShape } from './BBoxShape'
import { PolygonShape } from './PolygonShape'
import { useCanvasZoom } from './useCanvasZoom'
import { useReviewStore } from '@aa/store/reviewStore'
import { getLabelColor } from '@aa/lib/mock/labels'
import type { TaskAnnotations } from '@aa/lib/types/annotation'
import type Konva from 'konva'

interface AnnotationCanvasProps {
  taskAnnotations: TaskAnnotations
}

function useImage(url: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    const img = new window.Image()
    img.src = url
    img.onload = () => setImage(img)
  }, [url])
  return image
}

export function AnnotationCanvas({ taskAnnotations }: AnnotationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  const { selectedAnnotationId, showOverlay, selectAnnotation } = useReviewStore()
  const { handleWheel, fitToContainer } = useCanvasZoom(stageRef)

  const image = useImage(taskAnnotations.imageUrl)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!image) return
    fitToContainer(containerSize, {
      width: taskAnnotations.imageWidth,
      height: taskAnnotations.imageHeight,
    })
  }, [image, containerSize, fitToContainer, taskAnnotations.imageWidth, taskAnnotations.imageHeight])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onWheel={handleWheel}
        draggable
        onClick={(e) => {
          if (e.target === e.target.getStage()) selectAnnotation(null)
        }}
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={taskAnnotations.imageWidth}
              height={taskAnnotations.imageHeight}
            />
          )}
        </Layer>

        {showOverlay && (
          <Layer>
            {taskAnnotations.annotations.map(ann => {
              const color = getLabelColor(ann.label)
              const isSelected = selectedAnnotationId === ann.id
              const commonProps = { isSelected, isVisible: true, onClick: () => selectAnnotation(ann.id) }

              if (ann.type === 'bbox') {
                return <BBoxShape key={ann.id} annotation={ann} color={color} {...commonProps} />
              } else {
                return <PolygonShape key={ann.id} annotation={ann} color={color} {...commonProps} />
              }
            })}
          </Layer>
        )}
      </Stage>

      <div className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-mono text-text-muted">
        {stageRef.current ? `${Math.round(stageRef.current.scaleX() * 100)}%` : '100%'}
      </div>
    </div>
  )
}
