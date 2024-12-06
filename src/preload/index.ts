import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IApi, Product } from './types'

// Custom APIs for renderer
const api: IApi = {
  showMainWindow: () => ipcRenderer.send('showMainWindow'),
  getVersion: async () => {
    return await ipcRenderer.invoke('app-version')
  },
  products: {
    getAll: async (): Promise<Product[]> => {
      return await ipcRenderer.invoke('read-products')
    },
    add: async (product: Product): Promise<void> => {
      return await ipcRenderer.invoke('add-product', product)
    },
    get: async (id: string): Promise<Product> => {
      return await ipcRenderer.invoke('get-product', id)
    },
    update: async (id: string, product: Product): Promise<void> => {
      return await ipcRenderer.invoke('update-product', { id, product })
    },
    delete: async (id: string): Promise<void> => {
      return await ipcRenderer.invoke('delete-product', id)
    },
    deleteAll: async (): Promise<void> => {
      return await ipcRenderer.invoke('delete-all-products')
    },
    openDirectory: async (): Promise<void> => {
      return await ipcRenderer.invoke('open-directory')
    }
  },
  updates: {
    triggerUpdate: () => ipcRenderer.send('triggerUpdate'),
    updateAvailable: () => ipcRenderer.send('updateAvailable'),
    updateNotAvailable: () => ipcRenderer.send('updateNotAvailable'),
    updateDownloaded: () => ipcRenderer.send('updateDownloaded'),
    onUpdateAvailable: (callback) => ipcRenderer.on('updateAvailable', () => callback()),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('updateNotAvailable', () => callback()),
    onAutoUpdaterError: (callback) =>
      ipcRenderer.on('autoUpdaterError', (_event, value) => callback(value)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('updateDownloaded', () => callback()),
    updateAutoUpdater: () => ipcRenderer.send('updateAutoUpdater')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
