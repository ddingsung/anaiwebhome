import JSZip from 'jszip'
import { buildCocoJson } from './coco'
import { buildYoloFiles } from './yolo'
import { buildLabelmeFiles } from './labelme'
import type { LabelingImage } from '@aa/store/labelingStore'

export type ExportFormat = 'coco' | 'yolo' | 'labelme'

async function fetchImageBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.blob()
  } catch {
    return null
  }
}

export async function downloadZip(images: LabelingImage[], format: ExportFormat): Promise<void> {
  const zip = new JSZip()

  // Fetch all images (best-effort)
  const imageBlobs = await Promise.all(
    images.map(img => fetchImageBlob(img.url))
  )

  if (format === 'coco') {
    const imagesFolder = zip.folder('images')!
    images.forEach((img, i) => {
      const blob = imageBlobs[i]
      if (blob) imagesFolder.file(img.filename, blob)
    })
    zip.file('annotations.json', buildCocoJson(images))

  } else if (format === 'yolo') {
    const imagesFolder = zip.folder('images')!
    const labelsFolder = zip.folder('labels')!
    images.forEach((img, i) => {
      const blob = imageBlobs[i]
      if (blob) imagesFolder.file(img.filename, blob)
    })
    buildYoloFiles(images).forEach(({ filename, content }) => {
      labelsFolder.file(filename, content)
    })

  } else {
    // labelme: images and JSONs in root
    images.forEach((img, i) => {
      const blob = imageBlobs[i]
      if (blob) zip.file(img.filename, blob)
    })
    buildLabelmeFiles(images).forEach(({ filename, content }) => {
      zip.file(filename, content)
    })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = `export_${format}.zip`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
