import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { accounts } from '@crm/data/mockData'
import { Badge } from '@crm/components/ui/badge'

const RISK_VARIANT = { critical: 'destructive', high: 'warning', medium: 'secondary', low: 'success' }
const RISK_LABEL = { critical: 'CRITICAL', high: 'HIGH', medium: 'MED', low: 'LOW' }
const formatARR = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`
const RISK_FILTERS = ['all', 'critical', 'high', 'medium', 'low']

export default function AccountsPanel({ onClose, onAccountSelect }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const counts = {
    critical: accounts.filter(a => a.riskLevel === 'critical').length,
    high: accounts.filter(a => a.riskLevel === 'high').length,
    medium: accounts.filter(a => a.riskLevel === 'medium').length,
    low: accounts.filter(a => a.riskLevel === 'low').length,
  }

  const filtered = accounts
    .filter(a => filter === 'all' || a.riskLevel === filter)
    .filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-screen w-[520px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Accounts</h2>
              <span className="text-xs text-gray-400">{accounts.length}개</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Critical', count: counts.critical, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'High', count: counts.high, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Medium', count: counts.medium, color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { label: 'Low', count: counts.low, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className={`p-2 rounded-lg text-center ${s.bg}`}>
                <p className={`text-sm font-bold ${s.color}`}>{s.count}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="계정명 또는 산업 검색..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-1.5">
            {RISK_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? '전체' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(account => (
            <button
              key={account.id}
              onClick={() => onAccountSelect?.(account.id)}
              className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{account.name}</p>
                  <Badge variant={RISK_VARIANT[account.riskLevel]}>{RISK_LABEL[account.riskLevel]}</Badge>
                </div>
                <span className="text-sm font-bold tabular-nums text-gray-900 flex-shrink-0">{account.urgencyScore}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{formatARR(account.arr)} · {account.industry}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{account.lastActivity}</span>
                {account.trend === 'declining' && (
                  <span className="flex items-center gap-0.5 text-[11px] text-red-500">
                    <TrendingDown className="w-3 h-3" /> declining
                  </span>
                )}
                {account.trend === 'improving' && (
                  <span className="flex items-center gap-0.5 text-[11px] text-emerald-600">
                    <TrendingUp className="w-3 h-3" /> improving
                  </span>
                )}
                {account.trend === 'stable' && (
                  <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                    <Minus className="w-3 h-3" /> stable
                  </span>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">검색 결과 없음</p>
          )}
        </div>

      </motion.div>
    </>
  )
}
