import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'

export function initializeMainWindow(icon: string): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  app.on('activate', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  let forcequit = false
  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (forcequit === false) {
        e.preventDefault()
        mainWindow.hide()
      }
    } else {
      app.quit()
    }
  })

  app.on('before-quit', () => {
    forcequit = true
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return mainWindow
}

export function registerMainWindowListeners(mainWindow: BrowserWindow): void {
  ipcMain.on('showMainWindow', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
