export default interface IFeedItem {
  title: string;
  description: string;
  date: Date | null;
  link?: string;
  guid?: string;
  author?: string;
  image: string;
  files: Array<{
    url: string;
    mediaType: string | undefined;
    length: string | undefined;
  }>;
}
