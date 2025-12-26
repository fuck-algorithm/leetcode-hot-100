import React, { useState, useMemo } from 'react';
import { Problem } from '../types';
import { learningPaths, getDifficultyWeight } from '../data/learningPaths';
import PathCard from './PathCard';
import PathDetail from './PathDetail';
import './PathView.css';

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
}

const PathView: React.FC<PathViewProps> = ({
  problems,
  currentLang,
  t,
  selectedTags,
  toggleTag,
  handleAnimationClick
}) => {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

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

  const handlePathClick = (pathId: string) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  const handleBackToOverview = () => {
    setExpandedPath(null);
  };

  // 如果选中了某个路径，显示详情视图
  if (expandedPath) {
    const selectedPathData = pathsWithProblems.find(item => item.path.id === expandedPath);
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
          onBack={handleBackToOverview}
        />
      );
    }
  }

  // 显示路径概览
  return (
    <div className="path-view-container">
      <div className="path-view-header">
        <h2 className="path-view-title">
          {currentLang === 'zh' ? '🛤️ 学习路径' : '🛤️ Learning Paths'}
        </h2>
        <p className="path-view-subtitle">
          {currentLang === 'zh' 
            ? '按算法类型分类，从简单到困难循序渐进' 
            : 'Organized by algorithm type, from easy to hard'}
        </p>
      </div>
      
      <div className="path-cards-grid">
        {pathsWithProblems.map(({ path, problems: pathProblems, stats }) => (
          <PathCard
            key={path.id}
            path={path}
            stats={stats}
            currentLang={currentLang}
            onClick={() => handlePathClick(path.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PathView;
