import { Request, Response } from 'express';
import YouTubeHandler from '../utils/apiRequests';
import msToHMS from '../utils/msToHMS';
import redisClient from '../models/storage/redisdb';

class PlaylistController {
  /**
   * Get the total length of a YouTube Playlist
   * And in all the available YouTube videos' speed
   *
   * @static
   * @async
   * @param {Request} req - express Request
   * @param {Response} res - express Response
   * @returns {Promise<Response>} A promise containing the response.
   */
  static async calculatePlaylist(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { playlistURL } = req.body;
    const re = /list=([\w-]+)|^([\w-]+)$/;

    if (!playlistURL) {
      return res.status(400).json({ error: 'Missing Playlist URL' });
    }
    const extractedURL = playlistURL
      .match(re)[0]
      .split('list=')
      .filter((e: string) => e)[0];
    if (!re.test(playlistURL)) {
      return res.status(400).json({ error: 'Invalid Playlist URL/ID' });
    }

    return YouTubeHandler.fetchPlaylistVideosIDs(extractedURL)
      .then(async (data) => {
        const dataDuration = await YouTubeHandler.fetchVideosDuration(data);

        const start = req.body.start ?? 1;
        const end = req.body.end ?? dataDuration.length;

        if (!start || start <= 0 || start > dataDuration.length) {
          return res.status(400).json({ error: 'Invalid Start index' });
        }
        if (!end || end <= 0 || end > dataDuration.length) {
          return res.status(400).json({ error: 'Invalid End index' });
        }
        if (start > end) {
          return res.status(400).json({ error: 'Invalid End and Start index' });
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
          totalVideos: dataDuration.length,
          averageDuration: msToHMS(fullDurationInMs['1x'] / (end - start + 1)),
          indexes: { start, end },
          ...Object.fromEntries(
            Object.entries(fullDurationInMs).map(([speed, duration]) => [
              `${speed}`,
              msToHMS(duration),
            ]),
          ),
        };
        redisClient.set(extractedURL, JSON.stringify(fullData), 3600);
        return res.status(200).json(fullData);
      })
      .catch(() => res.status(400).json({ error: 'Invalid Playlist ID' }));
  }
}

export default PlaylistController;
