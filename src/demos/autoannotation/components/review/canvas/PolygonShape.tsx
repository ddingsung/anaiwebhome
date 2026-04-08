import { Line, Text, Group, Rect } from 'react-konva'
import type { PolygonAnnotation } from '@aa/lib/types/annotation'

interface PolygonShapeProps {
  annotation: PolygonAnnotation
  color: string
  isSelected: boolean
  isVisible: boolean
  onClick: () => void
}

function getBoundingBox(points: number[]) {
  const xs = points.filter((_, i) => i % 2 === 0)
  const ys = points.filter((_, i) => i % 2 === 1)
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  }
}

export function PolygonShape({ annotation, color, isSelected, isVisible, onClick, hideConfidence }: PolygonShapeProps & { hideConfidence?: boolean }) {
  if (!isVisible) return null

  const { points, label, confidence } = annotation
  const bb = getBoundingBox(points)
  const opacity = isSelected ? 1 : 0.85

  return (
    <Group onClick={onClick} opacity={opacity}>
      <Line
        points={points}
        closed
        stroke={color}
        strokeWidth={isSelected ? 2 : 1.5}
        fill={isSelected ? `${color}33` : `${color}18`}
      />
      <Rect
        x={bb.minX}
        y={bb.minY - 18}
        width={Math.max(80, label.length * 8 + 40)}
        height={18}
        fill={color}
        cornerRadius={[2, 2, 0, 0]}
      />
      <Text
        x={bb.minX + 4}
        y={bb.minY - 15}
        text={hideConfidence ? label : `${label} ${confidence.toFixed(0)}%`}
        fontSize={10}
        fill="#ffffff"
        fontFamily="-apple-system, sans-serif"
      />
    </Group>
  )
}
