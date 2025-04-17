import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import Store from 'electron-store';

// 初始化存储
const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  // 根据环境决定加载什么
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer/src/renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC事件处理
ipcMain.handle('get-cookie', async (event, platform) => {
  return store.get(`cookies.${platform}`, '');
});

ipcMain.handle('set-cookie', async (event, platform, cookie) => {
  store.set(`cookies.${platform}`, cookie);
  return true;
});

ipcMain.handle('get-following-list', async (event, platform) => {
  return store.get(`followingList.${platform}`, []);
});

ipcMain.handle('set-following-list', async (event, platform, list) => {
  store.set(`followingList.${platform}`, list);
  return true;
}); 