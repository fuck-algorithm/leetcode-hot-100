import React from 'react';

// 题目ID到slug的映射（用于生成演示站点URL）
const problemSlugMap: Record<string, string> = {
  '46': 'permutations',
  '94': 'binary-tree-inorder-traversal',
  '136': 'single-number',
  '160': 'intersection-of-two-linked-lists',
  '283': 'move-zeroes',
  '461': 'hamming-distance',
};

// 获取题目对应的动画演示网站URL
export const getAnimationUrl = (questionId: string): string => {
  const slug = problemSlugMap[questionId];
  if (slug) {
    return `https://fuck-algorithm.github.io/leetcode-${questionId}-${slug}/`;
  }
  // 默认返回一个通用格式的URL
  return `https://fuck-algorithm.github.io/leetcode-${questionId}-problem/`;
};

// 创建GitHub issue的URL
export const getIssueUrl = (questionId: string, title: string, t: (key: string) => string): string => {
  // 使用国际化文本格式化issue标题
  const issueTemplate = t('issueTitle.requestAnimation');
  const issueTitle = issueTemplate
    .replace('{{id}}', questionId)
    .replace('{{title}}', title);
    
  const encodedTitle = encodeURIComponent(issueTitle);
  return `https://github.com/fuck-algorithm/leetcode-hot-100/issues/new?title=${encodedTitle}`;
};

// 处理动画点击事件
export const handleAnimationClick = (
  event: React.MouseEvent, 
  questionId: string, 
  hasAnimation: boolean,
  title?: string,
  t?: (key: string) => string
): void => {
  event.stopPropagation();
  
  if (hasAnimation) {
    // 有动画，跳转到动画演示页面
    const demoUrl = getAnimationUrl(questionId);
    window.open(demoUrl, '_blank');
  } else if (title && t) {
    // 无动画，跳转到GitHub创建issue
    const issueUrl = getIssueUrl(questionId, title, t);
    window.open(issueUrl, '_blank');
  }
};

// 支持的动画文件格式
const ANIMATION_FORMATS = ['mp4', 'webm', 'mov', 'gif', 'png', 'jpg', 'jpeg'];

// 动态检测题目是否有动画演示
export const checkAnimationExists = async (questionId: string): Promise<boolean> => {
  const baseUrl = window.location.origin;
  const basePath = process.env.PUBLIC_URL || '';
  const normalizedId = String(questionId).replace(/^0+/, '');
  
  for (const format of ANIMATION_FORMATS) {
    const url = `${baseUrl}${basePath}/animations/${normalizedId}.${format}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return true;
      }
    } catch {
      // 忽略错误，继续检查下一个格式
    }
  }
  return false;
}; 