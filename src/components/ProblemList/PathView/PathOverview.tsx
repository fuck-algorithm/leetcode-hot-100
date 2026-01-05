import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { LearningPath } from '../data/learningPaths';
import Tooltip from '../../Tooltip';
import AscensionNode from './AscensionNode';
import { PathIcon } from './PathIcons/index';
import './PathOverview.css';

// 注意：宝箱节点只在详情页面（DuolingoPath）显示，主路径页面不显示宝箱

interface PathStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  hasAnimation: number;
}

interface PathWithStats {
  path: LearningPath;
  problems: any[];
  stats: PathStats;
}

interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

interface PathOverviewProps {
  pathsWithProblems: PathWithStats[];
  currentLang: string;
  onPathClick: (pathId: string) => void;
  getStatsForProblems: (problemIds: string[]) => CompletionStats;
  // 新增：返回时需要滚动到的路径ID
  scrollToPathId?: string;
}

// 注意：主路径页面不显示宝箱节点，宝箱只在详情页面显示

const PathOverview: React.FC<PathOverviewProps> = ({
  pathsWithProblems,
  currentLang,
  onPathClick,
  getStatsForProblems,
  scrollToPathId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

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

  // 滚动到指定路径节点 - 无动画直接定位
  useEffect(() => {
    if (scrollToPathId && nodesContainerRef.current) {
      // 查找对应的节点元素
      const targetNode = nodesContainerRef.current.querySelector(
        `[data-path-id="${scrollToPathId}"]`
      ) as HTMLElement;
      
      if (targetNode) {
        // 使用 scrollIntoView 直接定位，不使用平滑滚动
        // 'auto' 表示立即滚动，不使用动画
        targetNode.scrollIntoView({ 
          behavior: 'auto', 
          block: 'center' 
        });
      }
    }
  }, [scrollToPathId]);

  // 获取每个路径的完成统计
  const getPathCompletionStats = useCallback((problems: any[]): CompletionStats => {
    const problemIds = problems.map(p => p.questionFrontendId);
    return getStatsForProblems(problemIds);
  }, [getStatsForProblems]);

  // 多邻国风格的蜿蜒路径位置计算 - 简化版（无宝箱）
  const getNodePosition = useCallback((index: number) => {
    const margin = 160;
    const leftBound = margin;
    const rightBound = containerWidth - margin;
    const centerX = containerWidth / 2;
    
    // 使用模式：中 -> 左 -> 中 -> 右 -> 中 -> 左 ... 实现大幅度蜿蜒
    let xPixel: number;
    const pattern = index % 4;
    if (pattern === 0) {
      xPixel = centerX;
    } else if (pattern === 1) {
      xPixel = leftBound;
    } else if (pattern === 2) {
      xPixel = centerX;
    } else {
      xPixel = rightBound;
    }
    
    // 计算Y位置
    const baseSpacing = 280;
    const yPosition = 160 + index * baseSpacing;
    
    const xPercent = (xPixel / containerWidth) * 100;
    
    return {
      xPercent,
      xPixel,
      yPosition,
      index
    };
  }, [containerWidth]);

  // 计算整体完成统计
  const overallStats = useMemo(() => {
    let totalProblems = 0;
    let completedProblems = 0;
    
    pathsWithProblems.forEach(item => {
      const stats = getPathCompletionStats(item.problems);
      totalProblems += stats.total;
      completedProblems += stats.completed;
    });
    
    const percentage = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;
    
    return {
      total: totalProblems,
      completed: completedProblems,
      percentage,
    };
  }, [pathsWithProblems, getPathCompletionStats]);

  // 飞升节点位置计算
  const getAscensionNodePosition = useCallback(() => {
    if (pathsWithProblems.length === 0) {
      return { xPercent: 50, xPixel: containerWidth / 2, yPosition: 400 };
    }
    const lastNodePos = getNodePosition(pathsWithProblems.length - 1);
    const baseSpacing = 280;
    // 飞升节点在最后一个节点下方，居中显示
    return {
      xPercent: 50,
      xPixel: containerWidth / 2,
      yPosition: lastNodePos.yPosition + baseSpacing,
    };
  }, [pathsWithProblems.length, getNodePosition, containerWidth]);

  // 生成SVG路径连接线 - 包含到飞升节点的连接
  const generatePathConnections = useCallback(() => {
    const paths: JSX.Element[] = [];
    
    // 路径节点之间的连接线
    for (let i = 0; i < pathsWithProblems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      // 检查当前节点是否完成
      const currentStats = getPathCompletionStats(pathsWithProblems[i].problems);
      const isCurrentCompleted = currentStats.percentage === 100;
      
      // 检查下一个节点是否完成
      const nextStats = getPathCompletionStats(pathsWithProblems[i + 1].problems);
      const isNextCompleted = nextStats.percentage === 100;
      
      // 普通连接线
      const midY = (currentY + nextY) / 2;
      const isCompleted = isCurrentCompleted && isNextCompleted;
      
      paths.push(
        <path
          key={`path-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke={isCompleted ? '#58cc02' : '#e5e5e5'}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={isCompleted ? 'none' : '12 8'}
        />
      );
    }
    
    // 最后一个节点到飞升节点的连接线
    if (pathsWithProblems.length > 0) {
      const lastNodePos = getNodePosition(pathsWithProblems.length - 1);
      const ascensionPos = getAscensionNodePosition();
      
      const lastStats = getPathCompletionStats(pathsWithProblems[pathsWithProblems.length - 1].problems);
      const isLastCompleted = lastStats.percentage === 100;
      const isAllCompleted = overallStats.percentage === 100;
      
      const midY = (lastNodePos.yPosition + ascensionPos.yPosition) / 2;
      
      paths.push(
        <path
          key="path-to-ascension"
          d={`M ${lastNodePos.xPixel} ${lastNodePos.yPosition} 
              C ${lastNodePos.xPixel} ${midY}, ${ascensionPos.xPixel} ${midY}, ${ascensionPos.xPixel} ${ascensionPos.yPosition}`}
          stroke={isLastCompleted && isAllCompleted ? '#ffd700' : '#e5e5e5'}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={isLastCompleted ? 'none' : '12 8'}
        />
      );
    }
    
    return paths;
  }, [pathsWithProblems, getNodePosition, getPathCompletionStats, getAscensionNodePosition, overallStats.percentage]);

  // 计算容器高度 - 包含飞升节点的空间
  const containerHeight = useMemo(() => {
    if (pathsWithProblems.length === 0) return 400;
    const ascensionPos = getAscensionNodePosition();
    return ascensionPos.yPosition + 500; // 飞升节点下方留出300px间距
  }, [pathsWithProblems.length, getAscensionNodePosition]);

  return (
    <div className="path-overview-container" ref={containerRef}>
      {/* 标题区域 */}
      <div className="path-overview-header">
        <div className="header-mascot">🦉</div>
        <h2 className="path-overview-title">
          {currentLang === 'zh' ? '算法学习之旅' : 'Algorithm Learning Journey'}
        </h2>
        <p className="path-overview-subtitle">
          {currentLang === 'zh' 
            ? '跟随路径，从入门到精通，一步一个脚印' 
            : 'Follow the path, step by step from beginner to master'}
        </p>
      </div>

      {/* 路径容器 */}
      <div className="path-overview-path" style={{ minHeight: containerHeight }}>
        {/* SVG 背景路径 */}
        <svg 
          className="path-overview-svg"
          style={{ height: containerHeight }}
          width="100%"
          viewBox={`0 0 ${containerWidth} ${containerHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {generatePathConnections()}
        </svg>

        {/* 注意：宝箱节点只在详情页面显示，主路径页面不显示 */}

        {/* 路径节点 */}
        <div className="path-overview-nodes" ref={nodesContainerRef}>
          {pathsWithProblems.map((item, index) => {
            const position = getNodePosition(index);
            const { path, stats, problems } = item;
            const name = currentLang === 'zh' ? path.name : path.nameEn;
            const description = currentLang === 'zh' ? path.description : path.descriptionEn;
            const isLast = index === pathsWithProblems.length - 1;
            
            // 获取真实的完成统计
            const completionStats = getPathCompletionStats(problems);
            const completionRate = completionStats.percentage;
            const isStarted = completionStats.completed > 0;
            const isAllCompleted = completionRate === 100;
            
            // 判断是否是当前进度节点（第一个未完成的节点）
            const isCurrentNode = !isAllCompleted && (index === 0 || 
              getPathCompletionStats(pathsWithProblems[index - 1].problems).percentage === 100);
            
            return (
              <div
                key={path.id}
                data-path-id={path.id}
                className={`path-overview-node ${isLast ? 'is-last' : ''} ${isAllCompleted ? 'completed' : ''} ${isCurrentNode ? 'is-current' : ''}`}
                style={{
                  left: `${position.xPercent}%`,
                  top: position.yPosition - 50,
                  '--node-color': isAllCompleted ? '#52c41a' : path.color
                } as React.CSSProperties}
                onClick={() => onPathClick(path.id)}
              >
                {/* 当前节点的"开始"标签 - 多邻国风格 */}
                {isCurrentNode && (
                  <div className="current-node-label">
                    {isStarted 
                      ? (currentLang === 'zh' ? '继续' : 'Continue')
                      : (currentLang === 'zh' ? '开始' : 'Start')
                    }
                  </div>
                )}
                
                <Tooltip content={description}>
                  <div className="node-main">
                    {/* 进度环 */}
                    <svg className="node-progress-ring" viewBox="0 0 100 100">
                      <circle
                        className="progress-bg"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="8"
                      />
                      <circle
                        className="progress-fill"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="8"
                        strokeDasharray={`${completionRate * 2.83} 283`}
                        strokeLinecap="round"
                        style={{ stroke: isAllCompleted ? '#52c41a' : path.color }}
                      />
                    </svg>
                    
                    {/* 节点内容 */}
                    <div 
                      className="node-content" 
                      style={{ 
                        backgroundColor: isAllCompleted ? '#52c41a' : path.color
                      }}
                    >
                      <span className="node-icon">
                        {isAllCompleted ? '✓' : <PathIcon pathId={path.id} size={32} color="#fff" fallback={path.icon} />}
                      </span>
                    </div>
                    
                    {/* 动画标记 */}
                    {stats.hasAnimation > 0 && (
                      <div className="node-animation-count">
                        🎬 {stats.hasAnimation}
                      </div>
                    )}
                    
                    {/* 当前节点脉冲动画 */}
                    {isCurrentNode && <div className="node-pulse-ring"></div>}
                  </div>
                </Tooltip>
                
                {/* 节点信息 */}
                <div className="node-info">
                  <h3 className="node-name">{name}</h3>
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
                  {/* 开始按钮 */}
                  <button 
                    className={`node-start-btn ${isAllCompleted ? 'completed' : ''}`}
                    style={{
                      background: isAllCompleted 
                        ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                        : `linear-gradient(135deg, ${path.color} 0%, ${path.color}dd 100%)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPathClick(path.id);
                    }}
                  >
                    {isAllCompleted 
                      ? (currentLang === 'zh' ? '复习' : 'Review')
                      : isStarted 
                        ? (currentLang === 'zh' ? '继续' : 'Continue')
                        : (currentLang === 'zh' ? '开始' : 'Start')
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 飞升节点 - 替换原来的"算法大师"终点标记 */}
        {pathsWithProblems.length > 0 && (
          <div 
            className="ascension-node-wrapper"
            style={{
              left: `${getAscensionNodePosition().xPercent}%`,
              top: getAscensionNodePosition().yPosition - 60,
            }}
          >
            <AscensionNode
              currentLang={currentLang}
              completionPercentage={overallStats.percentage}
              totalProblems={overallStats.total}
              completedProblems={overallStats.completed}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default PathOverview;
