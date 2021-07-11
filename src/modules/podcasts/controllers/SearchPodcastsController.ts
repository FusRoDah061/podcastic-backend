import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchPodcastService from '../services/SearchPodcastService';

export default class SearchPodcastsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { q, page, pageSize } = request.query;
    const { locale } = response;

    const searchPodcastService = container.resolve(SearchPodcastService);

    const podcasts = await searchPodcastService.execute(
      {
        nameToSearch: q as string,
      },
      {
        page: Number(page),
        pageSize: Number(pageSize),
      },
      locale,
    );

    return response.json(podcasts);
  }
}
