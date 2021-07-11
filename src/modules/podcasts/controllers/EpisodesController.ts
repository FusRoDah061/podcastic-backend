import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListEpisodesService from '../services/ListEpisodesService';

export default class EpisodesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { podcastId } = request.params;
    const { sort, q, page, pageSize } = request.query;
    const { locale } = response;

    const listEpisodesService = container.resolve(ListEpisodesService);

    const podcastWithEpisodes = await listEpisodesService.execute(
      {
        podcastId,
        sort: sort?.toString(),
        episodeNameToSearch: q?.toString(),
      },
      {
        page: Number(page),
        pageSize: Number(pageSize),
      },
      locale,
    );

    return response.json(podcastWithEpisodes);
  }
}
