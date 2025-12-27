import React from 'react';
import Tooltip from '../Tooltip';
import AnimationBadge from './AnimationBadge';
import ProblemTags from './ProblemTags';
import DifficultyBadge from './DifficultyBadge';
import { Problem } from './types';
import './ProblemItem.css';

// 问题项组件接口
export interface ProblemItemProps {
  problem: Problem;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  handleAnimationClick: (event: React.MouseEvent, questionId: string, hasAnimation: boolean, title?: string, t?: (key: string) => string, pagesUrl?: string | null) => void;
  currentLang: string;
  t: (key: string) => string;
  isCompleted?: boolean;
  onToggleCompletion?: (problemId: string) => void;
}

// 获取LeetCode题目详情页URL
const getLeetCodeProblemUrl = (problem: Problem, lang: string): string => {
  const baseUrl = lang === 'zh' ? 'https://leetcode.cn/problems/' : 'https://leetcode.com/problems/';
  return `${baseUrl}${problem.titleSlug}/`;
};

const ProblemItem: React.FC<ProblemItemProps> = ({ 
  problem, 
  selectedTags, 
  toggleTag, 
  handleAnimationClick, 
  currentLang,
  t,
  isCompleted = false,
  onToggleCompletion
}) => {
  const title = currentLang === 'zh' ? problem.translatedTitle : problem.title;
  const pagesUrl = problem.repo?.pagesUrl || null;
  
  // 处理题目序号点击事件
  const handleProblemIdClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const url = getLeetCodeProblemUrl(problem, currentLang);
    window.open(url, '_blank');
  };

  // 处理完成状态切换
  const handleCompletionToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onToggleCompletion) {
      onToggleCompletion(problem.questionFrontendId);
    }
  };
  
  return (
    <div className={`problem-row ${isCompleted ? 'completed' : ''}`}>
      {/* 完成状态复选框 */}
      <div className="problem-completion" onClick={handleCompletionToggle}>
        <Tooltip content={isCompleted ? (currentLang === 'zh' ? '标记为未完成' : 'Mark as incomplete') : (currentLang === 'zh' ? '标记为已完成' : 'Mark as complete')}>
          <div className={`completion-checkbox ${isCompleted ? 'checked' : ''}`}>
            {isCompleted && <span className="checkmark">✓</span>}
          </div>
        </Tooltip>
      </div>
      
      <div className="problem-info">
        <Tooltip content={`${t('tooltips.openLeetcode')}: #${problem.questionFrontendId}`}>
          <span 
            className="problem-id" 
            onClick={handleProblemIdClick}
            style={{ cursor: 'pointer' }}
          >
            {problem.questionFrontendId}. 
          </span>
        </Tooltip>
        <Tooltip content={problem.hasAnimation ? title : t('animationTooltip.noAnimation')}>
          <span 
            className="problem-title" 
            onClick={(e) => handleAnimationClick(e, problem.questionFrontendId, problem.hasAnimation, title, t, pagesUrl)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </span>
        </Tooltip>
        <AnimationBadge 
          hasAnimation={problem.hasAnimation} 
          problemId={problem.questionFrontendId} 
          problemTitle={title}
          animationUrl={pagesUrl || undefined}
          pagesUrl={pagesUrl}
        />
        {problem.topicTags && problem.topicTags.length > 0 && (
          <ProblemTags 
            tags={problem.topicTags} 
            selectedTags={selectedTags} 
            toggleTag={toggleTag}
            currentLang={currentLang}
          />
        )}
      </div>
      
      <div className="problem-stats">
        <Tooltip content={`${(problem.acRate * 100).toFixed(1)}%`}>
          <span className="pass-rate">{(problem.acRate * 100).toFixed(1)}%</span>
        </Tooltip>
        <DifficultyBadge difficulty={problem.difficulty} t={t} />
      </div>
    </div>
  );
};

export default ProblemItem;
