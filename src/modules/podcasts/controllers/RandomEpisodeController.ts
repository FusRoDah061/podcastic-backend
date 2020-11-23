import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RandomEpisodeService from '../services/RandomEpisodeService';

export default class RandomEpisodeController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { podcastId } = request.params;

    const randomEpisodesService = container.resolve(RandomEpisodeService);

    const randomEpisode = await randomEpisodesService.execute({
      podcastId,
    });

    return response.json(randomEpisode);
  }
}
