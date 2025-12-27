import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Problem } from '../types';
import Tooltip from '../../Tooltip';
import AnimationBadge from '../AnimationBadge';
import './DuolingoPath.css';

interface DuolingoPathProps {
  problems: Problem[];
  currentLang: string;
  t: (key: string) => string;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  handleAnimationClick: (
    event: React.MouseEvent, 
    questionId: string, 
    hasAnimation: boolean,
    title?: string,
    t?: (key: string) => string,
    pagesUrl?: string | null
  ) => void;
  isCompleted: (problemId: string) => boolean;
  onToggleCompletion: (problemId: string) => Promise<void>;
}

const DuolingoPath: React.FC<DuolingoPathProps> = ({
  problems,
  currentLang,
  t,
  handleAnimationClick,
  isCompleted,
  onToggleCompletion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 点击外部关闭展开的节点
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (expandedNodeId && !(e.target as Element).closest('.duolingo-node-wrapper')) {
        setExpandedNodeId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expandedNodeId]);

  // 简化的蜿蜒路径布局
  const getNodePosition = (index: number) => {
    const centerX = containerWidth / 2;
    const amplitude = Math.min(80, (containerWidth - 140) / 3);
    
    // 平滑的S形曲线
    const phase = (index * Math.PI) / 1.5;
    const xOffset = Math.sin(phase) * amplitude;
    let xPixel = centerX + xOffset;
    
    // 边界限制
    const margin = 60;
    xPixel = Math.max(margin, Math.min(containerWidth - margin, xPixel));
    
    const xPercent = (xPixel / containerWidth) * 100;
    const yPosition = index * 120 + 100;
    
    return { xPercent, xPixel, yPosition, index };
  };

  // 单击/双击处理
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = React.useRef(0);

  // 切换节点展开状态
  const toggleNodeExpand = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeId(prev => prev === problemId ? null : problemId);
  }, []);

  // 处理完成状态切换
  const handleToggleCompletion = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion(problemId);
  }, [onToggleCompletion]);

  // 打开LeetCode题目页面
  const openLeetCodePage = useCallback((problem: Problem, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
  }, []);

  const handleNodeClick = (e: React.MouseEvent, problem: Problem) => {
    e.preventDefault();
    e.stopPropagation();
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // 单击展开/收起节点详情
          toggleNodeExpand(problem.questionFrontendId, e);
        }
        clickCountRef.current = 0;
      }, 250);
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;
      // 双击打开LeetCode页面
      if (problem.hasAnimation && problem.repo?.pagesUrl) {
        window.open(problem.repo.pagesUrl, '_blank');
      } else {
        window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
      }
    }
  };

  // 获取难度类名
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'difficulty-easy';
      case 'MEDIUM': return 'difficulty-medium';
      case 'HARD': return 'difficulty-hard';
      default: return 'difficulty-medium';
    }
  };

  // 简化的SVG路径连接线
  const generatePathConnections = () => {
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < problems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      // 贝塞尔曲线控制点
      const midY = (currentY + nextY) / 2;
      const pathD = `M ${currentX} ${currentY} C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`;
      
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      const nextCompleted = isCompleted(problems[i + 1].questionFrontendId);
      const bothCompleted = currentCompleted && nextCompleted;
      
      // 简单的单色连接线
      paths.push(
        <path
          key={`path-${i}`}
          d={pathD}
          stroke={bothCompleted ? '#ffd700' : '#d0d0d0'}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    
    return paths;
  };

  const containerHeight = problems.length * 120 + 180;

  if (problems.length === 0) {
    return (
      <div className="duolingo-path-empty">
        <span className="empty-icon">📭</span>
        <p>{currentLang === 'zh' ? '暂无题目' : 'No problems'}</p>
      </div>
    );
  }

  return (
    <div 
      className="duolingo-path-container" 
      style={{ minHeight: containerHeight }}
      ref={containerRef}
    >
      {/* SVG 连接线 */}
      <svg 
        className="duolingo-path-svg"
        style={{ height: containerHeight }}
        width="100%"
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {generatePathConnections()}
      </svg>
      
      {/* 起点标记 */}
      <div 
        className="path-milestone-badge start"
        style={{
          left: `${getNodePosition(0).xPercent}%`,
          top: 30
        }}
      >
        🚀 {currentLang === 'zh' ? '开始' : 'Start'}
      </div>
      
      {/* 节点 */}
      <div className="duolingo-nodes-container">
        {problems.map((problem, index) => {
          const position = getNodePosition(index);
          const title = currentLang === 'zh' ? problem.translatedTitle : problem.title;
          const completed = isCompleted(problem.questionFrontendId);
          const difficultyClass = getDifficultyClass(problem.difficulty);
          const pagesUrl = problem.repo?.pagesUrl || null;
          const isExpanded = expandedNodeId === problem.questionFrontendId;
          
          // 当前进度节点（第一个未完成的节点）
          const isCurrentNode = !completed && (index === 0 || isCompleted(problems[index - 1].questionFrontendId));
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${completed ? 'completed' : ''} ${isCurrentNode ? 'current' : ''} ${isExpanded ? 'expanded' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 35
              }}
            >
              <Tooltip 
                content={`#${problem.questionFrontendId} ${title} | ${t(`difficulties.${problem.difficulty.toLowerCase()}`)} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}${completed ? ' | ✓' : ''}`}
              >
                <div 
                  className={`duolingo-node ${difficultyClass} ${completed ? 'is-completed' : ''} ${isCurrentNode ? 'is-current' : ''}`}
                  onClick={(e) => handleNodeClick(e, problem)}
                >
                  <div className="node-inner">
                    {completed ? (
                      <span className="node-checkmark">✓</span>
                    ) : (
                      <span className="node-number">{problem.questionFrontendId}</span>
                    )}
                  </div>
                  
                  {/* 当前节点脉冲动画 */}
                  {isCurrentNode && <div className="node-pulse-ring"></div>}
                  
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
              </Tooltip>
              
              {/* 展开的详情面板 */}
              {isExpanded && (
                <div className="node-detail-panel">
                  <div className="node-detail-header">
                    <span className="node-detail-id">#{problem.questionFrontendId}</span>
                    <span className={`node-detail-difficulty ${difficultyClass}`}>
                      {t(`difficulties.${problem.difficulty.toLowerCase()}`)}
                    </span>
                  </div>
                  <div className="node-detail-title" onClick={(e) => openLeetCodePage(problem, e)}>
                    {title}
                  </div>
                  <div className="node-detail-stats">
                    <span className="node-detail-rate">
                      {currentLang === 'zh' ? '通过率' : 'AC Rate'}: {(problem.acRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="node-detail-actions">
                    <button 
                      className={`node-action-btn ${completed ? 'completed' : 'incomplete'}`}
                      onClick={(e) => handleToggleCompletion(problem.questionFrontendId, e)}
                    >
                      {completed 
                        ? (currentLang === 'zh' ? '✓ 已完成 (点击取消)' : '✓ Completed (click to undo)')
                        : (currentLang === 'zh' ? '○ 标记为已完成' : '○ Mark as complete')
                      }
                    </button>
                    <button 
                      className="node-action-btn leetcode-btn"
                      onClick={(e) => openLeetCodePage(problem, e)}
                    >
                      {currentLang === 'zh' ? '打开 LeetCode' : 'Open LeetCode'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* 题目标题 - 悬停显示 */}
              {!isExpanded && (
                <div className="node-title-label">
                  <span className="node-title-text">{title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 终点标记 */}
      <div 
        className="path-milestone-badge end"
        style={{
          left: `${getNodePosition(problems.length - 1).xPercent}%`,
          top: containerHeight - 50
        }}
      >
        🏆 {currentLang === 'zh' ? '完成' : 'Complete'}
      </div>
    </div>
  );
};

export default DuolingoPath;
