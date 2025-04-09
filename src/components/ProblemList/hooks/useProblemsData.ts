import { useState, useEffect } from 'react';
import leetcodeData from '../../../data/leetcode-hot-100.json';
import { Problem, Tag } from '../types';

export const useProblemsData = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  
  // 初始化时加载数据
  useEffect(() => {
    try {
      if (leetcodeData && leetcodeData.data && leetcodeData.data.favoriteQuestionList) {
        // 先将原始数据转换为any类型，然后再添加hasAnimation字段
        const originalProblems = leetcodeData.data.favoriteQuestionList.questions as any[];
        
        // 控制台输出第一个问题的ID格式，帮助调试
        if (originalProblems.length > 0) {
          console.log('问题ID格式示例:', originalProblems[0].questionFrontendId);
          console.log('问题ID类型:', typeof originalProblems[0].questionFrontendId);
        }
        
        // 为每个问题添加默认的hasAnimation字段
        const problemsWithAnimation = originalProblems.map(problem => {
          // 只保留确实有动画的题目ID
          const animationIds = ['94', '136', '160', '283', '461']; // 有动画的题目ID
          
          // 确保ID比较的格式一致，转为字符串并去除可能的前导零
          const normalizedId = String(problem.questionFrontendId).replace(/^0+/, '');
          const hasAnimation = animationIds.includes(normalizedId);
          
          return {
            ...problem,
            hasAnimation: hasAnimation
          };
        }) as Problem[];
        
        // 先设置原始数据
        setProblems(problemsWithAnimation);
        
        // 输出有动画的题目数量，帮助验证
        const animatedProblems = problemsWithAnimation.filter(p => p.hasAnimation);
        console.log('有动画演示的题目数量:', animatedProblems.length);
        console.log('有动画演示的题目ID:', animatedProblems.map(p => p.questionFrontendId));
        
        // 收集所有唯一标签并统计出现次数
        const tagsMap = new Map<string, Tag>();
        problemsWithAnimation.forEach(problem => {
          problem.topicTags.forEach(tag => {
            if (tagsMap.has(tag.slug)) {
              const existingTag = tagsMap.get(tag.slug)!;
              existingTag.count += 1;
            } else {
              tagsMap.set(tag.slug, {
                ...tag,
                count: 1
              });
            }
          });
        });
        
        // 转换为数组并按出现次数排序
        const tagsList = Array.from(tagsMap.values()).sort((a, b) => b.count - a.count);
        setAllTags(tagsList);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
    }
  }, []);  // 只在组件挂载时运行一次

  return { problems, setProblems, allTags };
}; 