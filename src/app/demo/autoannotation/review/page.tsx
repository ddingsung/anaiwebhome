'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTaskStore } from '@aa/store/taskStore'

export default function ReviewIndexPage() {
  const router = useRouter()
  const { tasks } = useTaskStore()

  useEffect(() => {
    const first = tasks.find(
      t => t.status === 'pending' || t.status === 'revision' || t.status === 'ai_done'
    )
    if (first) router.replace(`/review/${first.id}`)
    else router.replace('/')
  }, [tasks, router])

  return null
}
