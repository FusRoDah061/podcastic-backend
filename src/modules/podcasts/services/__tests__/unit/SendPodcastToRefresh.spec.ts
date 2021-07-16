import 'reflect-metadata';
import FakeMessagingSenderProvider from '../../../../../shared/providers/MessagingSenderProvider/fakes/FakeMessagingSenderProvider';
import FakePodcastRepository from '../../../repositories/fakes/FakePodcastRepository';
import { IPodcast } from '../../../schemas/Podcast';
import SendPodcastToRefreshService from '../../SendPodcastToRefreshService';

describe('SendPodcastToRefresh', () => {
  it('should add a new podcast', async () => {
    const fakePodcastRepository = new FakePodcastRepository();
    const fakeMessagingSenderProvider = new FakeMessagingSenderProvider();

    const sendPodcastToRefreshService = new SendPodcastToRefreshService(
      fakeMessagingSenderProvider,
      fakePodcastRepository,
    );

    const postSpy = jest.spyOn(fakeMessagingSenderProvider, 'post');
    const createPodcastsPromises: Promise<IPodcast>[] = [];

    for (let i = 0; i < 10; i += 1) {
      createPodcastsPromises.push(
        fakePodcastRepository.create({
          name: 'Test podcast',
          description: 'Test podcast',
          feedUrl: 'http://feed.rss',
          imageUrl: 'image',
        }),
      );
    }

    await Promise.all(createPodcastsPromises);

    await sendPodcastToRefreshService.execute();

    expect(postSpy).toHaveBeenCalledTimes(10);
  });
});
