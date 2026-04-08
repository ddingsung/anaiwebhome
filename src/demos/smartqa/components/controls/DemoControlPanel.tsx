interface Config {
  ngRate: number
  intervalMs: number
}

interface Props {
  config: Config
  isPaused: boolean
  yieldThreshold: number
  onConfigChange: (next: Partial<Config>) => void
  onTogglePause: () => void
  onThresholdChange: (value: number) => void
  onReset: () => void
}

export function DemoControlPanel({ config, isPaused, yieldThreshold, onConfigChange, onTogglePause, onThresholdChange, onReset }: Props) {
  return (
    <div className="w-64 bg-panel border border-border rounded-lg p-4 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
        Demo Controls
      </p>

      {/* NG율 슬라이더 */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-text-secondary">NG율</span>
          <span className="text-sm font-semibold text-text-primary num">
            {(config.ngRate * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={config.ngRate * 100}
          onChange={e => onConfigChange({ ngRate: Number(e.target.value) / 100 })}
          className="w-full h-1.5 cursor-pointer accent-state-normal"
        />
      </div>

      {/* 속도 슬라이더 */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-text-secondary">검사 속도</span>
          <span className="text-sm font-semibold text-text-primary num">{config.intervalMs}ms</span>
        </div>
        <input
          type="range"
          min={200}
          max={2000}
          step={100}
          value={config.intervalMs}
          onChange={e => onConfigChange({ intervalMs: Number(e.target.value) })}
          className="w-full h-1.5 cursor-pointer accent-state-normal"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-muted">빠름</span>
          <span className="text-xs text-text-muted">느림</span>
        </div>
      </div>

      {/* 수율 임계값 슬라이더 */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-text-secondary">수율 임계값</span>
          <span className="text-sm font-semibold text-state-warn num">{yieldThreshold}%</span>
        </div>
        <input
          type="range"
          min={80}
          max={100}
          step={1}
          value={yieldThreshold}
          onChange={e => onThresholdChange(Number(e.target.value))}
          className="w-full h-1.5 cursor-pointer accent-state-warn"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-muted">80%</span>
          <span className="text-xs text-text-muted">100%</span>
        </div>
      </div>

      {/* 일시정지 토글 */}
      <button
        className={`w-full py-2 text-sm rounded font-semibold transition-colors ${
          isPaused
            ? 'bg-state-warn text-bg hover:opacity-90'
            : 'bg-border text-text-secondary hover:bg-border/70'
        }`}
        onClick={onTogglePause}
      >
        {isPaused ? '▶ 재개' : '⏸ 일시정지'}
      </button>

      {/* 세션 리셋 */}
      <button
        className="w-full mt-2 py-2 text-sm rounded font-medium text-text-muted border border-border hover:border-text-muted hover:text-text-secondary transition-colors"
        onClick={onReset}
      >
        ↺ 세션 리셋
      </button>
    </div>
  )
}
