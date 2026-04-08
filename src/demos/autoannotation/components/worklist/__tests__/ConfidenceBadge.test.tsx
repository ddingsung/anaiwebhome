import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConfidenceBadge } from '../ConfidenceBadge'

describe('ConfidenceBadge', () => {
  it('신뢰도 수치를 소수점 1자리로 표시한다', () => {
    render(<ConfidenceBadge value={94.2} />)
    expect(screen.getByText('94.2%')).toBeInTheDocument()
  })

  it('90 이상은 고신뢰도 색상 클래스를 가진다', () => {
    const { container } = render(<ConfidenceBadge value={95} />)
    expect(container.firstChild).toHaveClass('text-conf-high')
  })

  it('70~89는 중간 신뢰도 색상 클래스를 가진다', () => {
    const { container } = render(<ConfidenceBadge value={75} />)
    expect(container.firstChild).toHaveClass('text-conf-mid')
  })

  it('70 미만은 저신뢰도 색상 클래스를 가진다', () => {
    const { container } = render(<ConfidenceBadge value={65} />)
    expect(container.firstChild).toHaveClass('text-conf-low')
  })
})
