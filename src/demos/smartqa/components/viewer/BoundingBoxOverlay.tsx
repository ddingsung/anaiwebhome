// components/viewer/BoundingBoxOverlay.tsx
import type { BoundingBox } from '@sq/lib/types/inspection'

interface Props {
  boundingBoxes: BoundingBox[]
}

export function BoundingBoxOverlay({ boundingBoxes }: Props) {
  if (boundingBoxes.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {boundingBoxes.map((box) => (
        <div
          key={box.id}
          className="absolute border-2 border-state-ng animate-ng-pulse"
          style={{
            left:   `${box.x * 100}%`,
            top:    `${box.y * 100}%`,
            width:  `${box.width * 100}%`,
            height: `${box.height * 100}%`,
          }}
        >
          {/* 레이블 — 박스 상단 외부 */}
          <div className="absolute -top-5 left-0 flex items-center gap-1 whitespace-nowrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-state-ng">
              {box.defectType}
            </span>
            <span className="text-[10px] text-text-muted num">
              {(box.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
