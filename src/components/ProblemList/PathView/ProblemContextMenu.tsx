import React from 'react';
import { Problem } from '../types';

interface ProblemContextMenuProps {
  problem: Problem;
  title: string;
  currentLang: string;
  t: (key: string) => string;
  completed: boolean;
  difficultyClass: string;
  pagesUrl: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleCompletion: (problem: Problem, event: React.MouseEvent) => void;
  onOpenLeetCode: (problem: Problem, event: React.MouseEvent) => void;
  onOpenAnimation: (problem: Problem, event: React.MouseEvent) => void;
  onOpenSettings: (event: React.MouseEvent) => void;
}

/**
 * 题目节点的悬浮/右键菜单。单独拆出来，避免 DuolingoPath 里堆积交互细节。
 */
const ProblemContextMenu: React.FC<ProblemContextMenuProps> = ({
  problem,
  title,
  currentLang,
  t,
  completed,
  difficultyClass,
  pagesUrl,
  onMouseEnter,
  onMouseLeave,
  onToggleCompletion,
  onOpenLeetCode,
  onOpenAnimation,
  onOpenSettings,
}) => {
  const isZh = currentLang === 'zh';

  return (
    <div
      className="node-context-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="context-menu-header">
        <span className="context-menu-id">#{problem.questionFrontendId}</span>
        <span className={`context-menu-difficulty ${difficultyClass}`}>
          {t(`difficulties.${problem.difficulty.toLowerCase()}`)}
        </span>
      </div>
      <div className="context-menu-title">{title}</div>
      <div className="context-menu-actions">
        <button
          className={`context-menu-btn ${completed ? 'completed' : 'incomplete'}`}
          onClick={event => onToggleCompletion(problem, event)}
        >
          {completed
            ? (isZh ? '✓ 已完成 (点击取消)' : '✓ Completed (click to undo)')
            : (isZh ? '○ 标记为已完成' : '○ Mark as complete')}
        </button>

        {problem.hasAnimation && pagesUrl && (
          <button
            className="context-menu-btn animation-btn"
            onClick={event => onOpenAnimation(problem, event)}
          >
            🎬 {isZh ? '查看算法演示' : 'View Animation'}
          </button>
        )}

        <button
          className="context-menu-btn leetcode-btn"
          onClick={event => onOpenLeetCode(problem, event)}
        >
          📝 {isZh ? '打开 LeetCode' : 'Open LeetCode'}
        </button>

        <div className="context-menu-divider" />

        <button
          className="context-menu-btn settings-btn"
          onClick={onOpenSettings}
        >
          ⚙️ {isZh ? '设置默认行为' : 'Set Default Behavior'}
        </button>
      </div>
    </div>
  );
};

export default ProblemContextMenu;
