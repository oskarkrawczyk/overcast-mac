const path = require('path')
const fs = require('fs')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const client = require('electron-connect').client
const update = require('./update')

require('electron-debug')();
require('electron-dl')();

let mainWindow
const devel = process.env.NODE_ENV === "development"

function updateBadge(title){
  if (!app.dock) {
    return;
  }
  app.dock.setBadge(title);
}

function createWindow(){
  mainWindow = new BrowserWindow({
    show: false,
    width: 1260,
    width: devel ? 1260 : 560,
    minWidth: 460,
    maxWidth: devel ? 1260 : 560,
    height: 550,
    maxHeight: 550,
    minHeight: 550,
    titleBarStyle: 'hidden-inset',
    webPreferences : {
      devTools: devel,
      nodeIntegration: false,
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      preload: path.join(__dirname, 'browser.js'),
      blinkFeatures: "CSSBackdropFilter"
    }
  });

  mainWindow.loadURL('https://overcast.fm/login')

  if (devel){
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'dist/browser.css'), 'utf8'))
  })

  // this is causing errors when starting with `electron main.js`
  // client.create(mainWindow, function(){
  //   console.log('electron-connect client created')
  // })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Don't block rendering with update dialog, wait a bit before checking
  setTimeout(function () { update.check() }, 8000)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null){
    createWindow()
  }
})

ipc.on('update-badge', (event, data) => {
  let count = data.count
  if (count){
    updateBadge(count.toString())
  }
})
