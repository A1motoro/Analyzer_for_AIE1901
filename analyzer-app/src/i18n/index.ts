import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言包
import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(LanguageDetector) // 检测用户语言
  .use(initReactI18next) // 传递 i18n 到 react-i18next
  .init({
    resources,
    fallbackLng: 'zh', // 默认语言
    debug: false, // 生产环境设为 false

    interpolation: {
      escapeValue: false, // React 已经做了转义
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
