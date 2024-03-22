import { Request, Response } from 'express';
import User from '../models/users/user';

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

    // eslint-disable-next-line no-underscore-dangle
    const userId: string = user._id;

    if (!user.favorites.includes(playlistURL)) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          favorites: playlistURL,
        },
      });

      return res.status(200).json({
        success: {
          message: 'Playlist was added successfully',
          playlist: playlistURL,
        },
      });
    }
    return res
      .status(406)
      .json({ error: 'Playlist already exists in your favorite list' });
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
    const playlistId = req.params.id;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // eslint-disable-next-line no-underscore-dangle
    const userId: string = user._id;

    if (user.favorites.includes(playlistId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          favorites: playlistId,
        },
      });

      return res.status(200).json({
        success: {
          message: 'Playlist deleted successfully',
          playlist: playlistId,
          userId,
        },
      });
    }
    return res
      .status(406)
      .json({ error: 'Playlist does not exist in your favorite list' });
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

    // eslint-disable-next-line no-underscore-dangle
    const { favorites } = await User.findById(user._id).select('favorites');

    return res.status(200).json(favorites);
  }
}

export default FavoritesController;
