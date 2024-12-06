import { ipcMain } from 'electron'
import {
  addProduct,
  deleteAllProducts,
  deleteProduct,
  getProduct,
  openDirectory,
  readProducts,
  updateProduct
} from './handlers/product'

export function registerDatabaseListeners(): void {
  ipcMain.handle('read-products', () => {
    const products = readProducts()
    return products
  })

  ipcMain.handle('get-product', (_, id) => {
    return getProduct(id)
  })

  ipcMain.handle('add-product', (_, product) => {
    addProduct(product)
  })

  ipcMain.handle('update-product', (_, { id, product }) => {
    updateProduct(id, product)
  })

  ipcMain.handle('delete-product', (_, id) => {
    deleteProduct(id)
  })

  ipcMain.handle('delete-all-products', () => {
    deleteAllProducts()
  })

  ipcMain.handle('open-directory', () => {
    openDirectory()
  })
}
