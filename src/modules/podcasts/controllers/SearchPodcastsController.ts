import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import SearchPodcastService from '../services/SearchPodcastService';

export default class SearchPodcastsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { q } = request.query;

    if (!q) {
      throw new AppError('Search text must not be empty.');
    }

    const searchPodcastService = container.resolve(SearchPodcastService);

    const podcasts = await searchPodcastService.execute({
      nameToSearch: q.toString(),
    });

    return response.json(podcasts);
  }
}
