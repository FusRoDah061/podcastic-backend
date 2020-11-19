import IFeed from '../dtos/IFeed';

export default interface IFeedParserProvider {
  parse(feedUrl: string): Promise<IFeed>;
}
