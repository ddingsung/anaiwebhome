import DocumentViewerClient from '@idp/components/viewer/DocumentViewerClient'

export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `doc-${String(i + 1).padStart(3, '0')}`,
  }))
}

export default function DocumentViewerPage() {
  return <DocumentViewerClient />
}
