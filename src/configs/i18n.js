import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from  '../translations/en/translation.json'
import esTranslation from  '../translations/es/translation.json'
import { initReactI18next } from 'react-i18next';

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
    },
    debug: false
  })
  i18n.addResourceBundle('en', 'translation', enTranslation)
  i18n.addResourceBundle('es', 'translation', esTranslation)

export default i18n;