import React from 'react';

// 获取题目对应的动画演示网站URL
export const getAnimationUrl = (questionId: string): string => {
  // 根据题目ID选择正确的URL
  switch(questionId) {
    case '94':
      return 'https://fuck-algorithm.github.io/leetcode-94-binary-tree-inorder-traversal/';
    case '136':
      return 'https://fuck-algorithm.github.io/leetcode-136-single-number/';
    case '160':
      return 'https://fuck-algorithm.github.io/leetcode-160-intersection-of-two-linked-lists/';
    case '283':
      return 'https://fuck-algorithm.github.io/leetcode-283-move-zeroes/';
    case '461':
      return 'https://fuck-algorithm.github.io/leetcode-461-hamming-distance/';
    default:
      return `https://leetcode-animation-demo.example.com/problem/${questionId}`;
  }
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

// 判断题目是否有动画演示
export const hasAnimation = (questionId: string): boolean => {
  const animationIds = ['94', '136', '160', '283', '461']; // 有动画的题目ID
  const normalizedId = String(questionId).replace(/^0+/, '');
  return animationIds.includes(normalizedId);
}; 