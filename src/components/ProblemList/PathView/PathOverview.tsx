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

interface PathOverviewProps {
  pathsWithProblems: PathWithStats[];
  currentLang: string;
  onPathClick: (pathId: string) => void;
}

const PathOverview: React.FC<PathOverviewProps> = ({
  pathsWithProblems,
  currentLang,
  onPathClick
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

  // 多邻国风格的蜿蜒路径位置计算
  const getNodePosition = (index: number) => {
    const amplitude = 28; // 左右摆动幅度（百分比）
    const period = 2.5; // 周期
    
    const phase = (index / period) * Math.PI;
    const xOffset = Math.sin(phase) * amplitude;
    const xPercent = 50 + xOffset;
    
    const yPosition = index * 160 + 100; // 每个节点间隔160px
    
    return {
      xPercent,
      xPixel: (xPercent / 100) * containerWidth,
      yPosition,
      index
    };
  };

  // 生成SVG路径连接线
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
      
      // 背景路径（更粗的灰色）
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
      
      // 前景路径（渐变色）
      paths.push(
        <path
          key={`path-fg-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke={`url(#gradient-${i})`}
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

  const containerHeight = pathsWithProblems.length * 160 + 150;

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
          className="path-overview-milestone start"
          style={{
            left: `${getNodePosition(0).xPercent}%`,
            top: 20
          }}
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
            const { path, stats } = item;
            const name = currentLang === 'zh' ? path.name : path.nameEn;
            const description = currentLang === 'zh' ? path.description : path.descriptionEn;
            const isLast = index === pathsWithProblems.length - 1;
            
            // 计算完成度（这里用动画覆盖率作为示例）
            const completionRate = stats.total > 0 
              ? Math.round((stats.hasAnimation / stats.total) * 100) 
              : 0;
            
            return (
              <div
                key={path.id}
                className={`path-overview-node ${isLast ? 'is-last' : ''}`}
                style={{
                  left: `${position.xPercent}%`,
                  top: position.yPosition - 50,
                  '--node-color': path.color
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
                        style={{ stroke: path.color }}
                      />
                    </svg>
                    
                    {/* 节点内容 */}
                    <div className="node-content" style={{ backgroundColor: path.color }}>
                      <span className="node-icon">{path.icon}</span>
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
                    <span className="stat-total">{stats.total} {currentLang === 'zh' ? '题' : 'problems'}</span>
                    <div className="stat-difficulty">
                      <span className="diff-easy">{stats.easy}</span>
                      <span className="diff-medium">{stats.medium}</span>
                      <span className="diff-hard">{stats.hard}</span>
                    </div>
                  </div>
                </div>
                
                {/* 装饰元素 */}
                {index % 3 === 0 && (
                  <div className="node-decoration left">
                    {['🌟', '✨', '💫'][index % 3]}
                  </div>
                )}
                {index % 3 === 1 && (
                  <div className="node-decoration right">
                    {['🎯', '🏆', '⭐'][index % 3]}
                  </div>
                )}
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

        {/* 装饰性角色 */}
        <div className="path-decoration-characters">
          <div className="decoration-char char-1">🦊</div>
          <div className="decoration-char char-2">🐻</div>
          <div className="decoration-char char-3">🐼</div>
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
