export default interface ICreateEpisodeDTO {
  podcastId: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  duration: string;
  url: string;
  mediaType: string;
  sizeBytes: number;
}
