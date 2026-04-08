import SubmitPageClient from '@idp/components/submit/SubmitPageClient'

export function generateStaticParams() {
  const docs = Array.from({ length: 8 }, (_, i) => ({
    id: `doc-${String(i + 1).padStart(3, '0')}`,
  }))
  const uploads = Array.from({ length: 20 }, (_, i) => ({
    id: `upload-${String(i + 1).padStart(3, '0')}`,
  }))
  return [...docs, ...uploads]
}

export default function SubmitPage() {
  return <SubmitPageClient />
}
