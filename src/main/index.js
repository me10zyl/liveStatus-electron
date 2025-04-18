var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import Store from 'electron-store';
import { getDouyuFollowList } from "./platforms/douyu.ts";
import { getBilibiliFollowList } from "./platforms/bilibili.ts";
import { getHuyaFollowList } from "./platforms/huya.ts";
import { getDouyinFollowList } from '../main/platforms/douyin';
// 初始化存储
var store = new Store();
var mainWindow = null;
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
    var isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../renderer/src/renderer/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.whenReady().then(function () {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// IPC事件处理
ipcMain.handle('get-cookie', function (event, platform) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, store.get("cookies.".concat(platform), '')];
    });
}); });
ipcMain.handle('set-cookie', function (event, platform, cookie) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        store.set("cookies.".concat(platform), cookie);
        return [2 /*return*/, true];
    });
}); });
ipcMain.handle('get-following-list', function (event, platform) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cookies = store.get("cookies.".concat(platform), '');
                if (!cookies) {
                    return [2 /*return*/, { error: '未设置Cookie' }];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 12, , 13]);
                _a = platform;
                switch (_a) {
                    case 'douyin': return [3 /*break*/, 2];
                    case 'douyu': return [3 /*break*/, 4];
                    case 'bilibili': return [3 /*break*/, 6];
                    case 'huya': return [3 /*break*/, 8];
                }
                return [3 /*break*/, 10];
            case 2: return [4 /*yield*/, getDouyinFollowList(cookies)];
            case 3: return [2 /*return*/, _b.sent()];
            case 4: return [4 /*yield*/, getDouyuFollowList(cookies)];
            case 5: return [2 /*return*/, _b.sent()];
            case 6: return [4 /*yield*/, getBilibiliFollowList(cookies)];
            case 7: return [2 /*return*/, _b.sent()];
            case 8: return [4 /*yield*/, getHuyaFollowList(cookies)];
            case 9: return [2 /*return*/, _b.sent()];
            case 10: throw new Error('不支持的平台');
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _b.sent();
                console.error("\u83B7\u53D6".concat(platform, "\u5173\u6CE8\u5217\u8868\u5931\u8D25:"), error_1);
                return [2 /*return*/, { error: '获取关注列表失败' }];
            case 13: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('set-following-list', function (event, platform, list) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        store.set("followingList.".concat(platform), list);
        return [2 /*return*/, true];
    });
}); });
