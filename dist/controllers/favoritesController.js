"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const getPlaylistId_1 = __importDefault(require("../utils/getPlaylistId"));
/**
 *  class containing methods for managing user favorites.
 */
class FavoritesController {
    /**
     * Adds a playlist URL to the user's favorites.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise<void>
     */
    static async addToFavorite(req, res) {
        const { user } = res.locals;
        const { playlistURL } = req.body;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!playlistURL) {
            return res.status(400).json({ error: 'Playlist URL is required' });
        }
        const { username } = user;
        if (user.favorites.includes((0, getPlaylistId_1.default)(playlistURL))) {
            return res
                .status(406)
                .json({ error: 'Playlist already exists in your favorite list' });
        }
        const playlistId = (0, getPlaylistId_1.default)(playlistURL);
        if (!playlistId) {
            return res.status(400).json({ error: 'Invalid playlist URL' });
        }
        await user_1.default.updateOne({ username }, {
            $push: {
                favorites: playlistId,
            },
        });
        return res.status(200).json({
            success: {
                message: 'Playlist was added successfully',
                playlistURL,
            },
        });
    }
    /**
     * Retrieves the user's favorite playlists.
     * @param _req - Express request object.
     * @param res - Express response object.
     * @returns void
     */
    static async getFavorites(_req, res) {
        const { user } = res.locals;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { username } = user;
        const favorites = await user_1.default.findOne({ username }).select('favorites');
        return res.status(200).json(favorites);
    }
    /**
     * Removes a playlist URL from the user's favorites.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise<void>
     */
    static async removeFromFavorite(req, res) {
        const { user } = res.locals;
        const playlistId = (0, getPlaylistId_1.default)(req.params.id) || req.params.id;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!playlistId) {
            return res.status(400).json({ error: 'Playlist ID is required' });
        }
        const { username } = user;
        if (!user.favorites.includes(playlistId)) {
            return res
                .status(406)
                .json({ error: 'Playlist does not exist in your favorite list' });
        }
        await user_1.default.updateOne({ username }, {
            $pull: {
                favorites: playlistId,
            },
        });
        return res.status(200).json({
            success: {
                message: 'Playlist deleted successfully',
                playlist: playlistId,
                username,
            },
        });
    }
}
exports.default = FavoritesController;
