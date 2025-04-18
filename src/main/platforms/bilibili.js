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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import axios from "axios";
export function getBilibiliFollowList(cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var allStreamers, currentPage, totalPage, response, data, pageStreamers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allStreamers = [];
                    currentPage = 1;
                    totalPage = 1;
                    _a.label = 1;
                case 1: return [4 /*yield*/, axios.get("https://api.live.bilibili.com/xlive/web-ucenter/user/following?page=".concat(currentPage, "&page_size=9&ignoreRecord=1&hit_ab=true"), {
                        headers: {
                            Cookie: cookies,
                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
                            "referrer": "https://link.bilibili.com/p/center/index"
                        },
                    })];
                case 2:
                    response = _a.sent();
                    data = response.data;
                    if (data.code !== 0) {
                        return [2 /*return*/, []];
                    }
                    // 获取总页数
                    totalPage = data.data.totalPage;
                    pageStreamers = data.data.list.map(function (item) {
                        return {
                            id: item.uid.toString(),
                            platform: 'bilibili',
                            name: item.uname,
                            avatar: item.face,
                            isLive: item.live_status === 1,
                            roomId: item.roomid.toString(),
                            roomUrl: "https://live.bilibili.com/".concat(item.roomid),
                            title: item.title,
                            category: item.area_name_v2,
                            viewerCount: parseViewerCount(item.text_small),
                            startTime: item.record_live_time ? new Date(item.record_live_time * 1000).toISOString() : undefined,
                            description: item.room_news
                        };
                    });
                    allStreamers = __spreadArray(__spreadArray([], allStreamers, true), pageStreamers, true);
                    currentPage++;
                    _a.label = 3;
                case 3:
                    if (currentPage <= totalPage) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, allStreamers];
            }
        });
    });
}
// 辅助函数：将B站的观看人数字符串转换为数字
function parseViewerCount(viewerStr) {
    if (!viewerStr)
        return 0;
    if (viewerStr.includes('万')) {
        return parseFloat(viewerStr.replace('万', '')) * 10000;
    }
    return parseInt(viewerStr.replace(/,/g, ''), 10) || 0;
}
