import 'reflect-metadata';
import i18n from 'i18n';
import localeConfig from '../../../config/localeConfig';
import AppError from '../../../shared/errors/AppError';

import FakeFeedHealthcheckProvider from '../../../shared/providers/FeedHealthcheckProvider/fakes/FakeFeedHealthcheckProvider';
import FakeMessagingSenderProvider from '../../../shared/providers/MessagingSenderProvider/fakes/FakeMessagingSenderProvider';
import FakePodcastRepository from '../repositories/fakes/FakePodcastRepository';
import AddPodcastService from './AddPodcastService';

let fakePodcastRepository: FakePodcastRepository;
let fakeMessagingSenderProvider: FakeMessagingSenderProvider;
let fakeFeedHealthcheckProvider: FakeFeedHealthcheckProvider;
let addPodcast: AddPodcastService;

describe('AddPodcast', () => {
  beforeAll(() => {
    i18n.configure(localeConfig);
  });

  beforeEach(() => {
    fakePodcastRepository = new FakePodcastRepository();
    fakeMessagingSenderProvider = new FakeMessagingSenderProvider();
    fakeFeedHealthcheckProvider = new FakeFeedHealthcheckProvider();

    addPodcast = new AddPodcastService(
      fakePodcastRepository,
      fakeMessagingSenderProvider,
      fakeFeedHealthcheckProvider,
    );
  });

  it('should add a new podcast', async () => {
    const postSpy = jest.spyOn(fakeMessagingSenderProvider, 'post');
    const pingSpy = jest.spyOn(fakeFeedHealthcheckProvider, 'ping');

    const feedUrl = fakeFeedHealthcheckProvider.VALID_URL;

    await addPodcast.execute({ feedUrl }, 'en');

    expect(pingSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it('should not add a podcast that already exists', async () => {
    const feedUrl = fakeFeedHealthcheckProvider.VALID_URL;

    fakePodcastRepository.create({
      name: 'Test podcast',
      description: 'Test podcast',
      feedUrl,
      imageUrl: 'image',
    });

    await expect(addPodcast.execute({ feedUrl }, 'en')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not add a podcast with an invalid feed url', async () => {
    const feedUrl = fakeFeedHealthcheckProvider.INVALID_URL;

    await expect(addPodcast.execute({ feedUrl }, 'en')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
