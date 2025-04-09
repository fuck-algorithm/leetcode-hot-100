import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

// 默认语言
const defaultLanguage = 'zh';

// 检测用户上次选择的语言
const savedLanguage = localStorage.getItem('userLanguage');

i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: savedLanguage || defaultLanguage, // 优先使用保存的语言选择，否则使用默认语言
    fallbackLng: 'en', // 当使用的翻译键不存在时，使用的语言
    interpolation: {
      escapeValue: false // 不转义react中的值
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage']
    }
  });

// 保存语言选择到 localStorage
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  localStorage.setItem('userLanguage', language);
};

export default i18n; 