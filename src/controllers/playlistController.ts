import { Request, Response } from 'express';
import YouTubeHandler from '../utils/apiRequests';
import msToHMS from '../utils/msToHMS';
// import redisClient from '../models/storage/redisdb';

class PlaylistController {
  /**
   * Get the total length of a YouTube Playlist
   */
  static async calculateMulitplePlaylists(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const playLists = req.body.playlists as [];
    const playlistsData = [];
    const re = /list=([\w-]+)|^([\w-]+)$/;

    // eslint-disable-next-line no-restricted-syntax
    for await (const playlist of playLists) {
      const { playlistURL } = playlist;
      if (!playlistURL) {
        return res.status(400).json({ error: 'Missing Playlist URL' });
      }
      const extractedURL = (playlistURL as string)
        .match(re)[0]
        .split('list=')
        .filter((e: string) => e)[0];
      if (!re.test(playlistURL)) {
        return res.status(400).json({ error: 'Invalid Playlist URL/ID' });
      }

      const { start, end } = playlist;

      const data = await PlaylistController.calculatePlaylist(
        extractedURL,
        start, // Use the start property
        end,
      );

      // if (data.error) {
      //   return res.status(400).json(data);
      // }
      playlistsData.push(data);
    }

    return res.status(200).json(playlistsData);
  }

  /**
   * Get the total length of a YouTube Playlist
   */

  static async calculatePlaylist(playlistId: string, reqStart, reqEnd) {
    // const cachedPlaylist = await redisClient.get(playlistId);

    // if (cachedPlaylist) {
    //   return JSON.parse(cachedPlaylist);
    // }
    return YouTubeHandler.fetchPlaylistVideosIDs(playlistId)
      .then(async (data) => {
        const dataDuration = await YouTubeHandler.fetchVideosDuration(data);
        const start = reqStart ?? 1;
        const end = reqEnd ?? dataDuration.length;
        if (!start || start <= 0 || start > dataDuration.length) {
          return { error: 'Invalid Start index' };
        }
        if (!end || end <= 0 || end > dataDuration.length) {
          return { error: 'Invalid End index' };
        }
        if (start > end) {
          return { error: 'Invalid End and Start index' };
        }

        const fullDurationInMs = {};
        dataDuration.slice(start - 1, end).forEach((ele) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const speed of [1, 1.25, 1.5, 1.75, 2]) {
            fullDurationInMs[`${speed}x`] ??= 0;
            fullDurationInMs[`${speed}x`] += parseInt(ele, 10) / speed;
          }
        });
        const fullData = {
          totalPlaylistVideos: dataDuration.length,
          totalVideos: end - start + 1,
          averageDuration: msToHMS(fullDurationInMs['1x'] / (end - start + 1)),
          indexes: { start, end },
          durations: {
            ...Object.fromEntries(
              Object.entries(fullDurationInMs).map(([speed, duration]) => [
                `${speed}`,
                msToHMS(duration),
              ]),
            ),
          },
        };
        // redisClient.set(`${playlistId}`, JSON.stringify(fullData), 3600);
        return fullData;
      })
      .catch(() => ({ error: 'Invalid Playlist ID' }));
  }
}

export default PlaylistController;
