export default interface ICreatePodcastDTO {
  name: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  websiteUrl?: string;
  themeColor?: string;
  textColor?: string;
}
