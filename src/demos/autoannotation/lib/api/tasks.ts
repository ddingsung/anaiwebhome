import type { Task, TaskStatus, RejectionReason } from '@aa/lib/types/task'
import { useTaskStore } from '@aa/store/taskStore'

export async function fetchTasks(): Promise<Task[]> {
  return Promise.resolve([...useTaskStore.getState().tasks])
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  return Promise.resolve(
    useTaskStore.getState().tasks.find(t => t.id === id) ?? null
  )
}

export async function fetchTasksByStatus(status: TaskStatus): Promise<Task[]> {
  return Promise.resolve(
    useTaskStore.getState().tasks.filter(t => t.status === status)
  )
}

export async function fetchAIResultTasks(): Promise<Task[]> {
  return Promise.resolve(
    useTaskStore.getState().tasks.filter(
      t => t.status === 'ai_done' || t.status === 'pending'
    )
  )
}

export async function approveTask(id: string): Promise<Task> {
  return Promise.resolve(useTaskStore.getState().approveTask(id))
}

export async function rejectTask(
  id: string,
  reasons: RejectionReason[],
  note?: string
): Promise<Task> {
  return Promise.resolve(useTaskStore.getState().rejectTask(id, reasons, note))
}
