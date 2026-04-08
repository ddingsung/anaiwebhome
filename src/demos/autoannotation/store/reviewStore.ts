import { create } from 'zustand'

interface ReviewState {
  selectedAnnotationId: string | null
  zoom: number
  showOverlay: boolean
  isRejectionFormOpen: boolean
  hasModifiedAnnotations: boolean

  selectAnnotation: (id: string | null) => void
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  toggleOverlay: () => void
  openRejectionForm: () => void
  closeRejectionForm: () => void
  markAnnotationModified: () => void
  resetModifiedAnnotations: () => void
}

const ZOOM_MIN = 0.1
const ZOOM_MAX = 10
const ZOOM_STEP = 0.2

function clampZoom(z: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  selectedAnnotationId: null,
  zoom: 1,
  showOverlay: true,
  isRejectionFormOpen: false,
  hasModifiedAnnotations: false,

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  zoomIn: () => set({ zoom: clampZoom(get().zoom + ZOOM_STEP) }),
  zoomOut: () => set({ zoom: clampZoom(get().zoom - ZOOM_STEP) }),
  resetZoom: () => set({ zoom: 1 }),
  toggleOverlay: () => set({ showOverlay: !get().showOverlay }),
  openRejectionForm: () => set({ isRejectionFormOpen: true }),
  closeRejectionForm: () => set({ isRejectionFormOpen: false }),
  markAnnotationModified: () => set({ hasModifiedAnnotations: true }),
  resetModifiedAnnotations: () => set({ hasModifiedAnnotations: false }),
}))
