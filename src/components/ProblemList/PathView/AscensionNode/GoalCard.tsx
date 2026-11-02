import React from 'react';
import { AscensionGoal, DisplayInfo } from './types';

interface GoalCardProps {
  displayInfo: DisplayInfo;
  goal: AscensionGoal;
  currentLang: string;
  completedProblems: number;
  totalProblems: number;
  completionPercentage: number;
  isHovered: boolean;
  isEditing: boolean;
  isComplete: boolean;
  onEdit: () => void;
}

/**
 * 飞升目标的信息卡片。
 *
 * 相比旧版把公司、进度、薪资、勉励语纵向堆成一大块，这里收成一张紧凑卡片：
 * 名称 + 进度条 + 进度数字，薪资和勉励语作为辅助信息。
 */
const GoalCard: React.FC<GoalCardProps> = ({
  displayInfo,
  goal,
  currentLang,
  completedProblems,
  totalProblems,
  completionPercentage,
  isHovered,
  isEditing,
  isComplete,
  onEdit,
}) => {
  const isZh = currentLang === 'zh';
  const percentage = Math.max(0, Math.min(100, completionPercentage));

  return (
    <div
      className={`ascension-info ${isHovered ? 'is-hovered' : ''} ${
        isComplete ? 'is-complete' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label={isZh ? '编辑飞升目标' : 'Edit ascension goal'}
      onClick={onEdit}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onEdit();
        }
      }}
    >
      <div className="ascension-info-head">
        <h3 className="ascension-company-name">{displayInfo.name}</h3>
        {!isEditing && (
          <span className="ascension-edit-icon" aria-hidden="true">✏️</span>
        )}
      </div>

      <div className="ascension-mini-track">
        <div
          className="ascension-mini-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${displayInfo.color}, ${displayInfo.color}cc)`,
          }}
        />
      </div>

      <div className="ascension-progress-text">
        <span>
          <span className="progress-completed">{completedProblems}</span>
          <span className="progress-separator">/</span>
          <span className="progress-total">{totalProblems}</span>
          <span className="progress-label">{isZh ? ' 题' : ' problems'}</span>
        </span>
        <span className="ascension-percentage">{percentage.toFixed(0)}%</span>
      </div>

      {(goal.salary || goal.motivation) && (
        <div className="ascension-goal-meta">
          {goal.salary && (
            <span className="ascension-salary">💰 {goal.salary}</span>
          )}
          {goal.motivation && (
            <p className="ascension-motivation">“{goal.motivation}”</p>
          )}
        </div>
      )}

      {isHovered && !isEditing && (
        <span className="ascension-edit-hint">
          {isZh ? '点击编辑目标' : 'Click to edit goal'}
        </span>
      )}
    </div>
  );
};

export default GoalCard;
