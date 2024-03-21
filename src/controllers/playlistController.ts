import { Request, Response } from 'express';
import { fetchPlaylistVideosIDs, fetchVideosDuration } from '../utils/apiRequests';

class PlaylistController {
  static async calculatePlaylist(
    _req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await fetchPlaylistVideosIDs('PLGO8ntvxgiZPZBHUGED6ItUujXylNGpMH')
      .then((result) => result)
      .catch((error) => ({ error }));

    console.log(await fetchVideosDuration(data as []));
    return res.status(200).json(data);
  }
}

export default PlaylistController;
