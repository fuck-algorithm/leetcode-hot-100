import React, { useState } from 'react';
import Tooltip from '../Tooltip';
import './AnimationBadge.css';

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
  const [showPreview, setShowPreview] = useState(false);

  // 当有动画时才显示预览
  const getAnimationPreviewUrl = () => {
    if (!hasAnimation) return null;
    // GIF文件命名采用题目ID，例如：94.gif, 136.gif
    return `${process.env.PUBLIC_URL}/animations/${questionId}.gif`;
  };

  const previewUrl = getAnimationPreviewUrl();

  return (
    <div className="animation-badge-container">
      <Tooltip 
        content={hasAnimation 
          ? t('animationTooltip.hasAnimation') 
          : t('animationTooltip.noAnimation')
        }
      >
        <span 
          className={`animation-badge ${hasAnimation ? 'has-animation' : 'no-animation'}`} 
          onClick={(e) => handleAnimationClick(e, questionId, hasAnimation, title, t)}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
          style={{ cursor: 'pointer' }}
        >
          {hasAnimation ? '🎬' : '🚫'}
        </span>
      </Tooltip>
      
      {/* 动画GIF预览 */}
      {hasAnimation && showPreview && previewUrl && (
        <div className="animation-preview-container">
          <div className="animation-preview-title">{title}</div>
          <img 
            src={previewUrl} 
            alt={`Animation preview for ${title}`} 
            className="animation-preview-gif"
          />
          <div className="animation-preview-tip">{t('animationTooltip.clickToView')}</div>
        </div>
      )}
    </div>
  );
};

export default AnimationBadge; 