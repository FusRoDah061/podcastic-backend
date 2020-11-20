import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AddPodcastFeedService from '../services/AddPodcastFeedService';

export default class AddPodcastFeedController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { rssUrl } = request.body;

    const addPodcastFeedService = container.resolve(AddPodcastFeedService);

    await addPodcastFeedService.execute({ rssUrl });

    return response.status(204).send();
  }
}
