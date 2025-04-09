import { useTranslation as useOriginalTranslation } from 'react-i18next';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

const translations = {
  en: enTranslation,
  zh: zhTranslation
};

// 创建一个访问翻译的辅助函数
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      return path; // 如果找不到翻译，返回路径本身
    }
    current = current[key];
  }
  
  return current;
};

export function useTranslation() {
  const { i18n } = useOriginalTranslation();
  const currentLanguage = i18n.language || 'zh';
  
  // 创建一个不使用i18n.t的翻译函数
  const t = (key: string): string => {
    const translationObj = translations[currentLanguage as 'en' | 'zh'];
    return getNestedTranslation(translationObj, key);
  };
  
  return { t, i18n };
} 