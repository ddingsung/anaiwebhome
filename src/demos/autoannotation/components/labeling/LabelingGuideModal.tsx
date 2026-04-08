'use client'

import { X, MousePointer2, Square, Pentagon, ZoomIn, Keyboard } from 'lucide-react'

interface Props {
  onClose: () => void
}

const SECTIONS = [
  {
    icon: MousePointer2,
    title: '선택 도구 (S)',
    items: [
      '어노테이션 클릭 → 선택 및 이동',
      'BBox: 핸들 드래그로 크기 조정',
      'Polygon: 꼭짓점 드래그로 모양 수정',
      '빈 공간 클릭 → 선택 해제',
    ],
  },
  {
    icon: Square,
    title: '바운딩박스 (B)',
    items: [
      '캔버스에서 드래그하여 박스 그리기',
      '최소 5×5 픽셀 이상이어야 저장됨',
    ],
  },
  {
    icon: Pentagon,
    title: '폴리곤 (P)',
    items: [
      '클릭으로 꼭짓점 추가',
      '첫 번째 점 클릭 또는 더블클릭으로 완성',
      'ESC: 그리기 취소 · Backspace: 마지막 점 삭제',
      '3개 이상의 점이 있어야 완성 가능',
    ],
  },
  {
    icon: ZoomIn,
    title: '화면 조작',
    items: [
      '스크롤: 줌 인/아웃',
      '선택 도구 상태에서 드래그: 화면 이동',
      '툴바의 화면 맞춤 버튼으로 초기화',
    ],
  },
  {
    icon: Keyboard,
    title: '단축키',
    items: [
      'S — 선택 도구',
      'B — 바운딩박스 도구',
      'P — 폴리곤 도구',
      'Delete / Backspace — 선택 어노테이션 삭제',
      'ESC — 그리기 취소 / 선택 해제',
    ],
  },
]

export function LabelingGuideModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-[520px] max-h-[80vh] overflow-y-auto rounded-lg border border-border-default bg-bg-panel shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-text-primary">라벨링 사용 가이드</h2>
            <p className="mt-0.5 text-[11px] text-text-muted">툴 사용법 및 단축키 안내</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:bg-bg-surface hover:text-text-secondary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="divide-y divide-border-muted p-2">
          {SECTIONS.map(section => (
            <div key={section.title} className="flex gap-3 px-3 py-3">
              <div className="mt-0.5 flex-shrink-0">
                <section.icon size={14} className="text-accent-domain" />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-medium text-text-primary">{section.title}</p>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="text-[11px] text-text-muted">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border-default px-5 py-3">
          <button
            onClick={onClose}
            className="w-full rounded bg-accent-domain px-3 py-2 text-[12px] font-medium text-white hover:bg-accent-domain/90"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  )
}
