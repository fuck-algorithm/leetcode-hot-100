import React, { useState, useRef, useEffect } from 'react';
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
  const [previewPosition, setPreviewPosition] = useState({ top: true, left: '50%', transform: 'translateX(-50%)' });
  const badgeRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 当有动画时才显示预览
  const getAnimationPreviewUrl = () => {
    if (!hasAnimation) return null;
    // GIF文件命名采用题目ID，例如：94.gif, 136.gif
    return `${process.env.PUBLIC_URL}/animations/${questionId}.gif`;
  };

  const previewUrl = getAnimationPreviewUrl();

  // 计算预览位置
  useEffect(() => {
    if (showPreview && badgeRef.current && previewRef.current) {
      const badgeRect = badgeRef.current.getBoundingClientRect();
      const previewRect = previewRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // 检查底部空间是否足够
      const isBottomEnough = badgeRect.bottom + previewRect.height + 20 < windowHeight;
      
      // 检查水平位置，确保不超出左右边界
      let leftPosition = '50%';
      let transformValue = 'translateX(-50%)';
      
      // 如果预览框偏左会超出屏幕
      if (badgeRect.left - previewRect.width / 2 < 10) {
        leftPosition = '0';
        transformValue = 'translateX(0)';
      } 
      // 如果预览框偏右会超出屏幕
      else if (badgeRect.right + previewRect.width / 2 > windowWidth - 10) {
        leftPosition = '100%';
        transformValue = 'translateX(-100%)';
      }

      setPreviewPosition({ 
        top: isBottomEnough, 
        left: leftPosition,
        transform: transformValue
      });
    }
  }, [showPreview]);

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
          ref={badgeRef}
        >
          {hasAnimation ? '🎬' : '🚫'}
        </span>
      </Tooltip>
      
      {/* 动画GIF预览 */}
      {hasAnimation && showPreview && previewUrl && (
        <div 
          className={`animation-preview-container ${previewPosition.top ? 'position-bottom' : 'position-top'}`}
          style={{ 
            left: previewPosition.left, 
            transform: previewPosition.transform 
          }}
          ref={previewRef}
        >
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