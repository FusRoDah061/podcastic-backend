import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListEpisodesService from '../services/ListEpisodesService';

export default class EpisodesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { podcastId } = request.params;
    const { sort, q } = request.query;

    const listEpisodesService = container.resolve(ListEpisodesService);

    const podcastWithEpisodes = await listEpisodesService.execute({
      podcastId,
      sort: sort?.toString(),
      episodeNameToSearch: q?.toString(),
    });

    return response.json(podcastWithEpisodes);
  }
}
