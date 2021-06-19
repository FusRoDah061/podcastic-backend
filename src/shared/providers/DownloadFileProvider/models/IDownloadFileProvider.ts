export default interface IDownloadFileProvider {
  download(fileUrl: string): Promise<string | null>;
}
