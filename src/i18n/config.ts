import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import ptBRTranslations from './pt-BR.json';
import esTranslations from './es.json';

const resources = {
  en: { translation: enTranslations },
  'pt-BR': { translation: ptBRTranslations },
  es: { translation: esTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
