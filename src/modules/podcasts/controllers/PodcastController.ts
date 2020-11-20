import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AddPodcastService from '../services/AddPodcastService';

export default class PodcastController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { rssUrl } = request.body;

    const addPodcastService = container.resolve(AddPodcastService);

    await addPodcastService.execute({ rssUrl });

    return response.status(204).send();
  }
}
