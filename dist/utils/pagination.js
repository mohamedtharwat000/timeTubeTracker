"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Paginates an array.
 * @param {number} pageNumber - The page number.
 * @param {number} maxPerPage - The maximum number of items per page.
 * @param {any[]} data - The array to paginate.
 * @returns {any[]} The paginated array.
 */
function paginateArray(pageNumber, maxPerPage = 50, data = []) {
    const startIndex = (pageNumber - 1) * maxPerPage;
    const endIndex = Math.min(startIndex + maxPerPage, data.length);
    return data.slice(startIndex, endIndex);
}
exports.default = paginateArray;
