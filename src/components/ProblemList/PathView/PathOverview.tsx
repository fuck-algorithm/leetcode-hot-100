import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LearningPath } from '../data/learningPaths';
import Tooltip from '../../Tooltip';
import TreasureNode from './TreasureNode';
import './PathOverview.css';

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
}

// 宝箱节点配置：每隔多少个路径节点放置一个宝箱
const TREASURE_INTERVAL = 3;

const PathOverview: React.FC<PathOverviewProps> = ({
  pathsWithProblems,
  currentLang,
  onPathClick,
  getStatsForProblems
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [, setRefreshKey] = useState(0);

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

  // 获取每个路径的完成统计
  const getPathCompletionStats = useCallback((problems: any[]): CompletionStats => {
    const problemIds = problems.map(p => p.questionFrontendId);
    return getStatsForProblems(problemIds);
  }, [getStatsForProblems]);

  // 计算宝箱位置信息
  const getTreasurePositions = useCallback(() => {
    const treasures: { 
      afterIndex: number; 
      stageNumber: number; 
      canOpen: boolean;
      treasureId: string;
    }[] = [];
    
    let stageCount = 0;
    
    for (let i = 0; i < pathsWithProblems.length; i++) {
      // 每隔 TREASURE_INTERVAL 个节点放置一个宝箱
      if ((i + 1) % TREASURE_INTERVAL === 0 && i < pathsWithProblems.length - 1) {
        stageCount++;
        
        // 检查宝箱前面的所有题目是否都完成了
        let canOpen = true;
        for (let j = (stageCount - 1) * TREASURE_INTERVAL; j <= i; j++) {
          const stats = getPathCompletionStats(pathsWithProblems[j].problems);
          if (stats.percentage < 100) {
            canOpen = false;
            break;
          }
        }
        
        treasures.push({
          afterIndex: i,
          stageNumber: stageCount,
          canOpen,
          treasureId: `overview-stage-${stageCount}`
        });
      }
    }
    
    return treasures;
  }, [pathsWithProblems, getPathCompletionStats]);

  // 多邻国风格的蜿蜒路径位置计算 - 考虑宝箱节点的额外空间
  const getNodePosition = useCallback((index: number) => {
    const margin = 160;
    const leftBound = margin;
    const rightBound = containerWidth - margin;
    const centerX = containerWidth / 2;
    
    // 计算在此索引之前有多少个宝箱
    const treasures = getTreasurePositions();
    const treasuresBefore = treasures.filter(t => t.afterIndex < index).length;
    
    // 调整后的索引（考虑宝箱占位）
    const adjustedIndex = index + treasuresBefore;
    
    // 使用模式：中 -> 左 -> 中 -> 右 -> 中 -> 左 ... 实现大幅度蜿蜒
    let xPixel: number;
    const pattern = adjustedIndex % 4;
    if (pattern === 0) {
      xPixel = centerX;
    } else if (pattern === 1) {
      xPixel = leftBound;
    } else if (pattern === 2) {
      xPixel = centerX;
    } else {
      xPixel = rightBound;
    }
    
    // 计算Y位置，考虑宝箱节点的额外空间
    const baseSpacing = 280;
    const treasureSpacing = 200; // 宝箱节点占用的空间
    
    let yPosition = 160;
    for (let i = 0; i < index; i++) {
      yPosition += baseSpacing;
      // 检查是否在此节点后有宝箱
      if (treasures.some(t => t.afterIndex === i)) {
        yPosition += treasureSpacing;
      }
    }
    
    const xPercent = (xPixel / containerWidth) * 100;
    
    return {
      xPercent,
      xPixel,
      yPosition,
      index
    };
  }, [containerWidth, getTreasurePositions]);

  // 获取宝箱节点的位置
  const getTreasureNodePosition = useCallback((afterIndex: number) => {
    const nodePos = getNodePosition(afterIndex);
    const nextNodePos = afterIndex < pathsWithProblems.length - 1 
      ? getNodePosition(afterIndex + 1) 
      : null;
    
    // 宝箱放在两个节点之间
    const yPosition = nextNodePos 
      ? (nodePos.yPosition + nextNodePos.yPosition) / 2 - 50
      : nodePos.yPosition + 150;
    
    return {
      xPercent: 50, // 宝箱始终居中
      xPixel: containerWidth / 2,
      yPosition
    };
  }, [getNodePosition, pathsWithProblems.length, containerWidth]);

  // 生成SVG路径连接线
  const generatePathConnections = useCallback(() => {
    const paths: JSX.Element[] = [];
    const treasures = getTreasurePositions();
    
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
      
      // 检查是否有宝箱在这两个节点之间
      const treasure = treasures.find(t => t.afterIndex === i);
      
      if (treasure) {
        // 有宝箱：路径分成两段
        const treasurePos = getTreasureNodePosition(i);
        const treasureX = treasurePos.xPixel;
        const treasureY = treasurePos.yPosition + 40; // 宝箱中心偏移
        
        // 第一段：从当前节点到宝箱
        const midY1 = (currentY + treasureY) / 2;
        const isFirstSegmentCompleted = isCurrentCompleted;
        paths.push(
          <path
            key={`path-${i}-a`}
            d={`M ${currentX} ${currentY} 
                C ${currentX} ${midY1}, ${treasureX} ${midY1}, ${treasureX} ${treasureY - 50}`}
            stroke={isFirstSegmentCompleted ? '#58cc02' : '#e5e5e5'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={isFirstSegmentCompleted ? 'none' : '12 8'}
          />
        );
        
        // 第二段：从宝箱到下一个节点
        const midY2 = (treasureY + 50 + nextY) / 2;
        const isSecondSegmentCompleted = treasure.canOpen && isNextCompleted;
        paths.push(
          <path
            key={`path-${i}-b`}
            d={`M ${treasureX} ${treasureY + 50} 
                C ${treasureX} ${midY2}, ${nextX} ${midY2}, ${nextX} ${nextY}`}
            stroke={isSecondSegmentCompleted ? '#58cc02' : '#e5e5e5'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={isSecondSegmentCompleted ? 'none' : '12 8'}
          />
        );
      } else {
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
    }
    
    return paths;
  }, [pathsWithProblems, getNodePosition, getPathCompletionStats, getTreasurePositions, getTreasureNodePosition]);

  // 处理宝箱开启
  const handleTreasureOpen = useCallback(() => {
    // 触发刷新以更新UI
    setRefreshKey(prev => prev + 1);
  }, []);

  // 计算容器高度
  const containerHeight = (() => {
    if (pathsWithProblems.length === 0) return 400;
    const lastNodePos = getNodePosition(pathsWithProblems.length - 1);
    return lastNodePos.yPosition + 200;
  })();

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

        {/* 宝箱节点 */}
        {getTreasurePositions().map((treasure) => {
          const position = getTreasureNodePosition(treasure.afterIndex);
          
          return (
            <div
              key={treasure.treasureId}
              className="treasure-node-wrapper"
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition
              }}
            >
              <TreasureNode
                treasureId={treasure.treasureId}
                stageNumber={treasure.stageNumber}
                canOpen={treasure.canOpen}
                currentLang={currentLang}
                onOpen={handleTreasureOpen}
              />
            </div>
          );
        })}

        {/* 路径节点 */}
        <div className="path-overview-nodes">
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
                      <span className="node-icon">{isAllCompleted ? '✓' : path.icon}</span>
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

        {/* 终点标记 */}
        <div 
          className="path-overview-milestone end"
          style={{
            left: `${getNodePosition(pathsWithProblems.length - 1).xPercent}%`,
            top: containerHeight - 60
          }}
        >
          <span className="milestone-icon">🏆</span>
          <span className="milestone-text">
            {currentLang === 'zh' ? '算法大师' : 'Algorithm Master'}
          </span>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="path-overview-tip">
        <span className="tip-icon">💡</span>
        <span className="tip-text">
          {currentLang === 'zh' 
            ? '点击任意节点开始学习该专题，完成阶段任务可开启宝箱获取经验值' 
            : 'Click any node to start learning, complete stages to unlock treasures and earn EXP'}
        </span>
      </div>
    </div>
  );
};

export default PathOverview;
