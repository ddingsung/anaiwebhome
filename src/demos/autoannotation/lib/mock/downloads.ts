export interface Dataset {
  id: string
  name: string
  createdAt: string
  imageCount: number
  annotationCount: number
  format: string
  sizeBytes: number
}

export interface ModelFile {
  id: string
  name: string
  trainedAt: string
  datasetName: string
  format: string
  validationSummary: string
  sizeBytes: number
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}
