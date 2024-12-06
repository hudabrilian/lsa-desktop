import { ElectronAPI } from '@electron-toolkit/preload'

export interface IApi {
  showMainWindow: () => void
  getVersion: () => Promise<string>
  products: {
    getAll: () => Promise<Product[]>
    get: (id: string) => Promise<Product>
    add: (product: Product) => Promise<void>
    update: (id: string, product: Product) => Promise<void>
    delete: (id: string) => Promise<void>
    deleteAll: () => Promise<void>
    openDirectory: () => Promise<void>
  }
  updates: {
    triggerUpdate: () => void
    updateAvailable: () => void
    updateNotAvailable: () => void
    onUpdateAvailable: (callback) => void
    onUpdateNotAvailable: (callback) => void
    onAutoUpdaterError: (callback) => void
    updateAutoUpdater: () => void
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}

export interface Product {
  id: string
  name: string
  period: number
  lowestLevel: number
  parts: Part[]
  mps: number[]
  createdAt: Date
  updatedAt: Date
}

export interface Part {
  id: string
  name: string
  amount: number
  level: number
  parent: string
  inventoryRecord: InventoryRecord
}

export interface InventoryRecord {
  onHand: number
  leadTime: number
  orderCost: number
  holdingCost: number
  orderQuantity: number
  orderPeriod: number
  scheduleReceipt: ScheduleReceipt[]
}

export interface ScheduleReceipt {
  period: number
  amount: number
}
