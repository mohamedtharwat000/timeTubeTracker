"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hlputils_1 = require("hlputils");
const apiRequests_1 = __importDefault(require("../utils/apiRequests"));
const msToHMS_1 = __importDefault(require("../utils/msToHMS"));
const redisdb_1 = __importDefault(require("../models/storage/redisdb"));
class PlaylistController {
    /**
     * Get the total length of a YouTube Playlist
     */
    static async calculateMulitplePlaylists(req, res) {
        const playLists = req.body.playlists;
        if (!playLists || (0, hlputils_1.type)(playLists) !== 'array' || playLists.length === 0) {
            return res.status(400).json({ error: 'no url provided' });
        }
        const playlistsData = {
            sum: {
                totalVideos: 0,
                durations: {
                    '1x': 0,
                    '1.25x': 0,
                    '1.5x': 0,
                    '1.75x': 0,
                    '2x': 0,
                },
            },
            playlists: [],
        };
        const re = /list=([\w-]+)|^([\w-]+)$/;
        // eslint-disable-next-line no-restricted-syntax
        for await (const playlist of playLists) {
            const { playlistURL } = playlist;
            if (!playlistURL) {
                return res.status(400).json({ error: 'Missing Playlist URL' });
            }
            if (!re.test(playlistURL)) {
                return res.status(400).json({ error: 'Invalid Playlist URL/ID' });
            }
            const extractedURL = playlistURL
                .match(re)[0]
                .split('list=')
                .filter((e) => e)[0];
            const { start, end } = playlist;
            const data = await PlaylistController.calculatePlaylist(extractedURL, start, end);
            if ('error' in data) {
                return res.status(400).json(data);
            }
            playlistsData.playlists.push(data);
            playlistsData.sum.totalVideos += data.totalVideos;
            // eslint-disable-next-line no-restricted-syntax
            for (const speed of [1, 1.25, 1.5, 1.75, 2]) {
                const value = Number(data.durationInMs) / speed;
                playlistsData.sum.durations[`${speed}x`] += value;
            }
        }
        return res.status(200).json({
            sum: {
                totalVideos: playlistsData.sum.totalVideos,
                durations: {
                    ...Object.fromEntries(Object.entries(playlistsData.sum.durations).map(([speed, duration]) => [`${speed}`, (0, msToHMS_1.default)(duration)])),
                },
            },
            playlists: playlistsData.playlists,
        });
    }
    /**
     * Get the total length of a YouTube Playlist
     */
    static async calculatePlaylist(playlistId, reqStart, reqEnd) {
        const cachedPlaylistExists = await redisdb_1.default.exists(playlistId);
        return (cachedPlaylistExists
            ? redisdb_1.default.get(playlistId)
            : apiRequests_1.default.fetchPlaylistVideosIDs(playlistId))
            .then(async (data) => {
            const dataDuration = cachedPlaylistExists
                ? JSON.parse(await redisdb_1.default.get(playlistId))
                : await apiRequests_1.default.fetchVideosDuration(data);
            const playlistTitle = cachedPlaylistExists
                ? await redisdb_1.default.get(`${playlistId}_title`)
                : await apiRequests_1.default.fetchPlaylistTitle(playlistId);
            const dataLength = dataDuration.length;
            const start = reqStart ?? 1;
            const end = reqEnd ?? dataLength;
            if (!start || start <= 0 || start > dataLength) {
                return { error: 'Invalid Start index' };
            }
            if (!end || end <= 0 || end > dataLength) {
                return { error: 'Invalid End index' };
            }
            if (start > end) {
                return { error: 'Invalid Start and End index' };
            }
            const fullDurationInMs = {};
            dataDuration.slice(start - 1, end).forEach((ele) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const speed of [1, 1.25, 1.5, 1.75, 2]) {
                    fullDurationInMs[`${speed}x`] ??= 0;
                    fullDurationInMs[`${speed}x`] += parseInt(ele, 10) / speed;
                }
            });
            await redisdb_1.default.set(`${playlistId}`, JSON.stringify(dataDuration), { EX: 3600 * 24 });
            await redisdb_1.default.set(`${playlistId}_title`, playlistTitle, {
                EX: 3600 * 24,
            });
            return {
                totalPlaylistVideos: dataLength,
                totalVideos: end - start + 1,
                playlistTitle,
                averageDuration: (0, msToHMS_1.default)(fullDurationInMs['1x'] / (end - start + 1)),
                indexes: { start, end },
                durationInMs: fullDurationInMs['1x'],
                durations: {
                    ...Object.fromEntries(Object.entries(fullDurationInMs).map(([speed, duration]) => [
                        `${speed}`,
                        (0, msToHMS_1.default)(duration),
                    ])),
                },
            };
        })
            .catch(() => ({ error: 'Invalid Playlist URL/ID' }));
    }
}
exports.default = PlaylistController;
