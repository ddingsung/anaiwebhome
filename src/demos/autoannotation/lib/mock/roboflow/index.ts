import type { Task } from '@aa/lib/types/task'
import type { TaskAnnotations, BBoxAnnotation } from '@aa/lib/types/annotation'
import trainJson from './train.json'
import validJson from './valid.json'
import testJson from './test.json'

const DEMO_COUNT = 15  // worklist에 올라갈 데모 태스크 수

// Roboflow category_id → our label id
const CATEGORY_LABEL: Record<number, string> = {
  1: 'blackheads',
  2: 'dark_spot',
  3: 'nodules',
  4: 'papules',
  5: 'pustules',
  6: 'whiteheads',
}

type Split = 'train' | 'valid' | 'test'

interface CocoImage {
  id: number
  file_name: string
  height: number
  width: number
  extra?: { name?: string }
}

interface CocoAnnotation {
  id: number
  image_id: number
  category_id: number
  bbox: number[]
}

interface CocoData {
  images: CocoImage[]
  annotations: CocoAnnotation[]
}

function seededConfidence(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return Math.round((55 + (x - Math.floor(x)) * 45) * 10) / 10
}

function buildData(data: CocoData, split: Split, offset: number) {
  const annsByImage = new Map<number, CocoAnnotation[]>()
  for (const ann of data.annotations) {
    if (!annsByImage.has(ann.image_id)) annsByImage.set(ann.image_id, [])
    annsByImage.get(ann.image_id)!.push(ann)
  }

  const tasks: Task[] = []
  const annotationsMap: Record<string, TaskAnnotations> = {}

  data.images.forEach((img, i) => {
    const globalIndex = offset + i
    const taskId = `rf-${split}-${img.id}`
    const imageUrl = `/anaiwebhome/demo-images/${img.file_name}`
    const imgAnns = annsByImage.get(img.id) ?? []
    const confidence = seededConfidence(globalIndex)

    tasks.push({
      id: taskId,
      filename: img.extra?.name ?? img.file_name,
      status: 'approved',
      confidence,
      processedAt: new Date(Date.now() - (962 - globalIndex) * 3600000).toISOString(),
      annotationCount: imgAnns.length,
      imageUrl,
      thumbnailUrl: imageUrl,
      revisionCount: 0,
      approvedAt: new Date(Date.now() - (962 - globalIndex) * 7200000).toISOString(),
      approvedBy: '검토자',
    })

    annotationsMap[taskId] = {
      taskId,
      imageUrl,
      imageWidth: img.width,
      imageHeight: img.height,
      annotations: imgAnns
        .filter(a => CATEGORY_LABEL[a.category_id])
        .map((a, ai): BBoxAnnotation => ({
          id: `${taskId}-ann-${ai}`,
          type: 'bbox',
          label: CATEGORY_LABEL[a.category_id],
          confidence: seededConfidence(globalIndex * 100 + ai),
          isModified: false,
          x: a.bbox[0],
          y: a.bbox[1],
          width: a.bbox[2],
          height: a.bbox[3],
        })),
    }
  })

  return { tasks, annotationsMap }
}

const trainData = trainJson as unknown as CocoData
const validData = validJson as unknown as CocoData
const testData  = testJson  as unknown as CocoData

const trainResult = buildData(trainData, 'train', 0)
const validResult = buildData(validData, 'valid', trainData.images.length)
const testResult  = buildData(testData,  'test',  trainData.images.length + validData.images.length)

const allTasks: Task[] = [...trainResult.tasks, ...validResult.tasks, ...testResult.tasks]
const allAnnotations: Record<string, TaskAnnotations> = {
  ...trainResult.annotationsMap,
  ...validResult.annotationsMap,
  ...testResult.annotationsMap,
}

const LABELING_COUNT = 10

// 라벨링 단에 표시할 이미지 (처음 10개)
export const LABELING_POOL: { url: string; filename: string; taskId: string }[] = allTasks
  .slice(0, LABELING_COUNT)
  .map(t => ({ url: t.imageUrl, filename: t.filename, taskId: t.id }))

// 마지막 DEMO_COUNT개는 데모용 풀 (taskStore에 처음엔 없음)
export const ROBOFLOW_TASKS: Task[] = allTasks.slice(0, allTasks.length - DEMO_COUNT)

// 데모 클릭 시 worklist에 추가될 15개 (ai_done 상태)
export const DEMO_POOL: Task[] = allTasks.slice(-DEMO_COUNT).map(t => ({
  ...t,
  status: 'ai_done' as const,
  approvedAt: undefined,
  approvedBy: undefined,
  processedAt: new Date().toISOString(),
}))

export const ROBOFLOW_ANNOTATIONS: Record<string, TaskAnnotations> = allAnnotations
