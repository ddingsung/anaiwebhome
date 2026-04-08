// src/components/demo/scenes/Scene1Dashboard.tsx
'use client'

import { useEffect } from 'react'
import type { CursorState } from '../FakeCursor'

const MOCK_ROWS = [
  { name: '(주)한국물산_세금계산서_2026-03-28.pdf', type: '세금계산서', status: '검토 필요' },
  { name: '(주)서울상사_세금계산서_2026-03-29.pdf', type: '세금계산서', status: '전송 완료' },
  { name: '전자부품_발주서_2026-03-27.pdf',          type: '발주서',    status: '처리 중' },
  { name: '(주)한국물산_납품서_2026-03-26.pdf',      type: '납품서',    status: '검토 완료' },
  { name: '대한상사_거래명세서_2026-03-25.pdf',      type: '거래명세서', status: '대기 중' },
]

const STATUS_STYLE: Record<string, string> = {
  '검토 필요': 'bg-amber-100 text-amber-700',
  '전송 완료': 'bg-green-100 text-green-700',
  '처리 중':   'bg-blue-100 text-blue-700',
  '검토 완료': 'bg-slate-100 text-slate-600',
  '대기 중':   'bg-slate-100 text-slate-500',
}

interface Scene1Props { elapsed: number; onCursorUpdate: (s: CursorState) => void }

export function Scene1Dashboard({ onCursorUpdate }: Scene1Props) {
  useEffect(() => {
    onCursorUpdate({ x: 50, y: 50, clicking: false, visible: false })
  }, [onCursorUpdate])

  return (
    <div className="w-full h-full bg-base flex flex-col animate-in fade-in duration-500">
      {/* 상단 헤더 */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-text-primary">문서 처리 현황</h1>
          <span className="text-sm text-text-tertiary">오늘 처리 대기: <span className="font-semibold text-amber-600">5건</span></span>
        </div>
        <p className="text-base text-text-secondary">AI가 자동으로 문서를 분석하고 데이터를 추출합니다</p>
      </div>

      {/* KPI 바 */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '오늘 처리', value: '12건' },
          { label: '평균 처리 시간', value: '45초' },
          { label: '정확도', value: '99.2%' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface rounded-card p-5 shadow-card">
            <p className="text-sm text-text-tertiary mb-1">{kpi.label}</p>
            <p className="text-4xl font-bold text-text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 문서 목록 */}
      <div className="px-8 flex-1">
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-tertiary">파일명</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-tertiary">유형</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-tertiary">상태</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ROWS.map((row, i) => (
                <tr
                  key={row.name}
                  className="border-b border-border last:border-0 animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <td className="px-4 py-3 text-text-primary font-mono text-sm">{row.name}</td>
                  <td className="px-4 py-3 text-text-secondary text-sm">{row.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm px-3 py-1 rounded-badge font-medium ${STATUS_STYLE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
