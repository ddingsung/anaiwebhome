import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '../taskStore'
import { MOCK_TASKS } from '@aa/lib/mock/tasks'

describe('taskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [...MOCK_TASKS] })
  })

  it('MOCK_TASKS 길이로 초기화된다', () => {
    expect(useTaskStore.getState().tasks).toHaveLength(MOCK_TASKS.length)
  })

  it('approveTask: status가 approved로 변경된다', () => {
    const updated = useTaskStore.getState().approveTask('task-001')
    expect(updated.status).toBe('approved')
    expect(useTaskStore.getState().tasks.find(t => t.id === 'task-001')?.status).toBe('approved')
  })

  it('approveTask: approvedAt이 설정된다', () => {
    const updated = useTaskStore.getState().approveTask('task-001')
    expect(updated.approvedAt).toBeDefined()
  })

  it('approveTask: approvedBy가 설정된다', () => {
    const updated = useTaskStore.getState().approveTask('task-001')
    expect(updated.approvedBy).toBe('현재 사용자')
  })

  it('rejectTask: status가 rejected로 변경된다', () => {
    const updated = useTaskStore.getState().rejectTask('task-001', ['label_error'])
    expect(updated.status).toBe('rejected')
    expect(useTaskStore.getState().tasks.find(t => t.id === 'task-001')?.status).toBe('rejected')
  })

  it('rejectTask: revisionCount가 1 증가한다', () => {
    const before = useTaskStore.getState().tasks.find(t => t.id === 'task-001')!.revisionCount
    const updated = useTaskStore.getState().rejectTask('task-001', ['boundary_error'])
    expect(updated.revisionCount).toBe(before + 1)
  })

  it('rejectTask: rejectionReasons와 rejectionNote가 설정된다', () => {
    const updated = useTaskStore.getState().rejectTask('task-001', ['label_error', 'other'], '메모')
    expect(updated.rejectionReasons).toEqual(['label_error', 'other'])
    expect(updated.rejectionNote).toBe('메모')
  })

  it('updateTask: tasks 배열의 해당 항목이 교체된다', () => {
    const task = useTaskStore.getState().tasks[0]
    useTaskStore.getState().updateTask({ ...task, status: 'ai_done' })
    expect(useTaskStore.getState().tasks.find(t => t.id === task.id)?.status).toBe('ai_done')
  })

  it('존재하지 않는 id로 approveTask 호출 시 에러를 던진다', () => {
    expect(() => useTaskStore.getState().approveTask('nonexistent')).toThrow()
  })

  it('존재하지 않는 id로 rejectTask 호출 시 에러를 던진다', () => {
    expect(() => useTaskStore.getState().rejectTask('nonexistent', ['other'])).toThrow()
  })
})
