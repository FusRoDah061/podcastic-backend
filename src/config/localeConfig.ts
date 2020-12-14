import path from 'path';

const localeConfig = {
  locales: ['en', 'pt'],
  directory: path.join(__dirname, '..', 'shared', 'locales'),
  defaultLocale: 'en',
};

export default localeConfig;
