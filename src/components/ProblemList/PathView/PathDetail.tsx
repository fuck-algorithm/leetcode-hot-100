import React, { useState } from 'react';
import { Problem } from '../types';
import { LearningPath } from '../data/learningPaths';
import DuolingoPath from './DuolingoPath';
import ConfirmDialog from '../ConfirmDialog';
import Tooltip from '../../Tooltip';
import { PathIcon } from './PathIcons/index';
import './PathDetail.css';

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

// 题目信息，用于重置时计算经验值
interface ProblemInfo {
  problemId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
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
  onResetPathProgress?: (pathId: string, problems: ProblemInfo[]) => Promise<void>;
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
  getStatsForProblems,
  onResetPathProgress
}) => {
  const name = currentLang === 'zh' ? path.name : path.nameEn;
  const description = currentLang === 'zh' ? path.description : path.descriptionEn;
  
  // 难度筛选状态
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  
  // 重置确认对话框状态
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // 根据筛选条件过滤题目
  const filteredProblems = problems.filter(p => {
    if (difficultyFilter === 'all') return true;
    return p.difficulty.toLowerCase() === difficultyFilter;
  });

  // 获取完成统计
  const completionStats = getStatsForProblems(problems.map(p => p.questionFrontendId));

  // 处理重置路径进度
  const handleResetPathProgress = async () => {
    if (!onResetPathProgress) return;
    
    setIsResetting(true);
    try {
      const problemInfos: ProblemInfo[] = problems.map(p => ({
        problemId: p.questionFrontendId,
        difficulty: p.difficulty.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD'
      }));
      
      await onResetPathProgress(path.id, problemInfos);
      setShowResetDialog(false);
    } catch (error) {
      console.error('重置路径进度失败:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="path-detail-container">
      {/* 简洁的 Banner 区域 */}
      <div className="path-detail-banner" style={{ '--path-color': path.color } as React.CSSProperties}>
        {/* 顶部操作栏 */}
        <div className="banner-top-row">
          <button className="path-back-btn" onClick={onBack}>
            ← {currentLang === 'zh' ? '返回' : 'Back'}
          </button>
          
          {onResetPathProgress && completionStats.completed > 0 && (
            <Tooltip content={t('resetPathProgress.tooltip')}>
              <button 
                className="path-reset-btn" 
                onClick={() => setShowResetDialog(true)}
                disabled={isResetting}
              >
                <svg className="reset-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </Tooltip>
          )}
        </div>

        {/* 主要信息区 */}
        <div className="banner-main">
          <div className="banner-left">
            <div className="path-detail-icon">
              <PathIcon pathId={path.id} size={40} color={path.color} fallback={path.icon} />
            </div>
            <div className="path-detail-info">
              <h2 className="path-detail-name">{name}</h2>
              <p className="path-detail-description">{description}</p>
            </div>
          </div>
          
          <div className="banner-right">
            <div className="completion-display">
              <span className="completion-current">{completionStats.completed}</span>
              <span className="completion-separator">/</span>
              <span className="completion-total">{stats.total}</span>
            </div>
            <span className="completion-label">{currentLang === 'zh' ? '已完成' : 'Completed'}</span>
            {stats.hasAnimation > 0 && (
              <span className="animation-count">🎬 {stats.hasAnimation}</span>
            )}
          </div>
        </div>

        {/* 难度筛选 */}
        <div className="banner-filter">
          <button 
            className={`filter-chip ${difficultyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('all')}
          >
            {currentLang === 'zh' ? '全部' : 'All'} ({stats.total})
          </button>
          {stats.easy > 0 && (
            <button 
              className={`filter-chip easy ${difficultyFilter === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('easy')}
            >
              {currentLang === 'zh' ? '简单' : 'Easy'} ({stats.easy})
            </button>
          )}
          {stats.medium > 0 && (
            <button 
              className={`filter-chip medium ${difficultyFilter === 'medium' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('medium')}
            >
              {currentLang === 'zh' ? '中等' : 'Medium'} ({stats.medium})
            </button>
          )}
          {stats.hard > 0 && (
            <button 
              className={`filter-chip hard ${difficultyFilter === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('hard')}
            >
              {currentLang === 'zh' ? '困难' : 'Hard'} ({stats.hard})
            </button>
          )}
        </div>
      </div>

      {/* 多邻国风格路径 */}
      <DuolingoPath
        problems={filteredProblems}
        allProblems={problems}
        currentLang={currentLang}
        t={t}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        handleAnimationClick={handleAnimationClick}
        isCompleted={isCompleted}
        onToggleCompletion={onToggleCompletion}
        pathId={path.id}
      />

      {/* 重置确认对话框 */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title={t('resetPathProgress.title')}
        message={t('resetPathProgress.message')}
        confirmText={t('resetPathProgress.confirm')}
        cancelText={t('resetPathProgress.cancel')}
        onConfirm={handleResetPathProgress}
        onCancel={() => setShowResetDialog(false)}
        danger
      />
    </div>
  );
};

export default PathDetail;
