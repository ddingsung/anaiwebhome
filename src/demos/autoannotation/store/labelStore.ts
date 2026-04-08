import { create } from 'zustand'
import { SKIN_LABELS, type Label } from '@aa/lib/mock/labels'

const STORAGE_KEY = 'labelStore.labels'

function loadFromStorage(): Label[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Label[]
  } catch {
    return null
  }
}

interface LabelStore {
  labels: Label[]
  addLabel: (name: string, color: string) => void
  removeLabel: (id: string) => void
}

export const useLabelStore = create<LabelStore>((set, get) => ({
  labels: loadFromStorage() ?? SKIN_LABELS,

  addLabel: (name, color) => {
    const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
    const labels = [...get().labels, { id, name, color }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
    set({ labels })
  },

  removeLabel: (id) => {
    const labels = get().labels.filter(l => l.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
    set({ labels })
  },
}))
