import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import colorPalette from 'get-image-colors';
import getBestContrastColor from 'get-best-contrast-color';
import ColorContrastChecker from 'color-contrast-checker';
import IDownloadFileProvider from '../../../shared/providers/DownloadFileProvider/models/IDownloadFileProvider';

interface IRequest {
  imageUrl: string;
}

interface IResponse {
  themeColor: string;
  textColor: string;
}

const TEXT_COLOR_BLACK = '#000000';
const TEXT_COLOR_WHITE = '#FFFFFF';

@injectable()
export default class FindDominantColorService {
  constructor(
    @inject('DownloadFileProvider')
    private downloadFileProvider: IDownloadFileProvider,
  ) {}

  public async execute({ imageUrl }: IRequest): Promise<IResponse | null> {
    const imageFile = await this.downloadFileProvider.download(imageUrl);

    if (!imageFile) return null;

    const colors = await colorPalette(imageFile.path, {
      type: imageFile.type,
      count: 3,
    });

    fs.unlinkSync(imageFile.path);

    if (colors.length > 0) {
      const colorsStrings = colors.map(color => color.hex());
      const bestContrastWithBlack = getBestContrastColor(
        TEXT_COLOR_BLACK,
        colorsStrings,
      );
      const bestContrastWithWhite = getBestContrastColor(
        TEXT_COLOR_WHITE,
        colorsStrings,
      );

      const ccc = new ColorContrastChecker();

      if (ccc.isLevelAA(TEXT_COLOR_WHITE, bestContrastWithWhite, 14)) {
        return {
          themeColor: bestContrastWithWhite,
          textColor: TEXT_COLOR_WHITE,
        };
      }

      if (ccc.isLevelAA(TEXT_COLOR_BLACK, bestContrastWithBlack, 14)) {
        return {
          themeColor: bestContrastWithBlack,
          textColor: TEXT_COLOR_BLACK,
        };
      }

      return {
        themeColor: bestContrastWithBlack,
        textColor: TEXT_COLOR_BLACK,
      };
    }

    return null;
  }
}
