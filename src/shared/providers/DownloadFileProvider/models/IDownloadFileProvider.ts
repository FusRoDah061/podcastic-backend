export interface IDownloadedFile {
  path: string;
  type: string;
}

export default interface IDownloadFileProvider {
  download(fileUrl: string): Promise<IDownloadedFile | null>;
}
