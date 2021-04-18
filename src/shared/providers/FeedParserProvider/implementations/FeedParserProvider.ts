import Axios from 'axios';
import FeedParser, { Item } from 'feedparser';
import { ReadStream } from 'fs';
import { promisify } from 'util';
import IFeed from '../dtos/IFeed';
import IFeedItem from '../dtos/IFeedItem';
import IFeedParserProvider from '../models/IFeedParserProvider';

export type Callback<T> = (err: Error | null, result: T) => void;

interface IFeedParserItem extends Item {
  [propName: string]: any;
}

export default class FeedParserProvider implements IFeedParserProvider {
  public async parse(feedUrl: string): Promise<IFeed> {
    try {
      const response = await Axios.get(feedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
          Accept:
            'text/html,text/xml,application/xml,application/rss+xml,application/xhtml+xml',
        },
        responseType: 'stream',
      });

      if (response.status !== 200) {
        throw new Error(`Bad status code: ${response.status}`);
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
            let feedItem = parser.read() as IFeedParserItem;

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
                xmlUrl: feedItem.meta.xmlurl ?? feedurl,
                items: [],
              };
            }

            do {
              if (feedItem) {
                const itunesDuration = feedItem['itunes:duration']
                  ? feedItem['itunes:duration']['#']
                  : '';

                const item: IFeedItem = {
                  title: feedItem.title,
                  description: feedItem.description,
                  image: feedItem.image.url,
                  date: feedItem.pubdate ?? feedItem.date,
                  author: feedItem.author,
                  guid: feedItem.guid,
                  link: feedItem.link ?? feedItem.origlink,
                  itunesDuration,
                  files: feedItem.enclosures.map(enclosure => {
                    return {
                      url: enclosure.url,
                      mediaType: enclosure.type,
                      length: enclosure.length,
                    };
                  }),
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
      throw new Error("Couldn't reach feed");
    }
  }
}
