import React from 'react';
import { Problem } from '../types';
import Tooltip from '../../Tooltip';
import AnimationBadge from '../AnimationBadge';
import ProblemContextMenu from './ProblemContextMenu';

export interface ProblemNodeProps {
  problem: Problem;
  title: string;
  currentLang: string;
  t: (key: string) => string;
  /** 节点中心横坐标（px） */
  x: number;
  /** 节点中心纵坐标（px） */
  y: number;
  completed: boolean;
  isCurrent: boolean;
  isLastInSegment: boolean;
  isExpanded: boolean;
  difficultyClass: string;
  pagesUrl: string | null;
  /** 菜单向节点内侧弹出，避免贴边溢出 */
  menuSide?: 'left' | 'right';
  onActivate: (problem: Problem) => void;
  onContextMenu: (event: React.MouseEvent, problem: Problem) => void;
  onMouseEnter: (problemId: string) => void;
  onMouseLeave: () => void;
  onMenuMouseEnter: () => void;
  onMenuMouseLeave: () => void;
  onToggleCompletion: (problem: Problem, event: React.MouseEvent) => void;
  onOpenLeetCode: (problem: Problem, event: React.MouseEvent) => void;
  onOpenAnimation: (problem: Problem, event: React.MouseEvent) => void;
  onOpenSettings: (event: React.MouseEvent) => void;
}

/**
 * 详情页的单个题目节点。
 *
 * 只负责展示与事件转发，布局和分段逻辑由 DuolingoPath 统一计算。
 */
const ProblemNode: React.FC<ProblemNodeProps> = ({
  problem,
  title,
  currentLang,
  t,
  x,
  y,
  completed,
  isCurrent,
  isLastInSegment,
  isExpanded,
  difficultyClass,
  pagesUrl,
  menuSide = 'right',
  onActivate,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  onMenuMouseEnter,
  onMenuMouseLeave,
  onToggleCompletion,
  onOpenLeetCode,
  onOpenAnimation,
  onOpenSettings,
}) => {
  const tooltipContent = `#${problem.questionFrontendId} ${title} | ${t(
    `difficulties.${problem.difficulty.toLowerCase()}`
  )} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}${
    completed ? ' | ✓' : ''
  }`;

  const bubble = (
    <div
      className={`duolingo-node ${difficultyClass} ${completed ? 'is-completed' : ''} ${
        isCurrent ? 'is-current' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label={`#${problem.questionFrontendId} ${title}`}
      onClick={() => onActivate(problem)}
      onContextMenu={event => onContextMenu(event, problem)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate(problem);
        }
      }}
    >
      <div className="node-inner">
        {completed ? (
          <span className="node-checkmark">✓</span>
        ) : (
          <span className="node-number">{problem.questionFrontendId}</span>
        )}
      </div>

      {isCurrent && <div className="node-pulse-ring" />}

      {problem.hasAnimation && (
        <div className="node-animation-badge-wrapper">
          <AnimationBadge
            hasAnimation={problem.hasAnimation}
            problemId={problem.questionFrontendId}
            problemTitle={title}
            pagesUrl={pagesUrl}
            showPreview={true}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`duolingo-node-wrapper ${completed ? 'completed' : ''} ${
        isCurrent ? 'current' : ''
      } ${isExpanded ? 'expanded' : ''} ${isLastInSegment ? 'segment-end' : ''} menu-${
        menuSide === 'left' ? 'left' : 'right'
      }`}
      style={{
        left: `${x}px`,
        top: y - 35,
      }}
      onMouseEnter={() => onMouseEnter(problem.questionFrontendId)}
      onMouseLeave={onMouseLeave}
    >
      {isExpanded ? bubble : <Tooltip content={tooltipContent}>{bubble}</Tooltip>}

      {isExpanded && (
        <ProblemContextMenu
          problem={problem}
          title={title}
          currentLang={currentLang}
          t={t}
          completed={completed}
          difficultyClass={difficultyClass}
          pagesUrl={pagesUrl}
          onMouseEnter={onMenuMouseEnter}
          onMouseLeave={onMenuMouseLeave}
          onToggleCompletion={onToggleCompletion}
          onOpenLeetCode={onOpenLeetCode}
          onOpenAnimation={onOpenAnimation}
          onOpenSettings={onOpenSettings}
        />
      )}

      {!isExpanded && (
        <div className="node-title-label always-visible">
          <span className="node-id-text">#{problem.questionFrontendId}</span>
          <span className="node-title-text">{title}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProblemNode);
