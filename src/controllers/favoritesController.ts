import { Request, Response } from 'express';
import User from '../models/user';
import getPlaylistIdFromLink from '../utils/getPlaylistId';

/**
 *  class containing methods for managing user favorites.
 */
class FavoritesController {
  /**
   * Adds a playlist URL to the user's favorites.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Promise<void>
   */
  static async addToFavorite(req: Request, res: Response): Promise<Response> {
    const { user } = res.locals;
    const { playlistURL } = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!playlistURL) {
      return res.status(400).json({ error: 'Playlist URL is required' });
    }

    const { username } = user;

    if (user.favorites.includes(getPlaylistIdFromLink(playlistURL))) {
      return res
        .status(406)
        .json({ error: 'Playlist already exists in your favorite list' });
    }

    const playlistId = getPlaylistIdFromLink(playlistURL);

    if (!playlistId) {
      return res.status(400).json({ error: 'Invalid playlist URL' });
    }

    await User.updateOne(
      { username },
      {
        $push: {
          favorites: playlistId,
        },
      },
    );

    return res.status(200).json({
      success: {
        message: 'Playlist was added successfully',
        playlistURL,
      },
    });
  }

  /**
   * Retrieves the user's favorite playlists.
   * @param _req - Express request object.
   * @param res - Express response object.
   * @returns void
   */
  static async getFavorites(_req: Request, res: Response): Promise<Response> {
    const { user } = res.locals;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username } = user;

    const favorites = await User.findOne({ username }).select('favorites');

    return res.status(200).json(favorites);
  }

  /**
   * Removes a playlist URL from the user's favorites.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Promise<void>
   */
  static async removeFromFavorite(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { user } = res.locals;
    const playlistId = getPlaylistIdFromLink(req.params.id) || req.params.id;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!playlistId) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const { username } = user;

    if (!user.favorites.includes(playlistId)) {
      return res
        .status(406)
        .json({ error: 'Playlist does not exist in your favorite list' });
    }

    await User.updateOne(
      { username },
      {
        $pull: {
          favorites: playlistId,
        },
      },
    );

    return res.status(200).json({
      success: {
        message: 'Playlist deleted successfully',
        playlist: playlistId,
        username,
      },
    });
  }
}

export default FavoritesController;
