"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses an ISO 8601 duration string into milliseconds.
 * @param {string} durationString - The ISO 8601 duration string to parse.
 * @returns {number} The duration in milliseconds.
 * @throws {Error} If the duration string is not in a valid ISO 8601 format.
 */
function parseIso8601Duration(durationString) {
    const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const match = durationString.match(regex);
    if (!match) {
        throw new Error('Invalid ISO 8601 duration format');
    }
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return String(hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000);
}
exports.default = parseIso8601Duration;
