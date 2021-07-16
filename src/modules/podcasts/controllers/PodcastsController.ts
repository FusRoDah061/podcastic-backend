import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPodcastService from '../services/ListPodcastService';

export default class PodcastsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { podcastId } = request.params;
    const { locale } = response;

    const listPodcastService = container.resolve(ListPodcastService);

    const podcast = await listPodcastService.execute(podcastId, locale);

    return response.json(podcast);
  }
}
