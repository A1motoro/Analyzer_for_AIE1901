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
    fallbackLng: 'zh', // 默认语言为中文
    lng: 'zh', // 明确设置初始语言为中文
    debug: false, // 开发环境可设为 true 以调试

    interpolation: {
      escapeValue: false, // React 已经做了转义
      skipOnVariables: false, // 确保变量插值正常工作
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      // 确保检测功能正确工作
      checkWhitelist: true,
    },
    whitelist: ['en', 'zh'], // 支持的语言列表
    load: 'languageOnly', // 只加载语言代码部分，不包含地区代码
  });

export default i18n;
