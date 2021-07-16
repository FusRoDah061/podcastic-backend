import 'reflect-metadata';
import i18n from 'i18n';
import localeConfig from '../../../config/localeConfig';
import AppError from '../../../shared/errors/AppError';

import FakePodcastRepository from '../repositories/fakes/FakePodcastRepository';
import ListPodcastService from './ListPodcastService';

let fakePodcastRepository: FakePodcastRepository;
let listPodcast: ListPodcastService;

describe('AddPodcast', () => {
  beforeAll(() => {
    i18n.configure(localeConfig);
  });

  beforeEach(() => {
    fakePodcastRepository = new FakePodcastRepository();

    listPodcast = new ListPodcastService(fakePodcastRepository);
  });

  it('should return an existing podcast', async () => {
    const podcast = await fakePodcastRepository.create({
      name: 'Test podcast',
      description: 'Test podcast',
      feedUrl: 'http://feed.rss',
      imageUrl: 'image',
    });

    const foundPodcast = await listPodcast.execute(podcast.id, 'en');

    expect(foundPodcast).toBeTruthy();
  });

  it('should not return an non-existing podcast', async () => {
    await expect(
      listPodcast.execute('non-exitent-id', 'en'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
