import { useState, useEffect } from 'react';
import leetcodeData from '../../../data/leetcode-hot-100.json';
import { Problem, Tag } from '../types';

// 支持的动画文件格式
const VIDEO_FORMATS = ['mp4', 'webm', 'mov'];
const IMAGE_FORMATS = ['gif', 'png', 'jpg', 'jpeg'];

// 检测视频文件是否存在
const checkVideoExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => resolve(true);
    video.onerror = () => resolve(false);
    video.src = url;
  });
};

// 检测图片文件是否存在
const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// 检测动画文件是否存在
const checkAnimationExists = async (problemId: string): Promise<boolean> => {
  const baseUrl = window.location.origin;
  const basePath = process.env.PUBLIC_URL || '';
  
  // 先检测视频格式
  for (const format of VIDEO_FORMATS) {
    const url = `${baseUrl}${basePath}/animations/${problemId}.${format}`;
    if (await checkVideoExists(url)) {
      return true;
    }
  }
  
  // 再检测图片格式
  for (const format of IMAGE_FORMATS) {
    const url = `${baseUrl}${basePath}/animations/${problemId}.${format}`;
    if (await checkImageExists(url)) {
      return true;
    }
  }
  
  return false;
};

export const useProblemsData = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  
  // 初始化时加载数据
  useEffect(() => {
    const loadProblems = async () => {
      try {
        if (leetcodeData && leetcodeData.data && leetcodeData.data.favoriteQuestionList) {
          const originalProblems = leetcodeData.data.favoriteQuestionList.questions as any[];
          
          // 并行检测所有题目的动画文件
          const animationChecks = await Promise.all(
            originalProblems.map(problem => 
              checkAnimationExists(String(problem.questionFrontendId).replace(/^0+/, ''))
            )
          );
          
          // 为每个问题添加hasAnimation字段
          const problemsWithAnimation = originalProblems.map((problem, index) => ({
            ...problem,
            hasAnimation: animationChecks[index]
          })) as Problem[];
        
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
    };
    
    loadProblems();
  }, []);

  return { problems, setProblems, allTags };
}; 