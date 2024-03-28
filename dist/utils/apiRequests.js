"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const pagination_1 = __importDefault(require("./pagination"));
const parseDuration_1 = __importDefault(require("./parseDuration"));
const youtube = googleapis_1.google.youtube({ version: 'v3' });
dotenv_1.default.config();
/**
 * Class for handling YouTube API interactions.
 */
class YouTubeHandler {
    /**
     * Fetches all video IDs from a YouTube playlist.
     * @param {string} playlistURL - The URL of the playlist.
     * @param {string} [nextPageToken] - The token for the next page.
     * @throws {Error} If the playlist URL is invalid.
     * @returns {Promise<string[]>} A promise that resolves to an array of video IDs.
     */
    static async fetchPlaylistVideosIDs(playlistURL, nextPageToken) {
        const { apiKey } = process.env;
        if (!playlistURL) {
            throw new Error('Playlist URL is required');
        }
        try {
            const response = await youtube.playlistItems.list({
                maxResults: 50,
                part: ['contentDetails'],
                playlistId: playlistURL,
                key: apiKey,
                pageToken: nextPageToken || '',
            });
            const { data } = response;
            const videosIdsObj = [];
            data.items.forEach((element) => {
                videosIdsObj.push(element.contentDetails.videoId);
            });
            if (data.nextPageToken) {
                const newVideos = await this.fetchPlaylistVideosIDs(playlistURL, data.nextPageToken);
                videosIdsObj.push(...newVideos);
            }
            return videosIdsObj;
        }
        catch (err) {
            throw new Error(`Error ${err.response.status}: ${err.response.statusText}`);
        }
    }
    /**
     * Fetches the duration of each video from a list of YouTube video IDs.
     * @param {string[]} ids - The list of video IDs.
     * @throws {Error} If the IDs are not in an array.
     * @returns {Promise<string[]>} A promise that resolves to a list of video durations.
     */
    static async fetchVideosDuration(ids) {
        const { apiKey } = process.env;
        const maxResults = 50;
        const videos = [];
        if (!Array.isArray(ids)) {
            throw new Error('Broken array of videos ids');
        }
        for (let i = 1; i <= Math.ceil(ids.length / maxResults); i += 1) {
            videos.push(...(await youtube.videos.list({
                part: ['contentDetails'],
                key: apiKey,
                id: (0, pagination_1.default)(i, maxResults, ids),
            })).data.items);
        }
        return videos.map((e) => (0, parseDuration_1.default)(e.contentDetails.duration));
    }
    /**
     * Fetches the title of a Youtube playlist list.
     * @param {string[]} ids - The list of video IDs.
     * @returns {Promise<string[]>} A promise that resolves to a the playlist title.
     */
    static async fetchPlaylistTitle(playlistURL) {
        const { apiKey } = process.env;
        const response = await youtube.playlists.list({
            part: ['snippet'],
            key: apiKey,
            id: [playlistURL],
        });
        return response.data.items[0].snippet.title;
    }
}
exports.default = YouTubeHandler;
