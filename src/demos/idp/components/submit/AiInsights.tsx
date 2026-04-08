'use client'

import type { Document } from '@idp/lib/types'
import { generateInsights, type InsightCard } from '@idp/lib/insights'

const CARD_STYLES: Record<
  InsightCard['type'],
  { border: string; bg: string; icon: string; iconColor: string }
> = {
  insight: { border: 'border-accent',   bg: 'bg-accent-light/30', icon: '✦', iconColor: 'text-accent'    },
  risk:    { border: 'border-amber-400', bg: 'bg-amber-50',        icon: '⚠', iconColor: 'text-amber-500' },
  action:  { border: 'border-success',  bg: 'bg-success-light',   icon: '→', iconColor: 'text-success'   },
}

export function AiInsights({ doc }: { doc: Document }) {
  const cards = generateInsights(doc)
  return (
    <div className="max-w-lg mx-auto mt-5">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-accent">✦</span>
        <h3 className="text-base font-semibold text-text-primary">AI 인사이트</h3>
      </div>
      <div className="space-y-3">
        {cards.map((card, i) => {
          const s = CARD_STYLES[card.type]
          return (
            <div
              key={i}
              className={`border-l-2 ${s.border} ${s.bg} rounded-r-card px-5 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className={`text-base mt-0.5 flex-shrink-0 ${s.iconColor}`}>{s.icon}</span>
                <div>
                  <p className="text-base font-medium text-text-primary">{card.headline}</p>
                  <p className="text-sm text-text-secondary mt-1">{card.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
