import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import Store from 'electron-store';
import axios from 'axios';
import {getDouyuFollowList} from "./platforms/douyu.ts";
import {getBilibiliFollowList} from "./platforms/bilibili.ts";
import {getHuyaFollowList} from "./platforms/huya.ts";
import {getDouyinFollowList} from '../main/platforms/douyin'

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
  //return store.get(`followingList.${platform}`, []);
  const cookies = store.get(`cookies.${platform}`, '')
  if(!cookies){
    return {error: '未设置Cookie'}
  }
  try {
    switch (platform) {
      case 'douyin':
        return await getDouyinFollowList(cookies);
      case 'douyu':
        return await getDouyuFollowList(cookies);
      case 'bilibili':
        return await getBilibiliFollowList(cookies);
      case 'huya':
        return await getHuyaFollowList(cookies);
      default:
        throw new Error('不支持的平台');
    }
  } catch (error) {
    console.error(`获取${platform}关注列表失败:`, error);
    return { error: '获取关注列表失败' };
  }
});

ipcMain.handle('set-following-list', async (event, platform, list) => {
  store.set(`followingList.${platform}`, list);
  return true;
});