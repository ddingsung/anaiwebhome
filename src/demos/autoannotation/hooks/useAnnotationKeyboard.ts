import { useEffect } from 'react'
import { useLabelingStore } from '@aa/store/labelingStore'

interface Props {
  imageId: string | null
  selectedAnnotationId: string | null
  activeTool: 'select' | 'bbox' | 'polygon'
  polygonInProgress: boolean
  onUndoVertex: () => void
}

export function useAnnotationKeyboard({
  imageId,
  selectedAnnotationId,
  activeTool,
  polygonInProgress,
  onUndoVertex,
}: Props) {
  const { removeAnnotation, selectAnnotation } = useLabelingStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return

      if (e.key === 'Escape') {
        selectAnnotation(null)
        return
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (activeTool === 'polygon' && polygonInProgress) {
          if (e.key === 'Backspace') {
            e.preventDefault()
            onUndoVertex()
          }
          return
        }
        if (selectedAnnotationId && imageId) {
          e.preventDefault()
          removeAnnotation(imageId, selectedAnnotationId)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTool, polygonInProgress, selectedAnnotationId, imageId, onUndoVertex, removeAnnotation, selectAnnotation])
}
