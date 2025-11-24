import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Enable i18next-http-backend to load translations
  .use(Backend)
  // Enable i18next-browser-languagedetector to detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Define namespaces (we only have 'translation' for now)
    ns: ['translation'],
    defaultNS: 'translation', 
    
    // Fallback language in case a translation is missing
    fallbackLng: 'en',
    
    // Configuration for the http-backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files in the public folder
    },
    
    // Cache language selection
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // React settings
    react: {
      useSuspense: true, // Allows using React.Suspense during loading
    },
    
    // Do not escape values as React already protects against XSS
    interpolation: {
      escapeValue: false, 
    },
    
    //debug: process.env.NODE_ENV === 'development',
  });

export default i18n;