import React from 'react';
import { AscensionGoal, DisplayInfo } from './types';

interface InfoCardProps {
  displayInfo: DisplayInfo;
  goal: AscensionGoal;
  currentLang: string;
  completedProblems: number;
  totalProblems: number;
  completionPercentage: number;
  isHovered: boolean;
  isEditing: boolean;
  onEdit: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  displayInfo,
  goal,
  currentLang,
  completedProblems,
  totalProblems,
  completionPercentage,
  isHovered,
  isEditing,
  onEdit,
}) => {
  return (
    <div className="ascension-info" onClick={onEdit} style={{ cursor: 'pointer' }}>
      <h3 className="ascension-company-name">{displayInfo.name}</h3>
      
      {/* 进度显示 */}
      <div className="ascension-progress-text">
        <span className="progress-completed">{completedProblems}</span>
        <span className="progress-separator">/</span>
        <span className="progress-total">{totalProblems}</span>
        <span className="progress-label">
          {currentLang === 'zh' ? ' 题' : ' problems'}
        </span>
      </div>

      {/* 进度百分比 */}
      <div className="ascension-percentage">
        {completionPercentage.toFixed(0)}%
      </div>

      {/* 薪资包（如果设置了） */}
      {goal.salary && (
        <div className="ascension-salary">
          💰 {goal.salary}
        </div>
      )}

      {/* 勉励语（如果设置了） */}
      {goal.motivation && (
        <div className="ascension-motivation">
          "{goal.motivation}"
        </div>
      )}

      {/* 编辑提示 */}
      {isHovered && !isEditing && (
        <div className="ascension-edit-hint">
          {currentLang === 'zh' ? '点击编辑目标' : 'Click to edit goal'}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
