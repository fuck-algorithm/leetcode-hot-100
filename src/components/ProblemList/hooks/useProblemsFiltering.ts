import { useState, useEffect, useCallback } from 'react';
import { Problem, Tag } from '../types';
import { completionStorage, CompletionFilterType } from '../../../services/completionStorage';

export interface UseProblemsFilteringProps {
  problems: Problem[];
  allTags: Tag[];
  currentLang: string;
  isCompleted?: (problemId: string) => boolean;
}

export const useProblemsFiltering = ({ problems, allTags, currentLang, isCompleted }: UseProblemsFilteringProps) => {
  // 从localStorage恢复状态或使用默认值
  const getStoredValue = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const [searchTerm, setSearchTerm] = useState(() => getStoredValue('searchTerm', ''));
  const [selectedTags, setSelectedTags] = useState<string[]>(() => getStoredValue('selectedTags', []));
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAnimationOnly, setShowAnimationOnly] = useState(() => getStoredValue('showAnimationOnly', true));
  
  // 完成状态筛选 - 从IndexedDB加载
  const [completionFilter, setCompletionFilter] = useState<CompletionFilterType>('all');
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

  // 从IndexedDB加载完成状态筛选偏好
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedFilter = await completionStorage.getPreference<CompletionFilterType>('completionFilter', 'all');
        setCompletionFilter(savedFilter);
      } catch (error) {
        console.error('加载筛选偏好失败:', error);
      } finally {
        setIsLoadingPreferences(false);
      }
    };
    loadPreferences();
  }, []);

  // 保存完成状态筛选到IndexedDB
  const handleCompletionFilterChange = useCallback(async (filter: CompletionFilterType) => {
    setCompletionFilter(filter);
    try {
      await completionStorage.setPreference('completionFilter', filter);
    } catch (error) {
      console.error('保存筛选偏好失败:', error);
    }
  }, []);

  // 保存搜索条件到localStorage
  useEffect(() => {
    localStorage.setItem('searchTerm', JSON.stringify(searchTerm));
  }, [searchTerm]);

  // 保存动画筛选状态到localStorage
  useEffect(() => {
    localStorage.setItem('showAnimationOnly', JSON.stringify(showAnimationOnly));
  }, [showAnimationOnly]);

  // 保存选中的标签到localStorage
  useEffect(() => {
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
  }, [selectedTags]);

  // 添加或移除标签筛选
  const toggleTag = (tagSlug: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagSlug)) {
        // 如果标签已被选中，则移除
        return prevTags.filter(tag => tag !== tagSlug);
      } else {
        // 如果标签未被选中，则添加
        return [...prevTags, tagSlug];
      }
    });
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    setSelectedTags([]);
  };

  // 增强型搜索和标签筛选
  const filteredProblems = problems.filter(problem => {
    // 获取当前语言
    const titleToSearch = currentLang === 'zh' ? problem.translatedTitle : problem.title;
    
    // 检查标题搜索匹配
    const titleMatch = titleToSearch.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 检查题目ID搜索匹配
    const idMatch = problem.questionFrontendId.includes(searchTerm);
    
    // 检查标签搜索匹配
    const tagMatch = problem.topicTags.some(tag => {
      const tagName = currentLang === 'zh' ? tag.nameTranslated : tag.name;
      return tagName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    // 文本搜索匹配任一条件即可
    const matchesSearch = searchTerm === '' || titleMatch || idMatch || tagMatch;
    
    // 标签筛选 - 如果没有选中标签则返回所有问题
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tagSlug => 
        problem.topicTags.some(tag => tag.slug === tagSlug)
      );
    
    // 动画筛选 - 如果启用动画筛选，只显示有动画的题目
    const matchesAnimation = showAnimationOnly === false || problem.hasAnimation === true;
    
    // 完成状态筛选
    let matchesCompletion = true;
    if (isCompleted && completionFilter !== 'all') {
      const completed = isCompleted(problem.questionFrontendId);
      if (completionFilter === 'completed') {
        matchesCompletion = completed;
      } else if (completionFilter === 'incomplete') {
        matchesCompletion = !completed;
      }
    }
    
    return matchesSearch && matchesTags && matchesAnimation && matchesCompletion;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    showFilterMenu,
    setShowFilterMenu,
    showAnimationOnly,
    setShowAnimationOnly,
    completionFilter,
    setCompletionFilter: handleCompletionFilterChange,
    isLoadingPreferences,
    toggleTag,
    clearFilters,
    filteredProblems
  };
}; 