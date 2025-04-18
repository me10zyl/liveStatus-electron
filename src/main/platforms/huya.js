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
import puppeteer from 'puppeteer';
export function getHuyaFollowList(cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, cookieArray, followList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    cookieArray = cookies.split(';').map(function (cookie) {
                        var _a = cookie.trim().split('='), name = _a[0], value = _a[1];
                        return { name: name, value: value, domain: '.huya.com', path: '/' };
                    });
                    return [4 /*yield*/, page.setCookie.apply(page, cookieArray)];
                case 3:
                    _a.sent();
                    // 访问虎牙关注页面
                    return [4 /*yield*/, page.goto('https://www.huya.com/myfollow', { waitUntil: 'networkidle2' })];
                case 4:
                    // 访问虎牙关注页面
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            var list = Array.from(document.querySelectorAll('.subscribe-live-item')).map(function (item) {
                                var _a, _b, _c, _d, _e, _f;
                                // 获取主播ID和房间ID
                                var roomUrl = ((_a = item.querySelector('.video-info')) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
                                var roomId = roomUrl.split('/').pop() || '';
                                // 获取主播名称
                                var name = ((_c = (_b = item.querySelector('.nick')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                                // 获取直播状态
                                var isLiveTag = item.querySelector('.tag-living');
                                var isReplayTag = item.querySelector('.tag-replay');
                                var isLive = !!isLiveTag;
                                // 获取头像
                                var avatarElement = item.querySelector('.avatar img');
                                var avatar = (avatarElement === null || avatarElement === void 0 ? void 0 : avatarElement.getAttribute('src')) || '';
                                // 获取直播标题
                                var title = ((_e = (_d = item.querySelector('.intro')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || '';
                                // 获取观看人数
                                var viewerCountElement = item.querySelector('.num');
                                var viewerCountText = ((_f = viewerCountElement === null || viewerCountElement === void 0 ? void 0 : viewerCountElement.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || '0';
                                // 解析观看人数
                                var parseViewerCount = function (text) {
                                    if (!text)
                                        return 0;
                                    text = text.replace(/,/g, '');
                                    if (text.includes('万')) {
                                        return parseFloat(text.replace('万', '')) * 10000;
                                    }
                                    return parseInt(text, 10) || 0;
                                };
                                // 获取直播间ID
                                var dataLp = item.getAttribute('data-lp') || '';
                                return {
                                    id: dataLp,
                                    platform: 'huya',
                                    name: name,
                                    avatar: avatar,
                                    isLive: isLive,
                                    roomId: roomId,
                                    roomUrl: roomUrl,
                                    title: title,
                                    viewerCount: parseViewerCount(viewerCountText),
                                    // 其他可选字段可能需要额外处理
                                };
                            });
                            return list;
                        })];
                case 5:
                    followList = _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, followList];
            }
        });
    });
}
