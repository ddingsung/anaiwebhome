import { describe, it, expect, beforeEach } from 'vitest'
import { useWorklistStore } from '../worklistStore'

describe('worklistStore', () => {
  beforeEach(() => {
    useWorklistStore.setState({
      activeTab: 'pending',
      selectedTaskId: null,
      searchQuery: '',
    })
  })

  it('초기 상태: activeTab은 pending', () => {
    expect(useWorklistStore.getState().activeTab).toBe('pending')
  })

  it('setActiveTab으로 탭 변경', () => {
    useWorklistStore.getState().setActiveTab('priority')
    expect(useWorklistStore.getState().activeTab).toBe('priority')
  })

  it('setSelectedTaskId로 선택 항목 변경', () => {
    useWorklistStore.getState().setSelectedTaskId('task-001')
    expect(useWorklistStore.getState().selectedTaskId).toBe('task-001')
  })

  it('setSearchQuery로 검색어 변경', () => {
    useWorklistStore.getState().setSearchQuery('IMG_2024')
    expect(useWorklistStore.getState().searchQuery).toBe('IMG_2024')
  })
})

describe('worklistStore — selectedIds', () => {
  beforeEach(() => {
    useWorklistStore.setState({
      activeTab: 'pending',
      selectedTaskId: null,
      searchQuery: '',
      selectedIds: [],
    })
  })

  it('초기 selectedIds는 빈 배열', () => {
    expect(useWorklistStore.getState().selectedIds).toEqual([])
  })

  it('toggleSelect: 없던 id를 추가한다', () => {
    useWorklistStore.getState().toggleSelect('task-001')
    expect(useWorklistStore.getState().selectedIds).toContain('task-001')
  })

  it('toggleSelect: 있던 id를 제거한다', () => {
    useWorklistStore.setState({ selectedIds: ['task-001'] })
    useWorklistStore.getState().toggleSelect('task-001')
    expect(useWorklistStore.getState().selectedIds).not.toContain('task-001')
  })

  it('selectAll: 전달된 id 배열로 교체한다', () => {
    useWorklistStore.getState().selectAll(['task-001', 'task-002'])
    expect(useWorklistStore.getState().selectedIds).toEqual(['task-001', 'task-002'])
  })

  it('clearSelection: selectedIds를 빈 배열로 초기화한다', () => {
    useWorklistStore.setState({ selectedIds: ['task-001', 'task-002'] })
    useWorklistStore.getState().clearSelection()
    expect(useWorklistStore.getState().selectedIds).toEqual([])
  })
})
