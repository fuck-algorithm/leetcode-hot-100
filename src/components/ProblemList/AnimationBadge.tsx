import React from 'react';
import Tooltip from '../Tooltip';

// 动画徽章组件接口
export interface AnimationBadgeProps {
  hasAnimation: boolean;
  questionId: string;
  title: string;
  handleAnimationClick: (event: React.MouseEvent, questionId: string, hasAnimation: boolean, title?: string, t?: (key: string) => string) => void;
  t: (key: string) => string;
}

const AnimationBadge: React.FC<AnimationBadgeProps> = ({ 
  hasAnimation, 
  questionId,
  title,
  handleAnimationClick,
  t
}) => {
  return (
    <Tooltip 
      content={hasAnimation 
        ? t('animationTooltip.hasAnimation') 
        : t('animationTooltip.noAnimation')
      }
    >
      <span 
        className={`animation-badge ${hasAnimation ? 'has-animation' : 'no-animation'}`} 
        onClick={(e) => handleAnimationClick(e, questionId, hasAnimation, title, t)}
        style={{ cursor: 'pointer' }}
      >
        {hasAnimation ? '🎬' : '🚫'}
      </span>
    </Tooltip>
  );
};

export default AnimationBadge; 