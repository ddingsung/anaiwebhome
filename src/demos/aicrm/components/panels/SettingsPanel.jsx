import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Settings, CheckCircle2, Clock } from 'lucide-react'
import { teamMembers, integrations } from '@crm/data/mockData'

const PLAYBOOK_QUESTIONS = [
  {
    key: 'churnSensitivity',
    label: '이번 분기 민감도',
    options: { pipeline: '신규 파이프라인 부족', retention: '기존 고객 이탈 리스크' },
  },
  {
    key: 'dealMotion',
    label: '영업 방식',
    options: { enterprise: '대형 전략적 딜 중심', volume: '미드마켓 / 다건 처리' },
  },
  {
    key: 'dealBlocker',
    label: '주요 딜 블로커',
    options: { decisions: '의사결정 지연', pricing: '가격 저항', legal: '법무/보안 검토', priority: '내부 우선순위' },
  },
  {
    key: 'recStyle',
    label: '추천 스타일',
    options: { fast: '빠른 실행 중심', evidence: '근거 중심' },
  },
  {
    key: 'pricingStance',
    label: '가격 유연성',
    options: { flexible: '딜 모멘텀 우선', strict: '마진 보호 우선' },
  },
]

export default function SettingsPanel({ onClose, playbook, onPlaybookChange, onRestartOnboarding }) {
  const [localPlaybook, setLocalPlaybook] = useState(playbook || {})

  const handleSelect = (key, val) => {
    const updated = { ...localPlaybook, [key]: val }
    setLocalPlaybook(updated)
    onPlaybookChange?.(updated)
  }

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
        className="fixed top-0 right-0 h-screen w-[480px] bg-white border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Settings</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Playbook */}
          <section>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Revenue Playbook</p>
            <div className="space-y-3">
              {PLAYBOOK_QUESTIONS.map(q => (
                <div key={q.key} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-xs font-semibold text-gray-700 mb-2">{q.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(q.options).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => handleSelect(q.key, val)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                          localPlaybook[q.key] === val
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">팀 멤버</p>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-600">{member.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{member.name}</p>
                      <p className="text-[10px] text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {member.status === 'onboarding' ? (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Onboarding</span>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-gray-900">{member.winRate}%</p>
                        <p className="text-[10px] text-gray-400">Win Rate</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Integrations */}
          <section>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">인테그레이션</p>
            <div className="space-y-2">
              {integrations.map(int => (
                <div key={int.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    {int.status === 'connected'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      : <Clock className="w-4 h-4 text-amber-500" />
                    }
                    <p className="text-xs font-semibold text-gray-900">{int.name}</p>
                  </div>
                  <div className="text-right">
                    {int.status === 'connected' ? (
                      <>
                        <p className="text-[10px] text-emerald-600 font-medium">Connected</p>
                        <p className="text-[10px] text-gray-400">Synced {int.lastSync}</p>
                      </>
                    ) : (
                      <p className="text-[10px] text-amber-500 font-medium">Pending Setup</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 space-y-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            플레이북 적용
          </button>
          <button
            onClick={onRestartOnboarding}
            className="w-full py-2.5 bg-white text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            온보딩 다시하기
          </button>
        </div>
      </motion.div>
    </>
  )
}
