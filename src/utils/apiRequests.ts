import dotenv from 'dotenv';
import { google } from 'googleapis';
import paginateArray from './pagination';

const youtube = google.youtube({ version: 'v3' });

dotenv.config();

/**
 * Fetch Youtube API to get all ids of a playlist's videos
 *
 * @async
 * @param {string} playlistURL - playlist url
 * @param {string | null} [nextPageToken] - the next page token, this is just a recursive local parameter
 * @throws {Error} - error thrown if the url is broken
 * @returns {Promise<string[]>} Array of string contains all videos' ids
 */
async function fetchPlaylistVideosIDs(
  playlistURL: string,
  nextPageToken?: string | null,
): Promise<string[]> {
  const { apiKey } = process.env!;

  if (!playlistURL) {
    throw new Error('Playlist URL is requierd');
  }

  return youtube.playlistItems
    .list({
      maxResults: 50,
      part: ['contentDetails'],
      playlistId: playlistURL,
      key: apiKey,
      pageToken: nextPageToken || '',
    })
    .then(async (response) => {
      const { data } = response;
      const videosIdsObj = [];

      data.items.forEach((element) => {
        videosIdsObj.push(element.contentDetails.videoId);
      });

      if (data.nextPageToken) {
        const newVides = (await fetchPlaylistVideosIDs(
          playlistURL,
          data.nextPageToken,
        )) as [string];
        videosIdsObj.push(...newVides);
      }

      return videosIdsObj;
    })
    .catch((err) =>
      Promise.reject(
        `Error ${err.response.status}: ${err.response.statusText}`,
      ),
    );
}

/**
 * Get every video duration from a list of youtube videos ids
 *
 * @async
 * @param {[]} ids - list of videos ids
 * @throws {Error} - throws an error if ids is not array
 * @returns {Promise<string[]>} return a list contains every video duration
 */
async function fetchVideosDuration(ids: []): Promise<string[]> {
  const { apiKey } = process.env!;
  const maxResults = 50;
  let videos = [];

  if (!Array.isArray(ids)) {
    throw new Error("Broken array if videos ids");
  }

  for (let i = 1; i <= Math.ceil(ids.length / maxResults); i++) {
    videos.push(
      ...(
        await youtube.videos.list({
          part: ['contentDetails'],
          key: apiKey,
          id: paginateArray(i, maxResults, ids) as [],
        })
      ).data.items,
    );
  }
  return videos.map((e) => e.contentDetails.duration);
}

export { fetchPlaylistVideosIDs , fetchVideosDuration };
