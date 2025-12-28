import React, { useState } from 'react';
import { Problem } from '../types';
import { LearningPath } from '../data/learningPaths';
import DuolingoPath from './DuolingoPath';

interface PathStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  hasAnimation: number;
}

interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

interface PathDetailProps {
  path: LearningPath;
  problems: Problem[];
  stats: PathStats;
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
  onBack: () => void;
  isCompleted: (problemId: string) => boolean;
  onToggleCompletion: (problemId: string) => Promise<void>;
  getStatsForProblems: (problemIds: string[]) => CompletionStats;
}

const PathDetail: React.FC<PathDetailProps> = ({
  path,
  problems,
  stats,
  currentLang,
  t,
  selectedTags,
  toggleTag,
  handleAnimationClick,
  onBack,
  isCompleted,
  onToggleCompletion,
  getStatsForProblems
}) => {
  const name = currentLang === 'zh' ? path.name : path.nameEn;
  const description = currentLang === 'zh' ? path.description : path.descriptionEn;
  
  // 难度筛选状态
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  
  // 根据筛选条件过滤题目
  const filteredProblems = problems.filter(p => {
    if (difficultyFilter === 'all') return true;
    return p.difficulty.toLowerCase() === difficultyFilter;
  });

  // 获取完成统计
  const completionStats = getStatsForProblems(problems.map(p => p.questionFrontendId));

  return (
    <div className="path-detail-container">
      <button className="path-back-btn" onClick={onBack}>
        ← {currentLang === 'zh' ? '返回路径概览' : 'Back to Overview'}
      </button>
      
      <div className="path-detail-header" style={{ '--path-color': path.color } as React.CSSProperties}>
        <div className="path-detail-icon">{path.icon}</div>
        <div className="path-detail-info">
          <h2 className="path-detail-name">{name}</h2>
          <p className="path-detail-description">{description}</p>
        </div>
        <div className="path-detail-stats">
          <div className="detail-stat">
            <span className="detail-stat-value">{completionStats.completed}/{stats.total}</span>
            <span className="detail-stat-label">
              {currentLang === 'zh' ? '已完成' : 'Completed'}
            </span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-value animation-stat">{stats.hasAnimation}</span>
            <span className="detail-stat-label">
              {currentLang === 'zh' ? '有动画' : 'Animated'}
            </span>
          </div>
        </div>
      </div>

      {/* 难度筛选器 */}
      <div className="path-difficulty-filter">
        <span className="filter-label">
          {currentLang === 'zh' ? '难度筛选：' : 'Filter by difficulty:'}
        </span>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${difficultyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('all')}
          >
            {currentLang === 'zh' ? '全部' : 'All'} ({stats.total})
          </button>
          <button 
            className={`filter-btn easy ${difficultyFilter === 'easy' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('easy')}
          >
            {currentLang === 'zh' ? '简单' : 'Easy'} ({stats.easy})
          </button>
          <button 
            className={`filter-btn medium ${difficultyFilter === 'medium' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('medium')}
          >
            {currentLang === 'zh' ? '中等' : 'Medium'} ({stats.medium})
          </button>
          <button 
            className={`filter-btn hard ${difficultyFilter === 'hard' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('hard')}
          >
            {currentLang === 'zh' ? '困难' : 'Hard'} ({stats.hard})
          </button>
        </div>
      </div>

      {/* 路径说明 */}
      <div className="path-instruction">
        <span className="instruction-icon">💡</span>
        <span className="instruction-text">
          {currentLang === 'zh' 
            ? '点击节点查看题目详情，双击标记完成状态，带 🎬 标记的题目有动画演示' 
            : 'Click nodes to view details, double-click to mark completion. Nodes with 🎬 have animations'}
        </span>
      </div>

      {/* 多邻国风格路径 */}
      <DuolingoPath
        problems={filteredProblems}
        currentLang={currentLang}
        t={t}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        handleAnimationClick={handleAnimationClick}
        isCompleted={isCompleted}
        onToggleCompletion={onToggleCompletion}
        pathId={path.id}
      />
    </div>
  );
};

export default PathDetail;
