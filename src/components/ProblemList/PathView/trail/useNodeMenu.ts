import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 节点悬浮菜单的开关逻辑：
 * - 悬停打开
 * - 离开后延迟关闭，给鼠标移动到菜单留出时间
 * - 点击空白处关闭
 */
export const useNodeMenu = () => {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearHideTimeout();
    setExpandedNodeId(null);
  }, [clearHideTimeout]);

  const hideMenuWithDelay = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setExpandedNodeId(null);
    }, 300);
  }, [clearHideTimeout]);

  const openMenu = useCallback((problemId: string) => {
    clearHideTimeout();
    setExpandedNodeId(problemId);
  }, [clearHideTimeout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        expandedNodeId &&
        !target.closest('.duolingo-node-wrapper') &&
        !target.closest('.node-context-menu')
      ) {
        setExpandedNodeId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expandedNodeId]);

  useEffect(() => () => clearHideTimeout(), [clearHideTimeout]);

  return {
    expandedNodeId,
    openMenu,
    closeMenu,
    hideMenuWithDelay,
    clearHideTimeout,
  };
};
