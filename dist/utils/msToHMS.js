"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert milliseconds to HH:MM:SS format
 *
 * @param {number} ms - milliseconds
 * @returns {string} time in HH:MM:SS format
 */
function msToHMS(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const secondsFormatted = remainingSeconds % 60;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secondsFormatted.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
exports.default = msToHMS;
