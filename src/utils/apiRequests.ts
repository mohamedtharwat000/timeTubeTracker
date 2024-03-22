import dotenv from 'dotenv';
import { google } from 'googleapis';
import paginateArray from './pagination';
import parseIso8601Duration from './parseDuration';

const youtube = google.youtube({ version: 'v3' });

dotenv.config();

/**
 * Class for handling YouTube API interactions.
 */
export default class YouTubeHandler {
  /**
   * Fetches all video IDs from a YouTube playlist.
   * @param {string} playlistURL - The URL of the playlist.
   * @param {string} [nextPageToken] - The token for the next page.
   * @throws {Error} If the playlist URL is invalid.
   * @returns {Promise<string[]>} A promise that resolves to an array of video IDs.
   */
  static async fetchPlaylistVideosIDs(
    playlistURL: string,
    nextPageToken?: string,
  ): Promise<string[]> {
    const { apiKey } = process.env!;

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
      const videosIdsObj: string[] = [];

      data.items.forEach((element) => {
        videosIdsObj.push(element.contentDetails.videoId);
      });

      if (data.nextPageToken) {
        const newVideos = await this.fetchPlaylistVideosIDs(
          playlistURL,
          data.nextPageToken,
        );
        videosIdsObj.push(...newVideos);
      }
      return videosIdsObj;
    } catch (err) {
      throw new Error(
        `Error ${err.response.status}: ${err.response.statusText}`,
      );
    }
  }

  /**
   * Fetches the duration of each video from a list of YouTube video IDs.
   * @param {string[]} ids - The list of video IDs.
   * @throws {Error} If the IDs are not in an array.
   * @returns {Promise<string[]>} A promise that resolves to a list of video durations.
   */
  static async fetchVideosDuration(ids: string[]): Promise<string[]> {
    const { apiKey } = process.env!;
    const maxResults = 50;
    const videos: string[] = [];

    if (!Array.isArray(ids)) {
      throw new Error('Broken array: video IDs');
    }

    const pages = Array.from(
      { length: Math.ceil(ids.length / maxResults) },
      (_, i) => i + 1,
    );

    await Promise.all(
      pages.map(async (i) => {
        const response = await youtube.videos.list({
          part: ['contentDetails'],
          key: apiKey,
          id: paginateArray(i, maxResults, ids) as [],
        });
        videos.push(
          ...response.data.items.map(
            (item) => parseIso8601Duration(item.contentDetails.duration),
            // eslint-disable-next-line function-paren-newline
          ),
        );
      }),
    );

    return videos;
  }
}
