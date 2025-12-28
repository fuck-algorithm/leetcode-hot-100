import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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

// 分段配置：每段的题目数量
const SEGMENT_SIZE = 5;
// 分段之间的额外间距（包含分隔区域）
const SEGMENT_GAP = 200;
// 节点之间的基础间距
const NODE_SPACING = 180;

const DuolingoPath: React.FC<DuolingoPathProps> = ({
  problems,
  currentLang,
  t,
  isCompleted,
  onToggleCompletion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // 点击外部关闭展开的节点和菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (expandedNodeId && !target.closest('.duolingo-node-wrapper') && !target.closest('.node-context-menu')) {
        setExpandedNodeId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expandedNodeId]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // 计算分段信息
  const segmentInfo = useMemo(() => {
    const totalProblems = problems.length;
    const segmentCount = Math.ceil(totalProblems / SEGMENT_SIZE);
    const segments: { startIndex: number; endIndex: number; completedCount: number }[] = [];
    
    for (let i = 0; i < segmentCount; i++) {
      const startIndex = i * SEGMENT_SIZE;
      const endIndex = Math.min(startIndex + SEGMENT_SIZE - 1, totalProblems - 1);
      
      // 计算该分段的完成数量
      let completedCount = 0;
      for (let j = startIndex; j <= endIndex; j++) {
        if (isCompleted(problems[j].questionFrontendId)) {
          completedCount++;
        }
      }
      
      segments.push({ startIndex, endIndex, completedCount });
    }
    
    return { segmentCount, segments };
  }, [problems, isCompleted]);

  // 判断某个索引是否是分段的最后一个节点（不包括整个路径的最后一个）
  const isSegmentEnd = useCallback((index: number) => {
    return (index + 1) % SEGMENT_SIZE === 0 && index < problems.length - 1;
  }, [problems.length]);

  // 获取某个索引所在的分段编号
  const getSegmentIndex = useCallback((index: number) => {
    return Math.floor(index / SEGMENT_SIZE);
  }, []);

  // 简化的蜿蜒路径布局（考虑分段间距）
  const getNodePosition = useCallback((index: number) => {
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
    
    // 计算Y位置，考虑分段间距
    const segmentIndex = getSegmentIndex(index);
    const baseY = index * NODE_SPACING + 100;
    const segmentGapOffset = segmentIndex * SEGMENT_GAP;
    const yPosition = baseY + segmentGapOffset;
    
    return { xPercent, xPixel, yPosition, index };
  }, [containerWidth, getSegmentIndex]);

  // 清除隐藏定时器
  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // 隐藏菜单（带延迟）
  const hideMenuWithDelay = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setExpandedNodeId(null);
    }, 300); // 300ms 延迟，给用户足够时间移动到菜单
  }, []);

  // 隐藏菜单（立即）
  const hideMenu = useCallback(() => {
    clearHideTimeout();
    setExpandedNodeId(null);
  }, [clearHideTimeout]);

  // 处理完成状态切换
  const handleToggleCompletion = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion(problemId);
    hideMenu();
  }, [onToggleCompletion, hideMenu]);

  // 打开LeetCode题目页面
  const openLeetCodePage = useCallback((problem: Problem, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
    hideMenu();
  }, [hideMenu]);

  // 打开GitHub Pages演示页面
  const openGitHubPages = useCallback((problem: Problem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (problem.hasAnimation && problem.repo?.pagesUrl) {
      window.open(problem.repo.pagesUrl, '_blank');
    }
    hideMenu();
  }, [hideMenu]);

  // 左键单击 - 直接跳转到GitHub Pages（如果有动画）或LeetCode
  const handleNodeClick = (e: React.MouseEvent, problem: Problem) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 左键单击直接跳转
    if (problem.hasAnimation && problem.repo?.pagesUrl) {
      window.open(problem.repo.pagesUrl, '_blank');
    } else {
      window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
    }
  };

  // 右键单击 - 显示菜单
  const handleNodeContextMenu = (e: React.MouseEvent, problem: Problem) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNodeId(problem.questionFrontendId);
  };

  // 鼠标悬停 - 显示菜单
  const handleNodeMouseEnter = useCallback((problemId: string) => {
    clearHideTimeout(); // 清除任何待执行的隐藏操作
    setExpandedNodeId(problemId);
  }, [clearHideTimeout]);

  // 鼠标离开节点区域
  const handleNodeMouseLeave = useCallback(() => {
    hideMenuWithDelay(); // 使用延迟隐藏
  }, [hideMenuWithDelay]);

  // 鼠标进入菜单区域
  const handleMenuMouseEnter = useCallback(() => {
    clearHideTimeout(); // 取消隐藏
  }, [clearHideTimeout]);

  // 鼠标离开菜单区域
  const handleMenuMouseLeave = useCallback(() => {
    hideMenuWithDelay(); // 使用延迟隐藏
  }, [hideMenuWithDelay]);

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

  // 生成分段分隔区域（在每个阶段之间）
  const generateSegmentDividers = () => {
    const dividers: JSX.Element[] = [];
    
    segmentInfo.segments.forEach((segment, segmentIndex) => {
      // 跳过最后一个分段（因为最后有终点标记）
      if (segmentIndex === segmentInfo.segmentCount - 1) return;
      
      const lastNodeIndex = segment.endIndex;
      const lastNodePosition = getNodePosition(lastNodeIndex);
      const segmentSize = segment.endIndex - segment.startIndex + 1;
      const isSegmentCompleted = segment.completedCount === segmentSize;
      
      // 下一个阶段的信息
      const nextSegment = segmentInfo.segments[segmentIndex + 1];
      const nextSegmentSize = nextSegment ? nextSegment.endIndex - nextSegment.startIndex + 1 : 0;
      
      // 分隔区域位置在分段最后一个节点下方
      const dividerY = lastNodePosition.yPosition + 100;
      
      dividers.push(
        <div
          key={`divider-${segmentIndex}`}
          className={`path-segment-divider ${isSegmentCompleted ? 'completed' : ''}`}
          style={{
            top: dividerY
          }}
        >
          {/* 左侧装饰线 */}
          <div className="segment-divider-line left"></div>
          
          {/* 中间的阶段完成标记 */}
          <div className="segment-divider-content">
            <div className="segment-divider-badge">
              <div className="segment-badge-icon">
                {isSegmentCompleted ? '⭐' : '🎯'}
              </div>
              <div className="segment-badge-info">
                <div className="segment-badge-title">
                  {currentLang === 'zh' 
                    ? `第 ${segmentIndex + 1} 阶段`
                    : `Stage ${segmentIndex + 1}`
                  }
                </div>
                <div className="segment-badge-status">
                  {isSegmentCompleted 
                    ? (currentLang === 'zh' ? '已完成 ✓' : 'Complete ✓')
                    : `${segment.completedCount}/${segmentSize}`
                  }
                </div>
              </div>
            </div>
            
            {/* 下一阶段预告 */}
            <div className="segment-next-preview">
              <div className="segment-next-arrow">↓</div>
              <div className="segment-next-text">
                {currentLang === 'zh' 
                  ? `第 ${segmentIndex + 2} 阶段 · ${nextSegmentSize} 题`
                  : `Stage ${segmentIndex + 2} · ${nextSegmentSize} problems`
                }
              </div>
            </div>
          </div>
          
          {/* 右侧装饰线 */}
          <div className="segment-divider-line right"></div>
        </div>
      );
    });
    
    return dividers;
  };

  // 计算容器高度（考虑分段间距）
  const containerHeight = useMemo(() => {
    const baseHeight = problems.length * NODE_SPACING + 180;
    const segmentGapTotal = (segmentInfo.segmentCount - 1) * SEGMENT_GAP;
    return baseHeight + segmentGapTotal;
  }, [problems.length, segmentInfo.segmentCount]);

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
          
          // 判断是否是分段的最后一个节点
          const isLastInSegment = isSegmentEnd(index);
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${completed ? 'completed' : ''} ${isCurrentNode ? 'current' : ''} ${isExpanded ? 'expanded' : ''} ${isLastInSegment ? 'segment-end' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 35
              }}
              onMouseEnter={() => handleNodeMouseEnter(problem.questionFrontendId)}
              onMouseLeave={handleNodeMouseLeave}
            >
              <Tooltip 
                content={`#${problem.questionFrontendId} ${title} | ${t(`difficulties.${problem.difficulty.toLowerCase()}`)} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}${completed ? ' | ✓' : ''}`}
              >
                <div 
                  className={`duolingo-node ${difficultyClass} ${completed ? 'is-completed' : ''} ${isCurrentNode ? 'is-current' : ''}`}
                  onClick={(e) => handleNodeClick(e, problem)}
                  onContextMenu={(e) => handleNodeContextMenu(e, problem)}
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
              
              {/* 悬停/右键菜单 */}
              {isExpanded && (
                <div 
                  className="node-context-menu"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <div className="context-menu-header">
                    <span className="context-menu-id">#{problem.questionFrontendId}</span>
                    <span className={`context-menu-difficulty ${difficultyClass}`}>
                      {t(`difficulties.${problem.difficulty.toLowerCase()}`)}
                    </span>
                  </div>
                  <div className="context-menu-title">{title}</div>
                  <div className="context-menu-actions">
                    {/* 菜单项1: 标记完成/未完成 */}
                    <button 
                      className={`context-menu-btn ${completed ? 'completed' : 'incomplete'}`}
                      onClick={(e) => handleToggleCompletion(problem.questionFrontendId, e)}
                    >
                      {completed 
                        ? (currentLang === 'zh' ? '✓ 已完成 (点击取消)' : '✓ Completed (click to undo)')
                        : (currentLang === 'zh' ? '○ 标记为已完成' : '○ Mark as complete')
                      }
                    </button>
                    
                    {/* 菜单项2: 跳转到演示页面 */}
                    {problem.hasAnimation && pagesUrl && (
                      <button 
                        className="context-menu-btn animation-btn"
                        onClick={(e) => openGitHubPages(problem, e)}
                      >
                        🎬 {currentLang === 'zh' ? '查看算法演示' : 'View Animation'}
                      </button>
                    )}
                    
                    {/* 菜单项3: 跳转到LeetCode */}
                    <button 
                      className="context-menu-btn leetcode-btn"
                      onClick={(e) => openLeetCodePage(problem, e)}
                    >
                      📝 {currentLang === 'zh' ? '打开 LeetCode' : 'Open LeetCode'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* 题目ID和名称 - 始终显示在节点下方 */}
              {!isExpanded && (
                <div className="node-title-label always-visible">
                  <span className="node-id-text">#{problem.questionFrontendId}</span>
                  <span className="node-title-text">{title}</span>
                </div>
              )}
            </div>
          );
        })}
        
        {/* 分段分隔区域 */}
        {generateSegmentDividers()}
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
