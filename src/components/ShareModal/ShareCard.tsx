import React, { forwardRef } from 'react';
import './ShareCard.css';

interface ShareCardProps {
  currentLang: string;
  totalExp: number;
  currentRealm: {
    name: string;
    nameEn: string;
    icon: string;
    color: string;
  };
  realmProgress: number;
  expToNextRealm: number;
  completedProblems: number;
  totalProblems: number;
  pathProgress: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    completed: number;
    total: number;
  }>;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ currentLang, totalExp, currentRealm, realmProgress, expToNextRealm, completedProblems, totalProblems, pathProgress }, ref) => {
    const problemPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

    const getNodePosition = (index: number) => {
      const containerWidth = 400;
      const margin = 80;
      const leftBound = margin;
      const rightBound = containerWidth - margin;
      const centerX = containerWidth / 2;
      const y = 280 + index * 140;
      const pattern = index % 4;
      let x = centerX;
      if (pattern === 1) x = leftBound;
      if (pattern === 3) x = rightBound;
      return { x, y };
    };

    const getPathPoints = () => {
      if (pathProgress.length < 2) return '';
      let points = '';
      pathProgress.forEach((_, index) => {
        const pos = getNodePosition(index);
        if (index === 0) {
          points += `M ${pos.x} ${pos.y}`;
        } else {
          const prev = getNodePosition(index - 1);
          points += ` C ${prev.x} ${prev.y + 70}, ${pos.x} ${pos.y - 70}, ${pos.x} ${pos.y}`;
        }
      });
      return points;
    };

    const pathPoints = getPathPoints();
    const lastPos = pathProgress.length > 0 ? getNodePosition(pathProgress.length - 1) : { x: 200, y: 280 };
    const cardHeight = lastPos.y + 200;

    return (
      <div ref={ref} className="share-card-duolingo" style={{ height: cardHeight }}>
        <div className="share-card-duolingo-header">
          <div className="share-card-duolingo-logo">
            <span className="share-card-duolingo-logo-icon">🎯</span>
            <span className="share-card-duolingo-logo-text">LeetCode Hot 100</span>
          </div>
          <div className="share-card-duolingo-stats">
            <div className="share-card-duolingo-stat-item">
              <div className="share-card-duolingo-stat-icon" style={{ color: currentRealm.color }}>{currentRealm.icon}</div>
              <div className="share-card-duolingo-stat-info">
                <span className="share-card-duolingo-stat-label">{currentLang === 'zh' ? '当前境界' : 'Current Realm'}</span>
                <span className="share-card-duolingo-stat-value" style={{ color: currentRealm.color }}>
                  {currentLang === 'zh' ? currentRealm.name : currentRealm.nameEn}
                </span>
              </div>
            </div>
            <div className="share-card-duolingo-stat-divider" />
            <div className="share-card-duolingo-stat-item">
              <div className="share-card-duolingo-stat-numbers">
                <span className="share-card-duolingo-completed">{completedProblems}</span>
                <span className="share-card-duolingo-separator">/</span>
                <span className="share-card-duolingo-total">{totalProblems}</span>
              </div>
              <span className="share-card-duolingo-stat-label">{currentLang === 'zh' ? '已完成' : 'Solved'}</span>
              <span className="share-card-duolingo-percent">{problemPercentage}%</span>
            </div>
          </div>
          <div className="share-card-duolingo-exp">
            <div className="share-card-duolingo-exp-header">
              <span>{totalExp.toLocaleString()} EXP</span>
              <span>{expToNextRealm > 0 ? `${expToNextRealm.toLocaleString()} to next` : 'Max'}</span>
            </div>
            <div className="share-card-duolingo-exp-bar">
              <div className="share-card-duolingo-exp-fill" style={{ width: `${realmProgress}%`, background: currentRealm.color }} />
            </div>
          </div>
        </div>

        <div className="share-card-duolingo-path-container" style={{ height: cardHeight - 280 }}>
          <svg className="share-card-duolingo-path-svg" width="400" height={cardHeight - 280} viewBox={`0 0 400 ${cardHeight - 280}`}>
            {pathPoints && (
              <>
                <path d={pathPoints} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="12" strokeLinecap="round" />
                <path d={pathPoints} fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                <path d={pathPoints} fill="none" stroke="url(#progressGradient)" strokeWidth="8" strokeLinecap="round" 
                  strokeDasharray="1000" strokeDashoffset={1000 - (problemPercentage / 100) * 1000} />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentRealm.color} />
                    <stop offset="100%" stopColor={`${currentRealm.color}80`} />
                  </linearGradient>
                </defs>
              </>
            )}
          </svg>

          {pathProgress.map((path, index) => {
            const pos = getNodePosition(index);
            const progress = path.total > 0 ? (path.completed / path.total) * 100 : 0;
            const isCompleted = progress >= 100;
            return (
              <div key={path.id} className={`share-card-duolingo-node ${isCompleted ? 'completed' : ''}`}
                style={{ left: pos.x, top: pos.y }}>
                <div className="share-card-duolingo-node-circle" 
                  style={{ background: isCompleted ? path.color : '#fff', borderColor: path.color, boxShadow: `0 4px 15px ${path.color}40` }}>
                  <span className="share-card-duolingo-node-icon" style={{ color: isCompleted ? '#fff' : path.color }}>{path.icon}</span>
                  {isCompleted && (
                    <div className="share-card-duolingo-node-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </div>
                <div className="share-card-duolingo-node-info">
                  <span className="share-card-duolingo-node-name">{currentLang === 'zh' ? path.name : path.nameEn}</span>
                  <span className="share-card-duolingo-node-count">{path.completed}/{path.total}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="share-card-duolingo-footer">
          <p className="share-card-duolingo-slogan">{currentLang === 'zh' ? '让天下没有难学的算法！' : 'Make algorithms easy to learn!'}</p>
          <p className="share-card-duolingo-url">github.com/fuck-algorithm/leetcode-hot-100</p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
