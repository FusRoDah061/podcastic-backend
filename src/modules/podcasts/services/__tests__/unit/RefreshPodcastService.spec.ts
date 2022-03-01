import 'reflect-metadata';
import path from 'path';
import { container } from 'tsyringe';
import FakeFeedHealthcheckProvider from '../../../../../shared/providers/FeedHealthcheckProvider/fakes/FakeFeedHealthcheckProvider';
import FakeFeedParserProvider from '../../../../../shared/providers/FeedParserProvider/fakes/FakeFeedParserProvider';
import FakeEpisodesRepository from '../../../repositories/fakes/FakeEpisodesRepository';
import FakePodcastRepository from '../../../repositories/fakes/FakePodcastRepository';
import RefreshPodcastService from '../../RefreshPodcastService';
import FindDominantColorService from '../../FindDominantColorService';
import FakeDownloadFileProvider from '../../../../../shared/providers/DownloadFileProvider/fakes/FakeDownloadFileProvider';
import RecoverableError from '../../../errors/RecoverableError';

let fakePodcastRepository: FakePodcastRepository;
let fakeEpisodesRepository: FakeEpisodesRepository;
let fakeFeedHealthcheckProvider: FakeFeedHealthcheckProvider;
let fakeFeedParserProvider: FakeFeedParserProvider;
let fakeDownloadFileProvider: FakeDownloadFileProvider;

let refreshPodcastService: RefreshPodcastService;
let findDominantColorService: FindDominantColorService;

describe('RefreshPodcast', () => {
  beforeEach(() => {
    fakePodcastRepository = new FakePodcastRepository();
    fakeEpisodesRepository = new FakeEpisodesRepository();
    fakeFeedHealthcheckProvider = new FakeFeedHealthcheckProvider();
    fakeFeedParserProvider = new FakeFeedParserProvider();
    fakeDownloadFileProvider = new FakeDownloadFileProvider();

    refreshPodcastService = new RefreshPodcastService(
      fakePodcastRepository,
      fakeEpisodesRepository,
      fakeFeedHealthcheckProvider,
      fakeFeedParserProvider,
    );

    findDominantColorService = new FindDominantColorService(
      fakeDownloadFileProvider,
    );

    jest.spyOn(container, 'resolve').mockReturnValue(findDominantColorService);
  });

  it("should be able to create a podcast if it doesn't exist", async () => {
    const feedParseSpy = jest.spyOn(fakeFeedParserProvider, 'parse');
    const feedPingSpy = jest.spyOn(fakeFeedHealthcheckProvider, 'ping');
    const createSpy = jest.spyOn(fakePodcastRepository, 'create');

    const feedUrl = path.resolve(
      __dirname,
      '..',
      'resources',
      'test-podcast-feed.xml',
    );

    await refreshPodcastService.execute({ feedUrl });

    expect(feedPingSpy).toHaveBeenCalled();
    expect(feedParseSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });

  it('should be able to update a podcast if the feed is not available', async () => {
    const updateSpy = jest.spyOn(fakePodcastRepository, 'save');

    const feedUrl = fakeFeedHealthcheckProvider.INVALID_URL;

    await fakePodcastRepository.create({
      feedUrl,
      description: 'Test',
      imageUrl: '',
      name: 'Testing',
    });

    await expect(
      refreshPodcastService.execute({ feedUrl }),
    ).rejects.toBeInstanceOf(RecoverableError);

    expect(updateSpy).toHaveBeenCalled();
  });

  it("should not be able to create a podcast if the feed address isn't valid", async () => {
    const feedUrl = fakeFeedHealthcheckProvider.INVALID_URL;

    await expect(
      refreshPodcastService.execute({ feedUrl }),
    ).rejects.toBeInstanceOf(RecoverableError);
  });

  it('should be able to update an existing podcast with new episodes', async () => {
    const createSpy = jest.spyOn(fakeEpisodesRepository, 'create');

    // Criar um arquivo temporário para usar como url
    // Alterar o conteúdo desse arquivo temporário de 5 para 10 episodios

    let feedUrl = path.resolve(
      __dirname,
      '..',
      'resources',
      'test-podcast-feed-5-episodes.xml',
    );

    await refreshPodcastService.execute({ feedUrl });

    const podcast = await fakePodcastRepository.findByFeedUrl(feedUrl);

    expect(podcast).toBeTruthy();

    if (podcast) {
      let episodes = await fakeEpisodesRepository.findAllByPodcast(podcast.id);

      expect(episodes).toHaveLength(5);

      feedUrl = path.resolve(
        __dirname,
        '..',
        'resources',
        'test-podcast-feed-10-episodes.xml',
      );

      await refreshPodcastService.execute({ feedUrl });

      episodes = await fakeEpisodesRepository.findAllByPodcast(podcast.id);

      expect(episodes).toHaveLength(10);
      expect(createSpy).toHaveBeenCalledTimes(5);
    }
  });

  /* it('should be able to update an existing episode', async () => {});

  it("should be able to mark an episode as unavailable if it isn't at the feed anymore", async () => {});

  it('should not be able to add an episode is there is no audio file', async () => {});

  it("should be able to format the episode duration to HH:MM:SS if it's in milliseconds", async () => {});

  it("should be able to format the episode duration to HH:MM:SS if it's in H:MM:SS", async () => {});

  it("should be able to format the episode duration to HH:MM:SS if it's in MM:SS", async () => {});

  it("should be able to format the episode duration to HH:MM:SS if it's in M:SS", async () => {}); */
});
