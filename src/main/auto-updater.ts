import electronUpdater, { type AppUpdater } from 'electron-updater'
import log from 'electron-log'
import { app, ipcMain } from 'electron'

export function getAutoUpdater(): AppUpdater {
  const { autoUpdater } = electronUpdater
  log.transports.file.level = 'debug'
  autoUpdater.logger = log
  return autoUpdater
}

export function initializeAutoUpdater(): void {
  getAutoUpdater().autoDownload = false
  getAutoUpdater().autoInstallOnAppQuit = false
  getAutoUpdater().allowDowngrade = true
}

export function registerAutoUpdateListeners(mainWindow: Electron.BrowserWindow): void {
  ipcMain.on('updateAutoUpdater', () => {
    getAutoUpdater().checkForUpdatesAndNotify()
  })

  getAutoUpdater().addListener('update-available', () => {
    mainWindow.webContents.send('updateAvailable')
  })

  getAutoUpdater().addListener('update-not-available', () => {
    mainWindow.webContents.send('updateNotAvailable')
  })

  getAutoUpdater().addListener('update-downloaded', () => {
    mainWindow.webContents.send('updateDownloaded')
    app.emit('before-quit')
    setTimeout(() => {
      getAutoUpdater().quitAndInstall()
    }, 500)
  })

  getAutoUpdater().addListener('error', (error) => {
    mainWindow.webContents.send('updateError', error.message)
  })

  ipcMain.on('triggerUpdate', () => {
    getAutoUpdater().downloadUpdate()
  })
}
