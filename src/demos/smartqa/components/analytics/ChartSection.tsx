'use client'

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DefectLogEntry, DefectType, KPISnapshot } from '@sq/lib/types/inspection'

const DEFECT_COLOR: Record<DefectType, string> = {
  SCRATCH: '#e8a820',
  VOID:    '#d94040',
  OPEN:    '#4f86cc',
  CRACK:   '#d94040',
  BRIDGE:  '#e07830',
  FOREIGN: '#8a8a8a',
}

interface DefectCount {
  type: string
  count: number
  color: string
}

function getDefectCounts(defectLog: DefectLogEntry[]): DefectCount[] {
  const recent = defectLog.slice(-20)
  const counts: Partial<Record<DefectType, number>> = {}
  for (const e of recent) {
    counts[e.defectType] = (counts[e.defectType] ?? 0) + 1
  }
  return (Object.entries(counts) as [DefectType, number][]).map(([type, count]) => ({
    type,
    count,
    color: DEFECT_COLOR[type],
  }))
}

interface Props {
  history: KPISnapshot[]
  defectLog: DefectLogEntry[]
  yieldThreshold: number
}

export function ChartSection({ history, defectLog, yieldThreshold }: Props) {
  const defectCounts = getDefectCounts(defectLog)

  return (
    <div className="flex-none border-b border-border">
      {/* 섹션 라벨 */}
      <div className="px-3 py-1.5 border-b border-border">
        <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Analytics
        </p>
      </div>

      {/* 수율 트렌드 */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-[10px] text-text-muted mb-1">수율 트렌드</p>
        {history.length < 3 ? (
          <div className="h-16 flex items-center justify-center">
            <span className="text-[10px] text-text-muted">검사 중...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={64}>
            <LineChart data={history} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
              <YAxis
                domain={[85, 100]}
                tick={{ fontSize: 9, fill: '#475569' }}
                tickLine={false}
                axisLine={false}
              />
              <ReferenceLine
                y={yieldThreshold}
                stroke="#e8a820"
                strokeDasharray="4 3"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="yieldRate"
                stroke="#3ecf6a"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => [`${(v as number).toFixed(1)}%`, '수율']}
                contentStyle={{
                  fontSize: 10,
                  background: '#21262d',
                  border: '1px solid #1e2329',
                  borderRadius: 4,
                  color: '#e2e8f0',
                }}
                itemStyle={{ color: '#3ecf6a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 결함 분포 */}
      <div className="px-3 pb-2">
        <p className="text-[10px] text-text-muted mb-1">결함 분포 (최근 20건)</p>
        <ResponsiveContainer width="100%" height={48}>
          <BarChart data={defectCounts} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
            <XAxis
              dataKey="type"
              tick={{ fontSize: 8, fill: '#475569' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#475569' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`${v}건`, '검출 수']}
              contentStyle={{
                fontSize: 10,
                background: '#21262d',
                border: '1px solid #1e2329',
                borderRadius: 4,
                color: '#e2e8f0',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {defectCounts.map((entry) => (
                <Cell key={entry.type} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
