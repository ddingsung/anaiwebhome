import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('pending → "검토 대기" 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('검토 대기')).toBeInTheDocument()
  })

  it('ai_done → "AI 처리 완료" 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="ai_done" />)
    expect(screen.getByText('AI 처리 완료')).toBeInTheDocument()
  })

  it('revision → "수정 필요" 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="revision" />)
    expect(screen.getByText('수정 필요')).toBeInTheDocument()
  })

  it('rejected → "반려됨" 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('반려됨')).toBeInTheDocument()
  })

  it('approved → "승인 완료" 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('승인 완료')).toBeInTheDocument()
  })
})
