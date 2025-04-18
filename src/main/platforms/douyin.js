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
export function getDouyinFollowList(cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, cookieArray, responseProcessed, responsePromise, streamers;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    cookieArray = cookies
                        .split(';')
                        .map(function (cookie) { return cookie.trim(); })
                        .filter(function (cookie) { return cookie && cookie.includes('=') && cookie.split('=')[1] !== ''; }) // 过滤空值和无效格式
                        .map(function (cookie) {
                        var _a = cookie.split('='), name = _a[0], valueParts = _a.slice(1); // 处理value中包含'='的情况
                        var value = valueParts.join('='); // 重新拼接value
                        if (!name || !value) {
                            console.warn("\u65E0\u6548Cookie: ".concat(cookie));
                            return null;
                        }
                        return { name: name.trim(), value: value.trim(), domain: '.douyin.com', path: '/' };
                    })
                        .filter(function (cookie) { return cookie !== null; });
                    if (cookieArray.length === 0) {
                        console.error('没有有效的Cookies');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, page.setCookie.apply(page, cookieArray)];
                case 3:
                    _a.sent();
                    responseProcessed = false;
                    responsePromise = new Promise(function (resolve) {
                        // 设置超时，如果在指定时间内没有收到响应，则返回空数组
                        var timeoutId = setTimeout(function () {
                            if (!responseProcessed) {
                                console.log('抖音API响应超时，返回空数组');
                                responseProcessed = true;
                                resolve([]);
                            }
                        }, 10000); // 增加超时时间到10秒
                        // 监听网络响应
                        page.on('response', function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var url, responseData, streamers_1, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = response.url();
                                        if (!(url.includes('webcast/web/feed/follow') && !responseProcessed)) return [3 /*break*/, 4];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, response.json().catch(function () { return null; })];
                                    case 2:
                                        responseData = _a.sent();
                                        console.log('收到抖音API响应:', url);
                                        if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
                                            // 标记为已处理
                                            responseProcessed = true;
                                            // 清除超时
                                            clearTimeout(timeoutId);
                                            streamers_1 = responseData.data.data.map(function (item) {
                                                var _a, _b;
                                                var room = item.room || {};
                                                var owner = item.owner || room.owner || {};
                                                // 获取头像URL
                                                var avatarUrl = ((_b = (_a = owner.avatar_thumb) === null || _a === void 0 ? void 0 : _a.url_list) === null || _b === void 0 ? void 0 : _b[0]) || '';
                                                return {
                                                    id: owner.id_str || '',
                                                    platform: 'douyin',
                                                    name: owner.nickname || '',
                                                    avatar: avatarUrl,
                                                    isLive: room.status === 2, // 假设2表示正在直播
                                                    roomId: room.id_str || '',
                                                    roomUrl: "https://www.douyin.com/live/".concat(room.id_str || ''),
                                                    title: room.title || '',
                                                    category: room.category_name || '',
                                                    viewerCount: parseInt(room.user_count_str || '0', 10),
                                                    startTime: room.create_time ? new Date(room.create_time * 1000).toISOString() : undefined,
                                                    description: room.description || '',
                                                };
                                            });
                                            console.log('成功解析抖音直播数据，共', streamers_1.length, '条');
                                            resolve(streamers_1);
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        console.warn("\u89E3\u6790\u6296\u97F3API\u54CD\u5E94\u5931\u8D25:", err_1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    // 启用请求拦截
                    return [4 /*yield*/, page.setRequestInterception(true)];
                case 4:
                    // 启用请求拦截
                    _a.sent();
                    page.on('request', function (request) {
                        request.continue();
                    });
                    // 访问抖音关注页面
                    console.log('正在访问抖音关注页面...');
                    return [4 /*yield*/, page.goto('https://www.douyin.com/follow', { waitUntil: 'networkidle2' })];
                case 5:
                    _a.sent();
                    // 等待API响应处理完成
                    console.log('等待抖音API响应...');
                    return [4 /*yield*/, responsePromise];
                case 6:
                    streamers = _a.sent();
                    // 关闭浏览器
                    return [4 /*yield*/, browser.close()];
                case 7:
                    // 关闭浏览器
                    _a.sent();
                    console.log('抖音关注列表获取完成，共', streamers.length, '个主播');
                    return [2 /*return*/, streamers];
            }
        });
    });
}
