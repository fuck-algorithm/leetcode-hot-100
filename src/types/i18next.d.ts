import { TFunction } from 'i18next';

// 扩展全局命名空间来解决t函数的类型问题
declare module 'react-i18next' {
  export function useTranslation(): {
    t: TFunction;
    i18n: {
      language: string;
      changeLanguage: (lng: string) => Promise<TFunction>;
    };
  };
} 