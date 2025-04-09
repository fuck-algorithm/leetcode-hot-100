import React from 'react';
import Tooltip from '../Tooltip';
import AnimationBadge from './AnimationBadge';
import ProblemTags from './ProblemTags';
import DifficultyBadge from './DifficultyBadge';
import { Problem } from './types';

// 问题项组件接口
export interface ProblemItemProps {
  problem: Problem;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  handleAnimationClick: (event: React.MouseEvent, questionId: string, hasAnimation: boolean, title?: string, t?: (key: string) => string) => void;
  currentLang: string;
  t: (key: string) => string;
}

const ProblemItem: React.FC<ProblemItemProps> = ({ 
  problem, 
  selectedTags, 
  toggleTag, 
  handleAnimationClick, 
  currentLang,
  t
}) => {
  const title = currentLang === 'zh' ? problem.translatedTitle : problem.title;
  
  return (
    <div className="problem-row">
      <div className="problem-info">
        <Tooltip content={`#${problem.questionFrontendId}`}>
          <span className="problem-id">{problem.questionFrontendId}. </span>
        </Tooltip>
        <Tooltip content={problem.hasAnimation ? title : t('animationTooltip.noAnimation')}>
          <span 
            className="problem-title" 
            onClick={(e) => handleAnimationClick(e, problem.questionFrontendId, problem.hasAnimation, title, t)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </span>
        </Tooltip>
        <AnimationBadge 
          hasAnimation={problem.hasAnimation} 
          questionId={problem.questionFrontendId} 
          title={title}
          handleAnimationClick={handleAnimationClick}
          t={t}
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