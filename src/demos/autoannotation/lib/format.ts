export function formatRelativeTime(isoString: string): string {
  const now = Date.now()
  const past = new Date(isoString).getTime()
  const diffMs = now - past
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${diffDay}일 전`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}초`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return sec > 0 ? `${min}분 ${sec}초` : `${min}분`
}

export function formatConfidence(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getConfidenceLevel(value: number): 'high' | 'mid' | 'low' {
  if (value >= 90) return 'high'
  if (value >= 70) return 'mid'
  return 'low'
}
