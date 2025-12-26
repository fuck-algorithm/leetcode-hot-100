import React, { useRef, useEffect, useState } from 'react';
import { Problem } from '../types';
import Tooltip from '../../Tooltip';
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
}

const DuolingoPath: React.FC<DuolingoPathProps> = ({
  problems,
  currentLang,
  t
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
    // 使用正弦波创建蜿蜒效果
    const amplitude = 25; // 左右摆动幅度（百分比）
    const period = 3; // 每3个节点完成一个周期
    
    // 计算水平位置 - 使用正弦波
    const phase = (index / period) * Math.PI;
    const xOffset = Math.sin(phase) * amplitude;
    const xPercent = 50 + xOffset; // 中心点50%，左右摆动
    
    // 垂直位置
    const yPosition = index * 120 + 80; // 每个节点间隔120px
    
    return {
      xPercent,
      xPixel: (xPercent / 100) * containerWidth,
      yPosition,
      index
    };
  };

  const handleNodeClick = (problem: Problem) => {
    if (problem.hasAnimation && problem.repo?.pagesUrl) {
      window.open(problem.repo.pagesUrl, '_blank');
    } else {
      window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '#58cc02';
      case 'MEDIUM': return '#ffc800';
      case 'HARD': return '#ff4b4b';
      default: return '#999';
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '#d7ffb8';
      case 'MEDIUM': return '#fff4d4';
      case 'HARD': return '#ffdfe0';
      default: return '#f0f0f0';
    }
  };

  // 生成SVG路径连接线
  const generatePathConnections = () => {
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < problems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      // 使用贝塞尔曲线创建平滑的连接
      const midY = (currentY + nextY) / 2;
      
      paths.push(
        <path
          key={`path-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke="#e5e5e5"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    
    return paths;
  };

  // 计算容器高度
  const containerHeight = problems.length * 120 + 100;

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
      {/* SVG 背景路径 */}
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
          top: 10
        }}
      >
        🚀 {currentLang === 'zh' ? '开始' : 'Start'}
      </div>
      
      {/* 节点 */}
      <div className="duolingo-nodes-container">
        {problems.map((problem, index) => {
          const position = getNodePosition(index);
          const title = currentLang === 'zh' ? problem.translatedTitle : problem.title;
          const difficultyColor = getDifficultyColor(problem.difficulty);
          const difficultyBgColor = getDifficultyBgColor(problem.difficulty);
          const isLast = index === problems.length - 1;
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${isLast ? 'is-last' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 32
              }}
            >
              <Tooltip 
                content={`#${problem.questionFrontendId} ${title} | ${t(`difficulties.${problem.difficulty.toLowerCase()}`)} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}`}
              >
                <div 
                  className={`duolingo-node ${problem.hasAnimation ? 'has-animation' : ''}`}
                  style={{
                    '--node-color': difficultyColor,
                    '--node-bg': difficultyBgColor
                  } as React.CSSProperties}
                  onClick={() => handleNodeClick(problem)}
                >
                  <div className="node-inner">
                    <span className="node-number">{problem.questionFrontendId}</span>
                  </div>
                  {problem.hasAnimation && (
                    <span className="node-animation-badge">🎬</span>
                  )}
                </div>
              </Tooltip>
              
              <div className="node-title-label">
                {title.length > 8 ? title.substring(0, 8) + '...' : title}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 终点标记 */}
      <div 
        className="path-milestone-badge end"
        style={{
          left: `${getNodePosition(problems.length - 1).xPercent}%`,
          top: containerHeight - 40
        }}
      >
        🏆 {currentLang === 'zh' ? '完成' : 'Complete'}
      </div>
    </div>
  );
};

export default DuolingoPath;
