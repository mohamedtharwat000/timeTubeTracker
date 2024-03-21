import { Request, Response } from 'express';
import fetchAPI from '../utils/apiRequests';

class PlaylistController {
  static async calculatePlaylist(
    _req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await fetchAPI('PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv')
      .then((result: []) => ({ length: result.length, ids: result }))
      .catch((error) => ({ error }));

    return res.status(200).json(data);
  }
}

export default PlaylistController;
