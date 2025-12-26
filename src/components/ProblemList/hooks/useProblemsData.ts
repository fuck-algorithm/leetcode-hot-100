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
        const originalProblems = leetcodeData.data.favoriteQuestionList.questions as any[];
        
        // 直接使用数据中的 hasAnimation 字段（根据仓库是否公开判断）
        const problemsWithAnimation = originalProblems.map((problem) => {
          return {
            ...problem,
            // hasAnimation 已经在数据中设置好了（根据仓库是否公开）
            hasAnimation: problem.hasAnimation === true
          };
        }) as Problem[];
      
        // 设置数据
        setProblems(problemsWithAnimation);
        
        // 输出有动画的题目数量
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
  }, []);

  return { problems, setProblems, allTags };
};
