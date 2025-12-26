import React from 'react';
import { LearningPath } from '../data/learningPaths';

interface PathStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  hasAnimation: number;
}

interface PathCardProps {
  path: LearningPath;
  stats: PathStats;
  currentLang: string;
  onClick: () => void;
}

const PathCard: React.FC<PathCardProps> = ({
  path,
  stats,
  currentLang,
  onClick
}) => {
  const name = currentLang === 'zh' ? path.name : path.nameEn;
  const description = currentLang === 'zh' ? path.description : path.descriptionEn;
  
  // 计算进度条宽度
  const easyWidth = stats.total > 0 ? (stats.easy / stats.total) * 100 : 0;
  const mediumWidth = stats.total > 0 ? (stats.medium / stats.total) * 100 : 0;
  const hardWidth = stats.total > 0 ? (stats.hard / stats.total) * 100 : 0;

  return (
    <div 
      className="path-card"
      onClick={onClick}
      style={{ '--path-color': path.color } as React.CSSProperties}
    >
      <div className="path-card-header">
        <span className="path-card-icon">{path.icon}</span>
        <h3 className="path-card-name">{name}</h3>
      </div>
      
      <p className="path-card-description">{description}</p>
      
      <div className="path-card-stats">
        <div className="path-stat-item">
          <span className="path-stat-value">{stats.total}</span>
          <span className="path-stat-label">
            {currentLang === 'zh' ? '题目' : 'Problems'}
          </span>
        </div>
        <div className="path-stat-item">
          <span className="path-stat-value path-stat-animation">{stats.hasAnimation}</span>
          <span className="path-stat-label">
            {currentLang === 'zh' ? '动画' : 'Animations'}
          </span>
        </div>
      </div>
      
      <div className="path-difficulty-bar">
        <div 
          className="difficulty-segment easy" 
          style={{ width: `${easyWidth}%` }}
          title={`${currentLang === 'zh' ? '简单' : 'Easy'}: ${stats.easy}`}
        />
        <div 
          className="difficulty-segment medium" 
          style={{ width: `${mediumWidth}%` }}
          title={`${currentLang === 'zh' ? '中等' : 'Medium'}: ${stats.medium}`}
        />
        <div 
          className="difficulty-segment hard" 
          style={{ width: `${hardWidth}%` }}
          title={`${currentLang === 'zh' ? '困难' : 'Hard'}: ${stats.hard}`}
        />
      </div>
      
      <div className="path-difficulty-legend">
        <span className="legend-item">
          <span className="legend-dot easy"></span>
          {stats.easy}
        </span>
        <span className="legend-item">
          <span className="legend-dot medium"></span>
          {stats.medium}
        </span>
        <span className="legend-item">
          <span className="legend-dot hard"></span>
          {stats.hard}
        </span>
      </div>
      
      <div className="path-card-arrow">→</div>
    </div>
  );
};

export default PathCard;
