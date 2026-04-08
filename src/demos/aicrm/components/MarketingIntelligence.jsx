import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, ArrowUpRight, Minus, ChevronDown } from 'lucide-react'
import { channelPerformance } from '../data/mockData'
import { Card, CardHeader, CardContent } from '@crm/components/ui/card'

const fmtCurrency = (n) => `$${(n / 1000).toFixed(0)}K`

const DIRECTIVE = {
  increase: { label: 'Increase', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  maintain: { label: 'Hold', color: 'text-gray-500', bg: 'bg-gray-50', dot: 'bg-gray-400' },
  decrease: { label: 'Reduce', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400' },
}

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-600" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />
  return <Minus className="w-3 h-3 text-gray-400" />
}

function ChannelItem({ ch, isExpanded, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-1 py-1 rounded hover:bg-white/60 transition-colors px-1 -mx-1"
      >
        <p className="text-xs text-gray-700 truncate font-medium text-left">{ch.channel}</p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <TrendIcon trend={ch.trend} />
          <span className={`text-[10px] font-semibold tabular-nums ${
            ch.trend === 'up' ? 'text-emerald-600' : ch.trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {ch.conversionRate}%
          </span>
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 px-2 py-2 bg-white/80 rounded-lg border border-white/60 space-y-1">
              <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-500">
                <span>예산 {fmtCurrency(ch.spend)}</span>
                <span>{ch.leads} leads</span>
                <span>{ch.conversions} 전환</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{ch.recommendation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MarketingIntelligence() {
  const [expandedId, setExpandedId] = useState(null)

  const sorted = [...channelPerformance].sort((a, b) => b.conversionRate - a.conversionRate)
  const topChannel = sorted[0]
  const reduceChannel = sorted.find(c => c.priority === 'decrease')

  const increases = sorted.filter(c => c.priority === 'increase')
  const holds = sorted.filter(c => c.priority === 'maintain')
  const reduces = sorted.filter(c => c.priority === 'decrease')

  const reduceSpend = reduces.reduce((s, c) => s + c.spend * 0.3, 0)
  const topChannelLabel = topChannel?.channel

  const handleToggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">Marketing Intelligence</h3>
          </div>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">AI Budget Optimization</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top conclusion */}
        <div className="flex items-start gap-2.5 px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg mb-3">
          <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-800 leading-snug">
              {topChannelLabel} 예산 집중 권장 — 이번 분기 Pipeline ROI 최고 경로
            </p>
            {reduceChannel && reduceSpend > 0 && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {reduceChannel.channel}에서 약 {fmtCurrency(reduceSpend)} 이동 → 상위 채널 재배분
              </p>
            )}
          </div>
        </div>

        {/* Increase / Hold / Reduce columns */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { key: 'increase', list: increases },
            { key: 'maintain', list: holds },
            { key: 'decrease', list: reduces },
          ].map(({ key, list }) => {
            const d = DIRECTIVE[key]
            return (
              <div key={key} className={`rounded-lg p-2.5 ${d.bg}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${d.color}`}>{d.label}</p>
                </div>
                <div className="space-y-1">
                  {list.map(ch => (
                    <ChannelItem
                      key={ch.id}
                      ch={ch}
                      isExpanded={expandedId === ch.id}
                      onToggle={() => handleToggle(ch.id)}
                    />
                  ))}
                  {list.length === 0 && (
                    <p className="text-[11px] text-gray-400">해당 없음</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Top channel detail */}
        {topChannel && (
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-800">{topChannel.channel}</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">Top Channel</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span>{topChannel.leads} leads</span>
              <span>{topChannel.conversions} 전환</span>
              <span className="text-emerald-600 font-semibold">전환율 {topChannel.conversionRate}%</span>
              <span className="text-emerald-600">{topChannel.trendDelta}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
