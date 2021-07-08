import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPodcastsService from '../services/ListPodcastService';

export default class PodcastsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { podcastId } = request.params;
    const { locale } = response;

    const listPodcastsService = container.resolve(ListPodcastsService);

    const podcast = await listPodcastsService.execute(podcastId, locale);

    return response.json(podcast);
  }
}
