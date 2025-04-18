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
// 斗鱼关注列表
import axios from "axios";
export function getDouyuFollowList(cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, streamers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get('https://www.douyu.com/wgapi/livenc/liveweb/follow/list?sort=0&cid1=0', {
                        headers: {
                            Cookie: cookies,
                            "user-agent": " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
                            "referrer": "https://www.douyu.com/directory/myFollow"
                        },
                    })];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    if (data.error != 0) {
                        return [2 /*return*/, []];
                    }
                    streamers = data.data.list.map(function (item) {
                        return {
                            id: item.room_id.toString(),
                            platform: 'douyu',
                            name: item.nickname,
                            avatar: item.avatar_small,
                            isLive: item.show_status === 1,
                            roomId: item.room_id.toString(),
                            roomUrl: "https://www.douyu.com".concat(item.url),
                            title: item.room_name,
                            category: item.game_name,
                            viewerCount: parseViewerCount(item.online),
                            startTime: item.show_time ? new Date(item.show_time * 1000).toISOString() : undefined,
                        };
                    });
                    return [2 /*return*/, streamers];
            }
        });
    });
}
// 辅助函数：将斗鱼的观看人数字符串转换为数字
function parseViewerCount(viewerStr) {
    if (!viewerStr)
        return 0;
    if (viewerStr.includes('万')) {
        return parseFloat(viewerStr.replace('万', '')) * 10000;
    }
    return parseInt(viewerStr, 10) || 0;
}
