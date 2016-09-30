const path = require('path')
const fs = require('fs')
const electron = require('electron')
const ipc = require('electron').ipcMain
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// const Tray = electron.Tray
const client = require('electron-connect').client

require('electron-debug')();
require('electron-dl')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// function updateBadge(title){
//   if (!app.dock) {
//     return;
//   }
//
//   const messageCount = (/\(([0-9]+)\)/).exec(title);
//   app.dock.setBadge(messageCount ? messageCount[1] : '');
// }

function createWindow(){
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 1260,
    width: 560,
    minWidth: 460,
    maxWidth: 560,
    height: 550,
    maxHeight: 550,
    minHeight: 550,
    titleBarStyle: 'hidden-inset',
    webPreferences : {
      nodeIntegration: false,
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      preload: path.join(__dirname, 'browser.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL('https://overcast.fm/login')
  // mainWindow.loadURL('https://overcast.fm/+Y4o40s')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function(){
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('dom-ready', function(){
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'dist/browser.css'), 'utf8'))
    // mainWindow.show()
  })

  // this is causing errors when starting with `electron main.js`
  // client.create(mainWindow, function(){
  //   console.log('electron-connect client created')
  // })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // const tray = new Tray(path.join(__dirname, 'tray.png'))
  //
  // tray.on('click', () => {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function(){
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin'){
    app.quit()
  }
})

app.on('activate', function(){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null){
    createWindow()
  }
})

// app.dock.hide()

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
