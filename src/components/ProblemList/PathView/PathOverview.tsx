import React, { useRef, useEffect, useState } from 'react';
import { LearningPath } from '../data/learningPaths';
import Tooltip from '../../Tooltip';
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
  isCompleted: (problemId: string) => boolean;
  getStatsForProblems: (problemIds: string[]) => CompletionStats;
}

const PathOverview: React.FC<PathOverviewProps> = ({
  pathsWithProblems,
  currentLang,
  onPathClick,
  isCompleted,
  getStatsForProblems
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // 多邻国风格的蜿蜒路径位置计算 - 增加蜿蜒程度
  const getNodePosition = (index: number) => {
    const amplitude = 25; // 适度振幅，让路径蜿蜒但不过度
    const period = 3; // 调整周期，让蜿蜒更平缓
    
    const phase = (index / period) * Math.PI;
    const xOffset = Math.sin(phase) * amplitude;
    const xPercent = 50 + xOffset;
    
    const yPosition = index * 320 + 160; // 增加间距到320px，避免遮挡
    
    return {
      xPercent,
      xPixel: (xPercent / 100) * containerWidth,
      yPosition,
      index
    };
  };

  // 获取每个路径的完成统计
  const getPathCompletionStats = (problems: any[]): CompletionStats => {
    const problemIds = problems.map(p => p.questionFrontendId);
    return getStatsForProblems(problemIds);
  };

  // 生成SVG路径连接线 - 根据完成状态显示不同颜色
  const generatePathConnections = () => {
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < pathsWithProblems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      const midY = (currentY + nextY) / 2;
      
      // 获取当前路径的完成状态
      const currentStats = getPathCompletionStats(pathsWithProblems[i].problems);
      const isPathStarted = currentStats.completed > 0;
      const isPathCompleted = currentStats.percentage === 100;
      
      // 背景路径
      paths.push(
        <path
          key={`path-bg-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke="#e8e8e8"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
      );
      
      // 前景路径 - 根据完成状态显示不同颜色
      const pathColor = isPathCompleted 
        ? '#52c41a' 
        : isPathStarted 
          ? `url(#gradient-${i})` 
          : '#d9d9d9';
      
      paths.push(
        <path
          key={`path-fg-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke={pathColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    
    return paths;
  };

  // 生成渐变定义
  const generateGradients = () => {
    return pathsWithProblems.slice(0, -1).map((item, i) => {
      const nextItem = pathsWithProblems[i + 1];
      return (
        <linearGradient key={`gradient-${i}`} id={`gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={item.path.color} />
          <stop offset="100%" stopColor={nextItem.path.color} />
        </linearGradient>
      );
    });
  };

  const containerHeight = pathsWithProblems.length * 320 + 260;

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
          <defs>
            {generateGradients()}
          </defs>
          {generatePathConnections()}
        </svg>

        {/* 起点标记 */}
        <div 
          className="path-overview-milestone start clickable"
          style={{
            left: `${getNodePosition(0).xPercent}%`,
            top: 20
          }}
          onClick={() => onPathClick(pathsWithProblems[0]?.path.id)}
        >
          <span className="milestone-icon">🚀</span>
          <span className="milestone-text">
            {currentLang === 'zh' ? '开始学习' : 'Start Learning'}
          </span>
        </div>

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
            
            return (
              <div
                key={path.id}
                className={`path-overview-node ${isLast ? 'is-last' : ''} ${isAllCompleted ? 'completed' : ''} ${!isStarted ? 'not-started' : ''}`}
                style={{
                  left: `${position.xPercent}%`,
                  top: position.yPosition - 50,
                  '--node-color': isAllCompleted ? '#52c41a' : (isStarted ? path.color : '#d9d9d9')
                } as React.CSSProperties}
                onClick={() => onPathClick(path.id)}
              >
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
                        backgroundColor: isAllCompleted ? '#52c41a' : (isStarted ? path.color : '#d9d9d9')
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
                    className="node-start-btn"
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
            ? '点击任意节点开始学习该专题' 
            : 'Click any node to start learning that topic'}
        </span>
      </div>
    </div>
  );
};

export default PathOverview;
