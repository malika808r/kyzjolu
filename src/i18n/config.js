import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { ru } from './ru';
import { ky } from './ky';

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
  ky: { translation: ky },
};

export const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'ru', 'ky'];

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
