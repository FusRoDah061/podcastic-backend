import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AddPodcastService from '../services/AddPodcastService';
import ListPodcastService from '../services/ListPodcastService';

export default class AllPodcastsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listPodcastService = container.resolve(ListPodcastService);

    const podcasts = await listPodcastService.execute();

    return response.json(podcasts);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { feedUrl } = request.body;

    const addPodcastService = container.resolve(AddPodcastService);

    await addPodcastService.execute({ feedUrl });

    return response.status(204).send();
  }
}
