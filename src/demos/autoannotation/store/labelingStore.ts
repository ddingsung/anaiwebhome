import { create } from 'zustand'
import type { Annotation } from '@aa/lib/types/annotation'
import { SKIN_LABELS } from '@aa/lib/mock/labels'

const DEFAULT_LABEL = SKIN_LABELS[0].id

export interface LabelingImage {
  id: string
  filename: string
  url: string
  width: number
  height: number
  status: 'unlabeled' | 'labeled'
  annotations: Annotation[]
  isMocked?: boolean
  imageElement?: HTMLImageElement
}

type ActiveTool = 'select' | 'bbox' | 'polygon'

interface LabelingStore {
  images: LabelingImage[]
  selectedImageId: string | null
  activeTool: ActiveTool
  selectedAnnotationId: string | null
  addImages: (files: File[]) => Promise<void>
  fillAnnotations: (imageId: string, anns: Annotation[]) => void
  addMockImages: (urls: { url: string; filename: string }[]) => Promise<void>
  selectImage: (id: string | null) => void
  setActiveTool: (tool: ActiveTool) => void
  selectAnnotation: (id: string | null) => void
  addAnnotation: (imageId: string, ann: Annotation) => void
  removeAnnotation: (imageId: string, annId: string) => void
  updateAnnotationLabel: (imageId: string, annId: string, label: string) => void
  updateAnnotationPoints: (imageId: string, annId: string, points: number[]) => void
  updateAnnotationBBox: (imageId: string, annId: string, patch: { x: number; y: number; width: number; height: number }) => void
  submitImage: (imageId: string) => void
}

function loadImage(url: string): Promise<{ width: number; height: number; element: HTMLImageElement }> {
  return new Promise(resolve => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, element: img })
    img.onerror = () => resolve({ width: 800, height: 600, element: img })
    img.src = url
  })
}

export const useLabelingStore = create<LabelingStore>((set, get) => ({
  images: [],
  selectedImageId: null,
  activeTool: 'select',
  selectedAnnotationId: null,

  addImages: async (files) => {
    const newImages: LabelingImage[] = []
    for (const file of files) {
      const url = URL.createObjectURL(file)
      const { width, height, element } = await loadImage(url)
      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        filename: file.name,
        url,
        width,
        height,
        status: 'unlabeled',
        annotations: [],
        imageElement: element,
      })
    }
    set(state => ({
      images: [...state.images, ...newImages],
      selectedImageId: state.selectedImageId ?? newImages[0]?.id ?? null,
    }))
  },

  addMockImages: async (urls) => {
    const hasMocks = get().images.some(i => i.isMocked)
    if (hasMocks) return

    for (const { url, filename } of urls) {
      const { width, height, element } = await loadImage(url)
      const image: LabelingImage = {
        id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        filename,
        url,
        width,
        height,
        status: 'unlabeled',
        annotations: [],
        isMocked: true,
        imageElement: element,
      }
      set(state => ({
        images: [...state.images, image],
        selectedImageId: state.selectedImageId ?? image.id,
      }))
    }
  },

  fillAnnotations: (imageId, anns) =>
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? { ...img, annotations: anns, status: 'labeled' as const }
          : img
      ),
    })),

  selectImage: (id) => set({ selectedImageId: id, selectedAnnotationId: null }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),

  addAnnotation: (imageId, ann) => {
    const safeAnn = ann.label ? ann : { ...ann, label: DEFAULT_LABEL }
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? { ...img, annotations: [...img.annotations, safeAnn] }
          : img
      ),
      selectedAnnotationId: safeAnn.id,
    }))
  },

  removeAnnotation: (imageId, annId) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? { ...img, annotations: img.annotations.filter(a => a.id !== annId) }
          : img
      ),
      selectedAnnotationId:
        get().selectedAnnotationId === annId ? null : get().selectedAnnotationId,
    }))
  },

  updateAnnotationLabel: (imageId, annId, label) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? {
              ...img,
              annotations: img.annotations.map(a =>
                a.id === annId ? { ...a, label } : a
              ),
            }
          : img
      ),
    }))
  },

  updateAnnotationPoints: (imageId, annId, points) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? {
              ...img,
              annotations: img.annotations.map(a =>
                a.id === annId ? { ...a, points } : a
              ),
            }
          : img
      ),
    }))
  },

  updateAnnotationBBox: (imageId, annId, patch) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId
          ? {
              ...img,
              annotations: img.annotations.map(a =>
                a.id === annId && a.type === 'bbox' ? { ...a, ...patch } : a
              ),
            }
          : img
      ),
    }))
  },

  submitImage: (imageId) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId ? { ...img, status: 'labeled' } : img
      ),
    }))
  },
}))
