import { Request, Response } from 'express';
import { type } from 'hlputils';
import YouTubeHandler from '../utils/apiRequests';
import msToHMS from '../utils/msToHMS';
import redisClient from '../models/storage/redisdb';

class PlaylistController {
  /**
   * Get the total length of a YouTube Playlist
   */
  static async calculateMulitplePlaylists(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const playLists = req.body.playlists as [];

    if (!playLists || type(playLists) !== 'array' || playLists.length === 0) {
      return res.status(400).json({ error: 'no url provided' });
    }

    const playlistsData = {
      sum: {
        totalVideos: 0,
        durations: {
          '1x': 0,
          '1.25x': 0,
          '1.5x': 0,
          '1.75x': 0,
          '2x': 0,
        },
      },
      playlists: [],
    };
    const re = /list=([\w-]+)|^([\w-]+)$/;

    // eslint-disable-next-line no-restricted-syntax
    for await (const playlist of playLists) {
      const { playlistURL } = playlist;
      if (!playlistURL) {
        return res.status(400).json({ error: 'Missing Playlist URL' });
      }
      if (!re.test(playlistURL)) {
        return res.status(400).json({ error: 'Invalid Playlist URL/ID' });
      }

      const extractedURL = (playlistURL as string)
        .match(re)[0]
        .split('list=')
        .filter((e: string) => e)[0];

      const { start, end } = playlist;
      const data = await PlaylistController.calculatePlaylist(
        extractedURL,
        start,
        end,
      );

      if ('error' in data) {
        return res.status(400).json(data);
      }
      playlistsData.playlists.push(data);
      playlistsData.sum.totalVideos += data.totalVideos;

      // eslint-disable-next-line no-restricted-syntax
      for (const speed of [1, 1.25, 1.5, 1.75, 2]) {
        const value = Number(data.durationInMs) / speed;
        playlistsData.sum.durations[`${speed}x`] += value;
      }
    }

    return res.status(200).json({
      sum: {
        totalVideos: playlistsData.sum.totalVideos,
        durations: {
          ...Object.fromEntries(
            Object.entries(playlistsData.sum.durations).map(
              ([speed, duration]) => [`${speed}`, msToHMS(duration)],
            ),
          ),
        },
      },
      playlists: playlistsData.playlists,
    });
  }

  /**
   * Get the total length of a YouTube Playlist
   */

  static async calculatePlaylist(playlistId: string, reqStart, reqEnd) {
    const cachedPlaylistExists = await redisClient.exists(playlistId);

    return (
      cachedPlaylistExists
        ? redisClient.get(playlistId)
        : YouTubeHandler.fetchPlaylistVideosIDs(playlistId)
    )
      .then(async (data) => {
        const dataDuration = cachedPlaylistExists
          ? JSON.parse(await redisClient.get(playlistId))
          : await YouTubeHandler.fetchVideosDuration(data);

        const playlistTitle = cachedPlaylistExists
          ? await redisClient.get(`${playlistId}_title`)
          : await YouTubeHandler.fetchPlaylistTitle(playlistId);

        const dataLength = dataDuration.length;
        const start = reqStart ?? 1;
        const end = reqEnd ?? dataLength;

        if (!start || start <= 0 || start > dataLength) {
          return { error: 'Invalid Start index' };
        }
        if (!end || end <= 0 || end > dataLength) {
          return { error: 'Invalid End index' };
        }
        if (start > end) {
          return { error: 'Invalid Start and End index' };
        }

        const fullDurationInMs = {};

        dataDuration.slice(start - 1, end).forEach((ele) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const speed of [1, 1.25, 1.5, 1.75, 2]) {
            fullDurationInMs[`${speed}x`] ??= 0;
            fullDurationInMs[`${speed}x`] += parseInt(ele, 10) / speed;
          }
        });

        await redisClient.set(
          `${playlistId}`,
          JSON.stringify(dataDuration),
          { EX: 3600 * 24 }, // 24 hours
        );
        await redisClient.set(`${playlistId}_title`, playlistTitle, {
          EX: 3600 * 24,
        });

        return {
          totalPlaylistVideos: dataLength,
          totalVideos: end - start + 1,
          playlistTitle,
          averageDuration: msToHMS(fullDurationInMs['1x'] / (end - start + 1)),
          indexes: { start, end },
          durationInMs: fullDurationInMs['1x'],
          durations: {
            ...Object.fromEntries(
              Object.entries(fullDurationInMs).map(([speed, duration]) => [
                `${speed}`,
                msToHMS(duration),
              ]),
            ),
          },
        };
      })
      .catch(() => ({ error: 'Invalid Playlist URL/ID' }));
  }
}

export default PlaylistController;
