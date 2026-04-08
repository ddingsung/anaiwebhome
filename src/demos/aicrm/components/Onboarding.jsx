import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap, ArrowRight, ChevronRight, Loader2 } from 'lucide-react'
import DemoPresenterBar, { ONBOARDING_STEPS } from './DemoPresenterBar'

const QUESTIONS = [
  {
    key: 'churnSensitivity',
    label: '이번 분기에 더 민감한 문제는?',
    helper: '계정 랭킹 전반의 리텐션 vs. 파이프라인 가중치를 설정합니다',
    options: [
      { value: 'pipeline', label: '신규 파이프라인 부족' },
      { value: 'retention', label: '기존 고객 이탈 리스크' },
    ],
  },
  {
    key: 'dealMotion',
    label: '팀이 주로 어떤 방식으로 영업하나요?',
    helper: '긴급도 임계값, 딜 규모 가중치, 사이클 길이 허용 기준을 조정합니다',
    options: [
      { value: 'enterprise', label: '대형 전략적 딜 중심' },
      { value: 'volume', label: '미드마켓 / 다건 처리 중심' },
    ],
  },
  {
    key: 'dealBlocker',
    label: '딜이 가장 자주 막히는 구간은?',
    helper: '팀의 실제 실패 패턴에 맞게 먼저 표면화할 리스크 신호를 설정합니다',
    options: [
      { value: 'decisions', label: '의사결정이 느려진다' },
      { value: 'pricing', label: '가격 저항이 생긴다' },
      { value: 'legal', label: '법무/보안 검토가 길어진다' },
      { value: 'priority', label: '내부 우선순위가 밀린다' },
    ],
  },
  {
    key: 'recStyle',
    label: '팀이 선호하는 추천 방식은?',
    helper: '추천 톤을 조절합니다 — 행동 요청 전 얼마나 많은 근거를 먼저 보여줄지 결정합니다',
    options: [
      { value: 'fast', label: '빠른 실행 중심 가이던스' },
      { value: 'evidence', label: '근거 중심 가이던스' },
    ],
  },
  {
    key: 'pricingStance',
    label: '가격 및 계약 조건에 얼마나 유연한가요?',
    helper: '할인 임계값과 AI 플레이북의 협상 가이던스를 설정합니다',
    options: [
      { value: 'flexible', label: '딜 모멘텀을 위해 유연하게' },
      { value: 'strict', label: '마진과 기준 보호를 위해 엄격하게' },
    ],
  },
]

const DEMO_DEFAULTS = {
  churnSensitivity: 'retention',
  dealMotion: 'enterprise',
  dealBlocker: 'legal',
  recStyle: 'fast',
  pricingStance: 'strict',
}

const ACTIVATION_STEPS = [
  '활성 계정 5개 분석 중',
  '플레이북 적용 중',
  '긴급도·리스크 기반 랭킹 계산 중',
  '추천 액션 생성 중',
]

export default function Onboarding({ onComplete }) {
  const [selections, setSelections] = useState({})
  const [activating, setActivating] = useState(false)
  const [activationStep, setActivationStep] = useState(0)
  const [demoVisible, setDemoVisible] = useState(true)

  const answered = QUESTIONS.filter(q => selections[q.key]).length
  const allAnswered = answered === QUESTIONS.length

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }))
  }

  const handleActivate = (data) => {
    setActivating(true)
    let step = 0
    const interval = setInterval(() => {
      step++
      setActivationStep(step)
      if (step >= ACTIVATION_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => onComplete(data), 400)
      }
    }, 380)
  }

  if (activating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-6">Intelligence Hub 활성화 중</p>
          <div className="space-y-2.5 w-64 text-left">
            {ACTIVATION_STEPS.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: activationStep >= i ? 1 : 0.25, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5"
              >
                {activationStep > i ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : activationStep === i ? (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                )}
                <p className={`text-xs ${activationStep >= i ? 'text-gray-700' : 'text-gray-400'}`}>{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-8 overflow-y-auto">
      <AnimatePresence>
        {demoVisible && (
          <DemoPresenterBar
            steps={ONBOARDING_STEPS}
            step={0}
            onPrev={() => {}}
            onNext={() => setDemoVisible(false)}
            onClose={() => setDemoVisible(false)}
          />
        )}
      </AnimatePresence>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Adaptive Revenue OS</span>
        </div>

        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Revenue Playbook 설정</h1>
            <p className="text-sm text-gray-500">5가지 질문에 답하면 시스템이 즉시 적응하고 팀의 실제 상황에 맞게 계정을 재랭킹합니다.</p>
          </div>
          <button
            onClick={() => handleActivate(DEMO_DEFAULTS)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 flex-shrink-0 ml-6"
          >
            Use Demo Defaults
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {QUESTIONS.map((q, idx) => (
            <motion.div
              key={q.key}
              id={`demo-onboarding-q-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, type: 'spring', damping: 24, stiffness: 200 }}
              className={[
                'bg-white border rounded-xl p-4 transition-colors shadow-sm',
                selections[q.key] ? 'border-indigo-300' : 'border-gray-200',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{q.label}</p>
                <AnimatePresence>
                  {selections[q.key] && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{q.helper}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(q.key, opt.value)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                      selections[q.key] === opt.value
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 space-y-2">
          <motion.button
            onClick={() => allAnswered && handleActivate(selections)}
            disabled={!allAnswered}
            animate={{ opacity: allAnswered ? 1 : 0.45 }}
            className={[
              'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-sm transition-all',
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            Activate Playbook
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          {!allAnswered && (
            <p className="text-center text-xs text-gray-400">
              {QUESTIONS.length - answered}개 질문 남음
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
