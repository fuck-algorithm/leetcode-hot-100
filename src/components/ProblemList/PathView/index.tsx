import React, { useMemo } from 'react';
import { Problem } from '../types';
import { learningPaths, getDifficultyWeight } from '../data/learningPaths';
import PathOverview from './PathOverview';
import PathDetail from './PathDetail';
import './PathView.css';
import './PathOverview.css';

interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

interface PathViewProps {
  problems: Problem[];
  currentLang: string;
  t: (key: string) => string;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  handleAnimationClick: (
    event: React.MouseEvent, 
    questionId: string, 
    hasAnimation: boolean,
    title?: string,
    t?: (key: string) => string,
    pagesUrl?: string | null
  ) => void;
  isCompleted: (problemId: string) => boolean;
  onToggleCompletion: (problemId: string) => Promise<void>;
  getStatsForProblems: (problemIds: string[]) => CompletionStats;
  // 新增：路由相关props
  selectedPathId?: string;
  onPathClick: (pathId: string) => void;
  onBackToOverview: () => void;
}

const PathView: React.FC<PathViewProps> = ({
  problems,
  currentLang,
  t,
  selectedTags,
  toggleTag,
  handleAnimationClick,
  isCompleted,
  onToggleCompletion,
  getStatsForProblems,
  selectedPathId,
  onPathClick,
  onBackToOverview
}) => {
  // 按学习路径分组题目
  const pathsWithProblems = useMemo(() => {
    return learningPaths.map(path => {
      // 筛选属于该路径的题目
      const pathProblems = problems.filter(problem => 
        problem.category && path.categories.includes(problem.category)
      );
      
      // 按难度排序
      const sortedProblems = [...pathProblems].sort((a, b) => {
        const weightA = getDifficultyWeight(a.difficulty);
        const weightB = getDifficultyWeight(b.difficulty);
        if (weightA !== weightB) return weightA - weightB;
        // 同难度按题号排序
        return parseInt(a.questionFrontendId) - parseInt(b.questionFrontendId);
      });

      // 统计各难度数量
      const stats = {
        total: sortedProblems.length,
        easy: sortedProblems.filter(p => p.difficulty === 'EASY').length,
        medium: sortedProblems.filter(p => p.difficulty === 'MEDIUM').length,
        hard: sortedProblems.filter(p => p.difficulty === 'HARD').length,
        hasAnimation: sortedProblems.filter(p => p.hasAnimation).length
      };

      return {
        path,
        problems: sortedProblems,
        stats
      };
    }).filter(item => item.problems.length > 0); // 只显示有题目的路径
  }, [problems]);

  // 如果URL中有路径ID，显示详情视图
  if (selectedPathId) {
    const selectedPathData = pathsWithProblems.find(item => item.path.id === selectedPathId);
    if (selectedPathData) {
      return (
        <PathDetail
          path={selectedPathData.path}
          problems={selectedPathData.problems}
          stats={selectedPathData.stats}
          currentLang={currentLang}
          t={t}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          handleAnimationClick={handleAnimationClick}
          onBack={onBackToOverview}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
          getStatsForProblems={getStatsForProblems}
        />
      );
    }
  }

  // 显示路径概览 - 多邻国风格
  return (
    <PathOverview
      pathsWithProblems={pathsWithProblems}
      currentLang={currentLang}
      onPathClick={onPathClick}
      isCompleted={isCompleted}
      getStatsForProblems={getStatsForProblems}
    />
  );
};

export default PathView;
