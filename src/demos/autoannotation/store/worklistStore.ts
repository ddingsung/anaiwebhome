import { create } from 'zustand'

type WorklistTab = 'pending' | 'priority' | 'all'

interface WorklistState {
  activeTab: WorklistTab
  selectedTaskId: string | null
  searchQuery: string
  selectedIds: string[]
  setActiveTab: (tab: WorklistTab) => void
  setSelectedTaskId: (id: string | null) => void
  setSearchQuery: (q: string) => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
}

export const useWorklistStore = create<WorklistState>((set) => ({
  activeTab: 'pending',
  selectedTaskId: null,
  searchQuery: '',
  selectedIds: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleSelect: (id) =>
    set(state => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter(s => s !== id)
        : [...state.selectedIds, id],
    })),
  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}))
