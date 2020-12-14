import i18n from 'i18n';
import localeConfig from '../../config/localeConfig';

export default function translate(
  phrase: string,
  locale = localeConfig.defaultLocale,
): string {
  return i18n.__({
    phrase,
    locale,
  });
}
