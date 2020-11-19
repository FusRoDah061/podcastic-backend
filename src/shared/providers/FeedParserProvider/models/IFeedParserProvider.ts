export interface IFeedItem {
  title: string;
  description: string;
  date: Date | null;
  link?: string;
  guid?: string;
  author?: string;
  image: string;
  file: {
    url: string;
    mediaType: string | undefined;
    length: string | undefined;
  };
}

export interface IFeed {
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

export default interface IFeedParserProvider {
  parse(feedUrl: string): Promise<IFeed>;
}
