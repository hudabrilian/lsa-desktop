import * as fs from 'node:fs'
import path from 'node:path'
import { Product } from '../../preload/types'
import { app } from 'electron'

// const dataDirPath = path.join(__dirname, '..', 'data')
const dataDirPath = `${app.getPath('userData')}/data/`

export const initFolder = (): void => {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath)
  }
}

export const readProducts = (): Product[] => {
  initFolder()
  const files = fs.readdirSync(dataDirPath)
  return files.map((file) => {
    const filePath = path.join(dataDirPath, file)
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  })
}

export const getProduct = (id: string): Product => {
  initFolder()
  const filePath = path.join(dataDirPath, `${id}.json`)

  // check if product exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Product with id ${id} does not exist`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export const addProduct = (product: Product): void => {
  initFolder()
  const filePath = path.join(dataDirPath, `${product.id}.json`)

  fs.writeFileSync(filePath, JSON.stringify(product))
}

export const updateProduct = (id: string, product: Product): void => {
  initFolder()
  const filePath = path.join(dataDirPath, `${id}.json`)

  // check if product exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Product with id ${id} does not exist`)
  }

  fs.writeFileSync(filePath, JSON.stringify(product))
}

export const deleteProduct = (id: string): void => {
  initFolder()
  const filePath = path.join(dataDirPath, `${id}.json`)

  // check if product exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Product with id ${id} does not exist`)
  }

  fs.unlinkSync(filePath)
}

export const deleteAllProducts = (): void => {
  initFolder()
  const files = fs.readdirSync(dataDirPath)
  files.forEach((file) => {
    const filePath = path.join(dataDirPath, file)
    fs.unlinkSync(filePath)
  })
}
