import { useState, useEffect } from 'react';

// 从localStorage获取存储的值，如果不存在则使用默认值
export const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// 使用自定义hook管理localStorage中的状态
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // 使用函数初始化状态，确保只在组件挂载时从localStorage读取一次
  const [value, setValue] = useState<T>(() => getStoredValue(key, initialValue));

  // 当value变化时，更新localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}; 