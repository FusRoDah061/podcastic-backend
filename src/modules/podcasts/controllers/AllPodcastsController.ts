import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AddPodcastService from '../services/AddPodcastService';
import ListPodcastsService from '../services/ListPodcastsService';

export default class AllPodcastsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listPodcastsService = container.resolve(ListPodcastsService);

    const podcasts = await listPodcastsService.execute();

    return response.json(podcasts);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { feedUrl } = request.body;
    const { locale } = response;

    const addPodcastService = container.resolve(AddPodcastService);

    await addPodcastService.execute({ feedUrl }, locale);

    return response.status(204).send();
  }
}
