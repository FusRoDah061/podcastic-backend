import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import AddPodcastService from '../services/AddPodcastService';
import ListPodcastService from '../services/ListPodcastService';
import SearchPodcastService from '../services/SearchPodcastService';

export default class PodcastController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listPodcastService = container.resolve(ListPodcastService);

    const podcasts = await listPodcastService.execute();

    return response.json(podcasts);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { rssUrl } = request.body;

    const addPodcastService = container.resolve(AddPodcastService);

    await addPodcastService.execute({ rssUrl });

    return response.status(204).send();
  }

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
