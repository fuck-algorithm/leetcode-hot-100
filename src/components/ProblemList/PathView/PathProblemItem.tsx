import React from 'react';
import { Problem } from '../types';
import Tooltip from '../../Tooltip';

interface PathProblemItemProps {
  problem: Problem;
  step: number;
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

const PathProblemItem: React.FC<PathProblemItemProps> = ({
  problem,
  step,
  currentLang,
  t,
  selectedTags,
  toggleTag,
  handleAnimationClick
}) => {
  const title = currentLang === 'zh' ? problem.translatedTitle : problem.title;
  const difficultyClass = problem.difficulty.toLowerCase();
  const difficultyText = t(`difficulties.${difficultyClass}`);

  const handleTitleClick = () => {
    if (problem.hasAnimation && problem.repo?.pagesUrl) {
      window.open(problem.repo.pagesUrl, '_blank');
    } else {
      // 跳转到LeetCode
      window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
    }
  };

  const handleAnimationBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAnimationClick(
      e,
      problem.questionFrontendId,
      problem.hasAnimation,
      title,
      t,
      problem.repo?.pagesUrl
    );
  };

  return (
    <div className={`path-problem-item ${difficultyClass}`}>
      <div className="path-step-indicator">
        <span className="step-number">{step}</span>
        <div className="step-line"></div>
      </div>
      
      <div className="path-problem-content">
        <div className="path-problem-main">
          <span className="path-problem-id">#{problem.questionFrontendId}</span>
          <Tooltip content={t('tooltips.openLeetcode')}>
            <span 
              className={`path-problem-title ${problem.hasAnimation ? 'has-animation' : ''}`}
              onClick={handleTitleClick}
            >
              {title}
            </span>
          </Tooltip>
          
          {/* 动画标记 */}
          <Tooltip 
            content={problem.hasAnimation 
              ? t('animationTooltip.hasAnimation') 
              : t('animationTooltip.noAnimation')}
          >
            <span 
              className={`path-animation-badge ${problem.hasAnimation ? 'has' : 'no'}`}
              onClick={handleAnimationBadgeClick}
            >
              {problem.hasAnimation ? '🎬' : '📝'}
            </span>
          </Tooltip>
        </div>
        
        <div className="path-problem-meta">
          <span className={`path-difficulty-badge ${difficultyClass}`}>
            {difficultyText}
          </span>
          <span className="path-pass-rate">
            {(problem.acRate * 100).toFixed(1)}%
          </span>
          <div className="path-problem-tags">
            {problem.topicTags.slice(0, 3).map(tag => (
              <span 
                key={tag.slug}
                className={`path-tag ${selectedTags.includes(tag.slug) ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTag(tag.slug);
                }}
              >
                {currentLang === 'zh' ? tag.nameTranslated : tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathProblemItem;
