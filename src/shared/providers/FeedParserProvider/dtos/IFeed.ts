import IFeedItem from './IFeedItem';

export default interface IFeed {
  name: string;
  description: string;
  link: string;
  author: string;
  language?: string;
  copyright?: string;
  image: string;
  categories?: Array<string>;
  latestUpdate: Date | null;
  xmlUrl: string;
  items: Array<IFeedItem>;
}
