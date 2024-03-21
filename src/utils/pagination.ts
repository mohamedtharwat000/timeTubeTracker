/**
 * Paginate an array and splits it
 *
 * @param {number} pageNumber - current page number, starting from 0
 * @param {number} [maxPerPage] - max element per page
 * @param {[]} data - the array to get from it the right number element for the current page
 * @returns {number[]} - the array after splitting it for the current page. 
 */
function paginateArray(
  pageNumber: number,
  maxPerPage: number = 50,
  data: [],
): number[] {
  const startIndex = (pageNumber - 1) * maxPerPage;
  const endIndex = Math.min(startIndex + maxPerPage, data.length);
  return data.slice(startIndex, endIndex);
}

export default paginateArray;
