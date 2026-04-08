import { describe, it, expect } from 'vitest'
import { MOCK_TASKS, getTaskById, getTasksByStatus, getAIResultTasks } from '../tasks'

describe('MOCK_TASKS', () => {
  it('30개의 작업 항목이 있다', () => {
    expect(MOCK_TASKS).toHaveLength(30)
  })

  it('모든 항목이 필수 필드를 가진다', () => {
    MOCK_TASKS.forEach(task => {
      expect(task.id).toBeTruthy()
      expect(task.filename).toBeTruthy()
      expect(task.status).toBeTruthy()
      expect(task.confidence).toBeGreaterThanOrEqual(0)
      expect(task.confidence).toBeLessThanOrEqual(100)
    })
  })
})

describe('getTaskById', () => {
  it('존재하는 ID로 작업을 반환한다', () => {
    const task = getTaskById('task-001')
    expect(task).not.toBeNull()
    expect(task?.filename).toBe('IMG_20240312_004521.jpg')
  })

  it('존재하지 않는 ID는 null을 반환한다', () => {
    expect(getTaskById('task-999')).toBeNull()
  })
})

describe('getTasksByStatus', () => {
  it('pending 상태 항목을 필터링한다', () => {
    const pending = getTasksByStatus('pending')
    pending.forEach(t => expect(t.status).toBe('pending'))
  })

  it('approved 상태 항목이 20개다', () => {
    expect(getTasksByStatus('approved')).toHaveLength(20)
  })
})

describe('getAIResultTasks', () => {
  it('ai_done 또는 pending 상태 항목만 반환한다', () => {
    const results = getAIResultTasks()
    results.forEach(t => {
      expect(['ai_done', 'pending']).toContain(t.status)
    })
  })
})
