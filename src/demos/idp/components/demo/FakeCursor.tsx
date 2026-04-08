'use client'

export interface CursorState {
  x: number       // viewport % (0–100)
  y: number       // viewport % (0–100)
  clicking: boolean
  visible: boolean
}

export function FakeCursor({ x, y, clicking, visible }: CursorState) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-4px, -2px) scale(${clicking ? 0.85 : 1})`,
        transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.1s',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M4 2L18 11L11 12.5L8 19L4 2Z"
          fill="white"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {clicking && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.25)',
            transform: 'translate(-7px, -7px)',
            animation: 'demo-ripple 0.4s ease-out forwards',
          }}
        />
      )}
    </div>
  )
}
