import { create } from 'zustand'
import type { Task, RejectionReason } from '@aa/lib/types/task'

interface TaskStoreState {
  tasks: Task[]
  updateTask: (updated: Task) => void
  addAITask: (task: Task) => void
  approveTask: (id: string) => Task
  rejectTask: (id: string, reasons: RejectionReason[], note?: string) => Task
  sendToRevision: (id: string, reasons?: RejectionReason[], note?: string) => Task
  sendBackToPending: (id: string) => Task
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],

  updateTask: (updated) =>
    set(state => ({
      tasks: state.tasks.map(t => (t.id === updated.id ? updated : t)),
    })),

  addAITask: (task) =>
    set(state => ({ tasks: [task, ...state.tasks] })),

  approveTask: (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) throw new Error(`Task ${id} not found`)
    const updated: Task = {
      ...task,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: '현재 사용자',
    }
    get().updateTask(updated)
    return updated
  },

  rejectTask: (id, reasons, note) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) throw new Error(`Task ${id} not found`)
    const updated: Task = {
      ...task,
      status: 'rejected',
      rejectionReasons: reasons,
      rejectionNote: note,
      revisionCount: task.revisionCount + 1,
    }
    get().updateTask(updated)
    return updated
  },

  sendToRevision: (id, reasons, note) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) throw new Error(`Task ${id} not found`)
    const updated: Task = {
      ...task,
      status: 'revision',
      rejectionReasons: reasons,
      rejectionNote: note,
      revisionCount: task.revisionCount + 1,
    }
    get().updateTask(updated)
    return updated
  },

  sendBackToPending: (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) throw new Error(`Task ${id} not found`)
    const updated: Task = {
      ...task,
      status: 'pending',
      rejectionReasons: undefined,
      rejectionNote: undefined,
    }
    get().updateTask(updated)
    return updated
  },
}))
