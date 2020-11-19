import Axios from 'axios';
import FeedParser from 'feedparser';
import { ReadStream } from 'fs';
import { promisify } from 'util';
import AppError from '../../../errors/AppError';
import IFeedParserProvider, {
  IFeed,
  IFeedItem,
} from '../models/IFeedParserProvider';

export type Callback<T> = (err: Error | null, result: T) => void;

export default class FeedParserProvider implements IFeedParserProvider {
  public async parse(feedUrl: string): Promise<IFeed> {
    try {
      const response = await Axios.get(feedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
        responseType: 'stream',
      });

      if (response.status !== 200) {
        throw new AppError('Bad status code');
      }

      return promisify(
        (feedurl: string, stream: ReadStream, callback: Callback<IFeed>) => {
          const parser = new FeedParser({ feedurl });
          let feedContent: IFeed;

          parser.on('error', (err: Error) => {
            console.log('Error reading feed.');
            callback(err, feedContent);
          });

          parser.on('end', () => {
            console.log('Finished reading feed.');
            callback(null, feedContent);
          });

          parser.on('readable', () => {
            let feedItem = parser.read();

            if (!feedContent) {
              feedContent = {
                name: feedItem.meta.title,
                author: feedItem.meta.author,
                description: feedItem.meta.description,
                image: feedItem.meta.image.url,
                link: feedItem.meta.link,
                categories: feedItem.meta.categories,
                copyright: feedItem.meta.copyright,
                language: feedItem.meta.language,
                latestUpdate: feedItem.meta.date,
                xmlUrl: feedItem.meta.xmlurl || feedurl,
                items: [],
              };
            }

            do {
              if (feedItem) {
                const item: IFeedItem = {
                  title: feedItem.title,
                  description: feedItem.description,
                  image: feedItem.image.url,
                  date: feedItem.pubdate || feedItem.date,
                  author: feedItem.author,
                  guid: feedItem.guid,
                  link: feedItem.link || feedItem.origlink,
                  file: {
                    url: feedItem.enclosures[0].url,
                    mediaType: feedItem.enclosures[0].type,
                    length: feedItem.enclosures[0].length,
                  },
                };

                feedContent.items.push(item);
              }

              feedItem = parser.read();
            } while (feedItem);
          });

          stream.pipe(parser);
        },
      ).call(this, feedUrl, response.data);
    } catch (err) {
      throw new AppError("Couldn't reach feed");
    }
  }
}
