import React from 'react';
import { LearningPath } from '../data/learningPaths';
import { PathIcon } from './PathIcons';
import { NodePosition } from './trail/geometry';

export interface OverviewPathStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  hasAnimation: number;
}

export interface OverviewCompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

interface OverviewPathNodeProps {
  path: LearningPath;
  stats: OverviewPathStats;
  completionStats: OverviewCompletionStats;
  position: NodePosition;
  currentLang: string;
  isCurrent: boolean;
  isLast: boolean;
  nodeRadius: number;
  onOpen: () => void;
}


/**
 * 概览页的学习路径节点。
 *
 * 视觉上尽量贴近多邻国：圆形 3D 节点 + 细进度环 + 下方紧凑信息条，
 * 不再使用占据大量纵向空间的白色卡片。
 */
const OverviewPathNode: React.FC<OverviewPathNodeProps> = ({
  path,
  stats,
  completionStats,
  position,
  currentLang,
  isCurrent,
  isLast,
  nodeRadius,
  onOpen,
}) => {
  const name = currentLang === 'zh' ? path.name : path.nameEn;
  const description = currentLang === 'zh' ? path.description : path.descriptionEn;
  const completionRate = completionStats.percentage;
  const isStarted = completionStats.completed > 0;
  const isAllCompleted = completionRate >= 100;
  const percentLabel = Math.round(completionRate);

  const content = (
    <div className="node-main">
      <svg className="node-progress-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="progress-bg" cx="50" cy="50" r="45" fill="none" strokeWidth="6" />
        <circle
          className="progress-fill"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="6"
          strokeDasharray={`${completionRate * 2.83} 283`}
          strokeLinecap="round"
          style={{ stroke: isAllCompleted ? '#f5b800' : path.color }}
        />
      </svg>

      <div
        className="node-content"
        style={{
          backgroundColor: isAllCompleted ? '#f5b800' : path.color,
        }}
      >
        <span className="node-icon">
          <PathIcon
            pathId={path.id}
            size={nodeRadius >= 52 ? 38 : nodeRadius >= 46 ? 34 : 31}
            color={isAllCompleted ? '#7a5600' : '#fff'}
            fallback={path.icon}
          />
        </span>

        {isAllCompleted && (
          <span className="node-complete-badge" aria-hidden="true">
            ✓
          </span>
        )}
      </div>

      {stats.hasAnimation > 0 && (
        <div className="node-animation-count">🎬 {stats.hasAnimation}</div>
      )}

      {isCurrent && <div className="node-pulse-ring" />}
    </div>
  );

  return (
    <div
      data-path-id={path.id}
      className={`path-overview-node ${isLast ? 'is-last' : ''} ${
        isAllCompleted ? 'completed' : ''
      } ${isCurrent ? 'is-current' : ''}`}
      style={{
        left: `${position.x}px`,
        top: position.y - nodeRadius,
        '--node-color': isAllCompleted ? '#f5b800' : path.color,
      } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${name} ${completionStats.completed}/${stats.total}`}
      onClick={onOpen}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      {isCurrent && (
        <div className="current-node-label">
          {isStarted
            ? (currentLang === 'zh' ? '继续' : 'Continue')
            : (currentLang === 'zh' ? '开始' : 'Start')}
        </div>
      )}

      {content}

      <div className="node-info">
        <div className="node-info-head">
          <h3 className="node-name">{name}</h3>
          <span className="node-percent">{percentLabel}%</span>
        </div>

        {/* 详细数据悬浮显示，避免常驻卡片遮挡路径 */}
        <div className="node-detail" aria-hidden="true">
          <p className="node-detail-desc">{description}</p>
          <div className="node-progress-track">
            <div
              className="node-progress-fill"
              style={{
                width: `${Math.min(100, completionRate)}%`,
                background: isAllCompleted ? '#f5b800' : path.color,
              }}
            />
          </div>

          <div className="node-stats">
            <span className="stat-total">
              {completionStats.completed}/{stats.total} {currentLang === 'zh' ? '题' : 'problems'}
            </span>
            <div className="stat-difficulty">
              <span className="diff-easy">{stats.easy}</span>
              <span className="diff-medium">{stats.medium}</span>
              <span className="diff-hard">{stats.hard}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewPathNode);
