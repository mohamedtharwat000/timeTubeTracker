import { Request, Response } from 'express';
import YouTubeHandler from '../utils/apiRequests';

class PlaylistController {
  static async calculatePlaylist(
    _req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await YouTubeHandler.fetchPlaylistVideosIDs(
      'PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS',
    );
    const dataDuration = await YouTubeHandler.fetchVideosDuration(data);

    return res.status(200).json(dataDuration);
  }
}

export default PlaylistController;
