import { create } from 'zustand'
import type { Task } from '@aa/lib/types/task'
import type { Dataset, ModelFile } from '@aa/lib/mock/downloads'

interface DownloadStoreState {
  generatedDatasets: Dataset[]
  generatedModels: ModelFile[]
  exportDataset: (approvedTasks: Task[], format?: string) => Dataset
  requestModelTraining: (dataset: Dataset, format?: string) => ModelFile
}

export const useDownloadStore = create<DownloadStoreState>((set, get) => ({
  generatedDatasets: [],
  generatedModels: [],

  exportDataset: (approvedTasks, format = 'YOLO') => {
    const now = new Date().toISOString()
    const version = get().generatedDatasets.length + 1
    const dataset: Dataset = {
      id: `ds-gen-${Date.now()}`,
      name: `Approved Dataset v${version}`,
      createdAt: now,
      imageCount: approvedTasks.length,
      annotationCount: approvedTasks.reduce((sum, t) => sum + t.annotationCount, 0),
      format,
      sizeBytes: approvedTasks.length * 220_000,
    }
    set(state => ({ generatedDatasets: [dataset, ...state.generatedDatasets] }))
    return dataset
  },

  requestModelTraining: (dataset, format = 'ONNX') => {
    const version = get().generatedModels.filter(m => m.format === format).length + 1
    const model: ModelFile = {
      id: `mdl-gen-${Date.now()}`,
      name: `Skin Detector v${version}.0`,
      trainedAt: new Date().toISOString(),
      datasetName: dataset.name,
      format,
      validationSummary: '기준 데이터 기준 성능 확인 완료',
      sizeBytes: 85_000_000 + Math.floor(Math.random() * 10_000_000),
    }
    set(state => ({ generatedModels: [model, ...state.generatedModels] }))
    return model
  },
}))
