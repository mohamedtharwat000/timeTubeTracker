/**
 * Paginates an array.
 * @param {number} pageNumber - The page number.
 * @param {number} maxPerPage - The maximum number of items per page.
 * @param {any[]} data - The array to paginate.
 * @returns {any[]} The paginated array.
 */
export default function paginateArray(
  pageNumber: number,
  maxPerPage = 50,
  data: string[] = [],
): string[] {
  const startIndex = (pageNumber - 1) * maxPerPage;
  const endIndex = Math.min(startIndex + maxPerPage, data.length);
  return data.slice(startIndex, endIndex);
}
