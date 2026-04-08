'use client'

import { useState, useEffect } from 'react'
import { getAllDocuments } from '@idp/lib/mock-data'
import { DocumentTable } from '@idp/components/dashboard/DocumentTable'
import type { Document } from '@idp/lib/types'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(() => getAllDocuments())

  useEffect(() => {
    setDocuments(getAllDocuments())
  }, [])

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">문서 목록</h1>
      <DocumentTable documents={documents} />
    </div>
  )
}
