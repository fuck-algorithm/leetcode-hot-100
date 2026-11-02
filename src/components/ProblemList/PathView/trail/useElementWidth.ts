import { RefObject, useEffect, useState } from 'react';

/**
 * 监听元素宽度，供路径布局做响应式计算。
 * jsdom 等无 ResizeObserver 的环境会自动退化为 window resize 监听。
 */
export const useElementWidth = <T extends HTMLElement>(
  ref: RefObject<T>,
  fallback = 600
): number => {
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const measure = () => {
      const element = ref.current;
      if (!element) return;
      const next = element.clientWidth || element.offsetWidth;
      if (next > 0) {
        setWidth(next);
      }
    };

    measure();

    if (typeof ResizeObserver !== 'undefined' && ref.current) {
      const observer = new ResizeObserver(measure);
      observer.observe(ref.current);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref]);

  return width;
};
