import fs, { ReadStream } from 'fs';
import FeedParser, { Item } from 'feedparser';

import { promisify } from 'util';
import IFeed from '../dtos/IFeed';
import IFeedItem from '../dtos/IFeedItem';
import IFeedParserProvider from '../models/IFeedParserProvider';

export type Callback<T> = (err: Error | null, result: T) => void;

interface IFeedParserItem extends Item {
  [propName: string]: any;
}

export default class FakeFeedParserProvider implements IFeedParserProvider {
  public async parse(xmlPath: string): Promise<IFeed> {
    try {
      const readStream = fs.createReadStream(xmlPath, {
        autoClose: true,
        encoding: 'utf-8',
      });

      return promisify(
        (filePath: string, stream: ReadStream, callback: Callback<IFeed>) => {
          const parser = new FeedParser({ feedurl: filePath });
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
                xmlUrl: feedItem.meta.xmlurl ?? xmlPath,
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
      ).call(this, xmlPath, readStream);
    } catch (err) {
      throw new Error("Couldn't reach feed");
    }
  }
}
