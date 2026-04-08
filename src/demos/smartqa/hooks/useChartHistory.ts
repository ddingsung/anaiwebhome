'use client'

import { useEffect, useState } from 'react'
import type { KPISnapshot, KPIState } from '@sq/lib/types/inspection'

export function useChartHistory(kpi: KPIState, maxLen = 60): KPISnapshot[] {
  const [history, setHistory] = useState<KPISnapshot[]>([])

  useEffect(() => {
    if (kpi.totalCount === 0) return
    setHistory(prev => {
      const next = [...prev, {
        timestamp: Date.now(),
        yieldRate: kpi.yieldRate,
        ngCount: kpi.ngCount,
      }]
      return next.length > maxLen ? next.slice(-maxLen) : next
    })
  // Only react to new ticks (totalCount). maxLen is treated as a stable init-time
  // config — changing it at runtime would cause history to be sliced unexpectedly.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpi.totalCount])

  return history
}
