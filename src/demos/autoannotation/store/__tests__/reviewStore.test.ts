import { describe, it, expect, beforeEach } from 'vitest'
import { useReviewStore } from '../reviewStore'

describe('reviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({
      selectedAnnotationId: null,
      zoom: 1,
      showOverlay: true,
      isRejectionFormOpen: false,
      hasModifiedAnnotations: false,
    })
  })

  it('초기 zoom은 1이다', () => {
    expect(useReviewStore.getState().zoom).toBe(1)
  })

  it('setZoom으로 줌 변경', () => {
    useReviewStore.getState().setZoom(1.5)
    expect(useReviewStore.getState().zoom).toBe(1.5)
  })

  it('setZoom은 0.1 미만으로 내려가지 않는다', () => {
    useReviewStore.getState().setZoom(0.05)
    expect(useReviewStore.getState().zoom).toBe(0.1)
  })

  it('setZoom은 10 초과로 올라가지 않는다', () => {
    useReviewStore.getState().setZoom(15)
    expect(useReviewStore.getState().zoom).toBe(10)
  })

  it('toggleOverlay로 오버레이 토글', () => {
    expect(useReviewStore.getState().showOverlay).toBe(true)
    useReviewStore.getState().toggleOverlay()
    expect(useReviewStore.getState().showOverlay).toBe(false)
  })

  it('selectAnnotation으로 선택된 어노테이션 변경', () => {
    useReviewStore.getState().selectAnnotation('ann-001')
    expect(useReviewStore.getState().selectedAnnotationId).toBe('ann-001')
  })

  it('openRejectionForm으로 반려 폼 열기', () => {
    useReviewStore.getState().openRejectionForm()
    expect(useReviewStore.getState().isRejectionFormOpen).toBe(true)
  })
})
