// 节点点击行为设置工具
// 存储键名: path_node_click_behavior

export type NodeClickBehavior = 'animation' | 'leetcode' | 'none';

const STORAGE_KEY = 'path_node_click_behavior';

export interface ClickBehaviorSettings {
  behavior: NodeClickBehavior;
}

/**
 * 获取当前设置的点击行为
 * 默认返回 'animation'
 */
export const getClickBehavior = (): NodeClickBehavior => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ClickBehaviorSettings;
      if (parsed.behavior && ['animation', 'leetcode', 'none'].includes(parsed.behavior)) {
        return parsed.behavior;
      }
    }
  } catch (error) {
    console.error('Failed to load click behavior setting:', error);
  }
  return 'animation'; // 默认行为
};

/**
 * 保存点击行为设置
 */
export const setClickBehavior = (behavior: NodeClickBehavior): void => {
  try {
    const settings: ClickBehaviorSettings = { behavior };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save click behavior setting:', error);
  }
};

/**
 * 获取点击行为对应的目标 URL
 */
export const getClickTargetUrl = (
  behavior: NodeClickBehavior,
  problem: {
    hasAnimation: boolean;
    repo?: { pagesUrl?: string | null };
    titleSlug: string;
  }
): string | null => {
  switch (behavior) {
    case 'animation':
      if (problem.hasAnimation && problem.repo?.pagesUrl) {
        return problem.repo.pagesUrl;
      }
      // 如果没有动画，回退到 LeetCode
      return `https://leetcode.cn/problems/${problem.titleSlug}/`;

    case 'leetcode':
      return `https://leetcode.cn/problems/${problem.titleSlug}/`;

    case 'none':
    default:
      return null;
  }
};

/**
 * 处理节点点击事件
 */
export const handleNodeClickWithBehavior = (
  behavior: NodeClickBehavior,
  problem: {
    hasAnimation: boolean;
    repo?: { pagesUrl?: string | null };
    titleSlug: string;
  }
): boolean => {
  const url = getClickTargetUrl(behavior, problem);
  
  if (url) {
    window.open(url, '_blank');
    return true; // 已处理点击
  }
  
  return false; // 无动作，不跳转
};
