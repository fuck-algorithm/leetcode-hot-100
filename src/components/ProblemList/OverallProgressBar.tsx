import React from 'react';
import './OverallProgressBar.css';

interface OverallProgressBarProps {
  completed: number;
  total: number;
  t: (key: string) => string;
}

const OverallProgressBar: React.FC<OverallProgressBarProps> = ({ completed, total, t }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="overall-progress-bar">
      <div className="progress-info">
        <span className="progress-text">
          <span className="progress-completed">{completed}</span>
          <span className="progress-separator">/</span>
          <span className="progress-total">{total}</span>
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default OverallProgressBar;
