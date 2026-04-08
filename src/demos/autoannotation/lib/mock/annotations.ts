import type { TaskAnnotations } from '@aa/lib/types/annotation'
import { ROBOFLOW_ANNOTATIONS } from './roboflow'

const runtimeAnnotations: Record<string, TaskAnnotations> = {}

export function addAnnotationsForTask(ann: TaskAnnotations) {
  runtimeAnnotations[ann.taskId] = ann
}

export function getAnnotationsForTask(taskId: string): TaskAnnotations | null {
  return runtimeAnnotations[taskId] ?? ROBOFLOW_ANNOTATIONS[taskId] ?? null
}
