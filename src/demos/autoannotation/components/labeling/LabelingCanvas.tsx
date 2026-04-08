'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Line, Circle, Transformer } from 'react-konva'
import Konva from 'konva'
import { useCanvasZoom } from '@aa/components/review/canvas/useCanvasZoom'
import { BBoxShape } from '@aa/components/review/canvas/BBoxShape'
import { PolygonShape } from '@aa/components/review/canvas/PolygonShape'
import { getLabelColor } from '@aa/lib/mock/labels'
import { useLabelingStore } from '@aa/store/labelingStore'
import { useAnnotationKeyboard } from '@aa/hooks/useAnnotationKeyboard'
import { useLabelStore } from '@aa/store/labelStore'
import type { BBoxAnnotation, PolygonAnnotation } from '@aa/lib/types/annotation'

function useImage(url: string, cached?: HTMLImageElement) {
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (cached) { setLoadedImage(cached); return }
    if (!url) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    if (img.complete && img.naturalWidth > 0) { setLoadedImage(img); return }
    img.onload = () => setLoadedImage(img)
    img.onerror = () => setLoadedImage(null)
    return () => { img.onload = null; img.onerror = null }
  }, [url, cached])
  return cached ?? loadedImage
}

export function LabelingCanvas({ onFitRequest }: { onFitRequest?: (fn: () => void) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const imageNodeRef = useRef<Konva.Image>(null)
  const bboxRectRef = useRef<Konva.Rect>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const fittedImageIdRef = useRef<string | null>(null)

  const {
    images, selectedImageId, activeTool,
    selectedAnnotationId, addAnnotation, selectAnnotation,
    updateAnnotationPoints, updateAnnotationBBox,
  } = useLabelingStore()

  const { labels } = useLabelStore()
  const defaultLabel = labels[0]?.id ?? 'melanoma'

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null
  const image = useImage(selectedImage?.url ?? '', selectedImage?.imageElement)
  const { handleWheel, fitToContainer } = useCanvasZoom(stageRef)

  // Drawing state
  const isDrawingBbox = useRef(false)
  const bboxStartRef = useRef({ x: 0, y: 0 })
  const [previewBbox, setPreviewBbox] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [polygonPoints, setPolygonPoints] = useState<number[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    // Read actual size immediately so first fit uses correct dimensions
    const { width, height } = containerRef.current.getBoundingClientRect()
    if (width > 0 && height > 0) setContainerSize({ width, height })

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Only fit when the image actually changes (not on every container resize)
  useEffect(() => {
    if (!image || !selectedImage || containerSize.width === 0) return
    if (fittedImageIdRef.current === selectedImage.id) return
    fittedImageIdRef.current = selectedImage.id
    fitToContainer(containerSize, {
      width: selectedImage.width,
      height: selectedImage.height,
    })
  }, [image, selectedImage, containerSize]) // eslint-disable-line react-hooks/exhaustive-deps

  // Apply Konva blur filter for mocked images
  useEffect(() => {
    const node = imageNodeRef.current
    if (!node || !image) return
    try {
      if (selectedImage?.isMocked) {
        node.cache()
        node.filters([Konva.Filters.Blur])
        node.blurRadius(18)
      } else {
        node.clearCache()
        node.filters([])
      }
      node.getLayer()?.batchDraw()
    } catch {
      // image not ready yet
    }
  }, [image, selectedImage?.isMocked])

  // Expose fit function to parent via callback
  useEffect(() => {
    if (!onFitRequest) return
    onFitRequest(() => {
      if (!selectedImage) return
      fittedImageIdRef.current = null
      fitToContainer(containerSize, {
        width: selectedImage.width,
        height: selectedImage.height,
      })
    })
  }, [onFitRequest, selectedImage, containerSize, fitToContainer])

  // Reset drawing state when tool or image changes
  useEffect(() => {
    setPreviewBbox(null)
    setPolygonPoints([])
    isDrawingBbox.current = false
  }, [activeTool, selectedImageId])

  // Cancel drawing on ESC (canvas-local state only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPolygonPoints([])
        setPreviewBbox(null)
        isDrawingBbox.current = false
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useAnnotationKeyboard({
    imageId: selectedImageId,
    selectedAnnotationId,
    activeTool,
    polygonInProgress: polygonPoints.length > 0,
    onUndoVertex: useCallback(() => {
      setPolygonPoints(prev => prev.slice(0, -2))
    }, []),
  })

  const getStagePos = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    return stage!.getRelativePointerPosition() ?? { x: 0, y: 0 }
  }

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool !== 'bbox') return
    const pos = getStagePos(e)
    isDrawingBbox.current = true
    bboxStartRef.current = pos
    setPreviewBbox({ x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const pos = stage!.getRelativePointerPosition() ?? { x: 0, y: 0 }
    setMousePos(pos)

    if (activeTool === 'bbox' && isDrawingBbox.current) {
      const start = bboxStartRef.current
      setPreviewBbox({
        x: Math.min(start.x, pos.x),
        y: Math.min(start.y, pos.y),
        w: Math.abs(pos.x - start.x),
        h: Math.abs(pos.y - start.y),
      })
    }
  }

  const handleMouseUp = () => {
    if (activeTool !== 'bbox' || !isDrawingBbox.current || !previewBbox || !selectedImageId) return
    isDrawingBbox.current = false

    if (previewBbox.w > 5 && previewBbox.h > 5) {
      const ann: BBoxAnnotation = {
        id: `ann-${Date.now()}`,
        type: 'bbox',
        label: defaultLabel,
        confidence: 1,
        isModified: false,
        x: previewBbox.x,
        y: previewBbox.y,
        width: previewBbox.w,
        height: previewBbox.h,
      }
      addAnnotation(selectedImageId, ann)
    }
    setPreviewBbox(null)
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const isStage = e.target === e.target.getStage()

    if (activeTool === 'select') {
      if (isStage) selectAnnotation(null)
      return
    }

    if (activeTool === 'polygon' && selectedImageId) {
      const pos = getStagePos(e)
      const scale = stageRef.current?.scaleX() ?? 1

      // Check close condition: click near first point with >= 3 points
      if (polygonPoints.length >= 6) {
        const [fx, fy] = polygonPoints
        const dist = Math.sqrt((pos.x - fx) ** 2 + (pos.y - fy) ** 2)
        if (dist < 20 / scale) {
          // Close polygon
          const ann: PolygonAnnotation = {
            id: `ann-${Date.now()}`,
            type: 'polygon',
            label: defaultLabel,
            confidence: 1,
            isModified: false,
            points: polygonPoints,
          }
          addAnnotation(selectedImageId, ann)
          setPolygonPoints([])
          return
        }
      }
      setPolygonPoints(prev => [...prev, pos.x, pos.y])
    }
  }

  const handleDblClick = () => {
    if (activeTool === 'polygon' && polygonPoints.length >= 6 && selectedImageId) {
      const ann: PolygonAnnotation = {
        id: `ann-${Date.now()}`,
        type: 'polygon',
        label: defaultLabel,
        confidence: 1,
        isModified: false,
        points: polygonPoints,
      }
      addAnnotation(selectedImageId, ann)
      setPolygonPoints([])
    }
  }

  const annotations = selectedImage?.annotations ?? []

  // Attach Transformer to selected bbox rect
  useEffect(() => {
    if (!trRef.current) return
    const anns = selectedImage?.annotations ?? []
    const hasBboxSelected = activeTool === 'select' &&
      anns.some(a => a.id === selectedAnnotationId && a.type === 'bbox')
    if (hasBboxSelected && bboxRectRef.current) {
      trRef.current.nodes([bboxRectRef.current])
    } else {
      trRef.current.nodes([])
    }
    trRef.current.getLayer()?.batchDraw()
  }, [selectedAnnotationId, activeTool, selectedImage?.annotations])

  // Polygon preview line points (current points + mouse position)
  const previewLinePoints = polygonPoints.length >= 2
    ? [...polygonPoints, mousePos.x, mousePos.y]
    : []

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#0a0a0a]"
      style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
    >
      {!selectedImage ? (
        <div className="flex h-full w-full items-center justify-center text-[12px] text-text-muted">
          좌측에서 이미지를 선택하거나 업로드하세요
        </div>
      ) : (
        <>
        <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onWheel={handleWheel}
        draggable={activeTool === 'select'}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
        onDblClick={handleDblClick}
      >
        {/* Image layer */}
        <Layer>
          {image && selectedImage && (
            <KonvaImage
              ref={imageNodeRef}
              image={image}
              width={selectedImage.width}
              height={selectedImage.height}
            />
          )}
        </Layer>

        {/* Annotations layer */}
        <Layer>
          {annotations.map(ann => {
            const color = getLabelColor(ann.label)
            const isSelected = selectedAnnotationId === ann.id
            const handleClick = () => selectAnnotation(ann.id)

            if (ann.type === 'bbox') {
              const a = ann as BBoxAnnotation
              if (isSelected && activeTool === 'select') {
                return (
                  <Rect
                    key={ann.id}
                    ref={bboxRectRef}
                    x={a.x}
                    y={a.y}
                    width={a.width}
                    height={a.height}
                    stroke={color}
                    strokeWidth={2}
                    fill={`${color}22`}
                    draggable
                    onClick={e => { e.cancelBubble = true }}
                    onDragEnd={e => {
                      if (!selectedImage) return
                      const node = e.target as Konva.Rect
                      updateAnnotationBBox(selectedImage.id, ann.id, {
                        x: Math.max(0, Math.min(node.x(), selectedImage.width - a.width)),
                        y: Math.max(0, Math.min(node.y(), selectedImage.height - a.height)),
                        width: a.width,
                        height: a.height,
                      })
                    }}
                    onTransformEnd={e => {
                      if (!selectedImage) return
                      const node = e.target as Konva.Rect
                      const scaleX = node.scaleX()
                      const scaleY = node.scaleY()
                      node.scaleX(1)
                      node.scaleY(1)
                      const rawWidth = node.width() * scaleX
                      const rawHeight = node.height() * scaleY
                      updateAnnotationBBox(selectedImage.id, ann.id, {
                        x: Math.max(0, node.x()),
                        y: Math.max(0, node.y()),
                        width: Math.max(5, Math.min(rawWidth, selectedImage.width - node.x())),
                        height: Math.max(5, Math.min(rawHeight, selectedImage.height - node.y())),
                      })
                    }}
                  />
                )
              }
              return <BBoxShape key={ann.id} annotation={ann} color={color} isSelected={isSelected} isVisible={true} onClick={handleClick} hideConfidence />
            } else {
              return <PolygonShape key={ann.id} annotation={ann} color={color} isSelected={isSelected} isVisible={true} onClick={handleClick} hideConfidence />
            }
          })}

          {/* Transformer for selected bbox */}
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox
              return newBox
            }}
          />

          {/* Polygon vertex editing handles */}
          {activeTool === 'select' && (() => {
            const ann = annotations.find(
              a => a.id === selectedAnnotationId && a.type === 'polygon'
            ) as import('@aa/lib/types/annotation').PolygonAnnotation | undefined
            if (!ann || !selectedImage) return null
            return ann.points.reduce<React.ReactElement[]>((acc, _, i) => {
              if (i % 2 !== 0) return acc
              const vx = ann.points[i]
              const vy = ann.points[i + 1]
              acc.push(
                <Circle
                  key={`v-${ann.id}-${i}`}
                  x={vx}
                  y={vy}
                  radius={5}
                  fill="white"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  draggable
                  onDragMove={e => {
                    const cx = Math.max(0, Math.min(selectedImage.width, e.target.x()))
                    const cy = Math.max(0, Math.min(selectedImage.height, e.target.y()))
                    e.target.x(cx)
                    e.target.y(cy)
                    const newPoints = [...ann.points]
                    newPoints[i] = cx
                    newPoints[i + 1] = cy
                    updateAnnotationPoints(selectedImage.id, ann.id, newPoints)
                  }}
                />
              )
              return acc
            }, [])
          })()}

          {/* Bbox preview */}
          {previewBbox && previewBbox.w > 0 && (
            <Rect
              x={previewBbox.x}
              y={previewBbox.y}
              width={previewBbox.w}
              height={previewBbox.h}
              stroke="#60a5fa"
              strokeWidth={1.5}
              dash={[4, 4]}
              fill="rgba(96,165,250,0.1)"
              listening={false}
            />
          )}

          {/* Polygon preview */}
          {previewLinePoints.length >= 4 && (
            <Line
              points={previewLinePoints}
              stroke="#60a5fa"
              strokeWidth={1.5}
              dash={[4, 4]}
              listening={false}
            />
          )}
          {polygonPoints.length >= 2 && polygonPoints.map((_, i) => {
            if (i % 2 !== 0) return null
            const x = polygonPoints[i]
            const y = polygonPoints[i + 1]
            const isFirst = i === 0
            return (
              <Circle
                key={i}
                x={x}
                y={y}
                radius={isFirst ? 5 : 3}
                fill={isFirst ? '#60a5fa' : 'white'}
                stroke="#60a5fa"
                strokeWidth={1}
                listening={false}
              />
            )
          })}
        </Layer>
      </Stage>

      <div className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-mono text-text-muted">
        {stageRef.current ? `${Math.round(stageRef.current.scaleX() * 100)}%` : '100%'}
      </div>

      {activeTool === 'polygon' && polygonPoints.length >= 2 && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] text-text-muted">
          점 {polygonPoints.length / 2}개 · 시작점 클릭 또는 더블클릭으로 닫기 · ESC 취소
        </div>
      )}
        </>
      )}
    </div>
  )
}
