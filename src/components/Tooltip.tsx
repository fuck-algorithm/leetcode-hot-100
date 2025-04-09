import React, { useState, useRef, ReactNode, useEffect } from 'react';
import './Tooltip.css';
import { useTranslation } from '../i18n/useCustomTranslation';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  // 监听语言变化
  useEffect(() => {
    // 当语言改变时，如果tooltip可见，会使用新的翻译自动刷新
  }, [i18n.language]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div 
      className="tooltip-container" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          className={`tooltip-content tooltip-${position}`}
          ref={tooltipRef}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 