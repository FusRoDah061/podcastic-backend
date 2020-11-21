export default interface IFindWithEspisodesDTO {
  podcastId: string;
  sort?: string | 'newest' | 'oldest' | 'longest' | 'shortest';
  episodeNameToSearch?: string;
}
