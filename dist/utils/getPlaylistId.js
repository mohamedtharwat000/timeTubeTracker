"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extracts the playlist ID from a YouTube playlist URL.
 *
 * This function extract the playlist ID from a YouTube playlist URL.
 * It searches for the pattern "list=", If found, it returns the ID.
 *
 * @param {string} url The YouTube playlist URL.
 * @returns {string | null} The playlist ID if found, otherwise null.
 */
function getPlaylistIdFromLink(url) {
    const playlistRegex = /(?:list=)([a-zA-Z0-9_]+)/;
    const match = url.match(playlistRegex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}
exports.default = getPlaylistIdFromLink;
