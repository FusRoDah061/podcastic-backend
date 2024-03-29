import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import getBestContrastColor from 'get-best-contrast-color';
import ColorContrastChecker from 'color-contrast-checker';
import Vibrant from 'node-vibrant';
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

    const pallete = await Vibrant.from(imageFile.path).getPalette();

    const colors = [
      pallete.DarkVibrant?.hex.toUpperCase(),
      pallete.LightVibrant?.hex.toUpperCase(),
      pallete.Vibrant?.hex.toUpperCase(),
    ];

    try {
      fs.unlinkSync(imageFile.path);
    } catch (err) {
      console.warn(`Could not delete downloaded file "${imageFile.path}"`);
    }

    if (colors.length > 0) {
      const bestContrastWithBlack = getBestContrastColor(
        TEXT_COLOR_BLACK,
        colors,
      );
      const bestContrastWithWhite = getBestContrastColor(
        TEXT_COLOR_WHITE,
        colors,
      );

      const colorContrastChecker = new ColorContrastChecker();

      if (
        colorContrastChecker.isLevelAA(
          TEXT_COLOR_WHITE,
          bestContrastWithWhite,
          14,
        )
      ) {
        return {
          themeColor: bestContrastWithWhite,
          textColor: TEXT_COLOR_WHITE,
        };
      }

      if (
        colorContrastChecker.isLevelAA(
          TEXT_COLOR_BLACK,
          bestContrastWithBlack,
          14,
        )
      ) {
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
