import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RecentPodcastsService from '../services/RecentPodcastsService';

export default class RecentPodcastsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const recentPodcastsService = container.resolve(RecentPodcastsService);

    const podcasts = await recentPodcastsService.execute({ howMany: 15 });

    return response.json(podcasts);
  }
}
