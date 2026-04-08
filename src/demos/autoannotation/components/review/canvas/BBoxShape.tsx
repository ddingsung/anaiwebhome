import { Rect, Text, Group } from 'react-konva'
import type { BBoxAnnotation } from '@aa/lib/types/annotation'

interface BBoxShapeProps {
  annotation: BBoxAnnotation
  color: string
  isSelected: boolean
  isVisible: boolean
  onClick: () => void
  hideConfidence?: boolean
}

export function BBoxShape({ annotation, color, isSelected, isVisible, onClick, hideConfidence }: BBoxShapeProps) {
  if (!isVisible) return null

  const { x, y, width, height, label, confidence } = annotation
  const strokeWidth = isSelected ? 2 : 1.5
  const opacity = isSelected ? 1 : 0.85

  return (
    <Group onClick={onClick} opacity={opacity}>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={color}
        strokeWidth={strokeWidth}
        fill={isSelected ? `${color}22` : `${color}10`}
      />
      <Rect
        x={x}
        y={y - 18}
        width={Math.max(80, label.length * 8 + 40)}
        height={18}
        fill={color}
        cornerRadius={[2, 2, 0, 0]}
      />
      <Text
        x={x + 4}
        y={y - 15}
        text={hideConfidence ? label : `${label} ${confidence.toFixed(0)}%`}
        fontSize={10}
        fill="#ffffff"
        fontFamily="-apple-system, sans-serif"
      />
    </Group>
  )
}
