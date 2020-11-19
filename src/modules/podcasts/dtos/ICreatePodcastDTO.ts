export default interface ICreatePodcastDTO {
  name: string;
  description: string;
  image_url: string;
  rss_url: string;
  website_url?: string;
}
