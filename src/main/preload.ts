import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Cookie 相关操作
  getCookie: (platform: string) => ipcRenderer.invoke('get-cookie', platform),
  setCookie: (platform: string, cookie: string) => ipcRenderer.invoke('set-cookie', platform, cookie),
  
  // 关注列表相关操作
  getFollowingList: (platform: string) => ipcRenderer.invoke('get-following-list', platform),
  setFollowingList: (platform: string, list: any[]) => ipcRenderer.invoke('set-following-list', platform, list),
}); 