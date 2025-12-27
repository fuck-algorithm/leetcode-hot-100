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

  // 蜿蜒路径位置计算
  const getNodePosition = (index: number) => {
    const margin = 120;
    const leftBound = margin;
    const rightBound = containerWidth - margin;
    const centerX = containerWidth / 2;
    
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
    
    const xPercent = (xPixel / containerWidth) * 100;
    const yPosition = index * 160 + 100;
    
    return {
      xPercent,
      xPixel,
      yPosition,
      index
    };
  };

  // 单击/双击处理
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = React.useRef(0);

  const handleNodeClick = (e: React.MouseEvent, problem: Problem) => {
    e.preventDefault();
    e.stopPropagation();
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          if (problem.hasAnimation && problem.repo?.pagesUrl) {
            window.open(problem.repo.pagesUrl, '_blank');
          } else {
            window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
          }
        }
        clickCountRef.current = 0;
      }, 250);
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;
      onToggleCompletion(problem.questionFrontendId);
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
      
      const midY = (currentY + nextY) / 2;
      
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      
      // 背景路径（灰色）
      paths.push(
        <path
          key={`path-bg-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke="#e5e5e5"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
      );
      
      // 前景路径（根据完成状态）
      if (currentCompleted) {
        paths.push(
          <path
            key={`path-fg-${i}`}
            d={`M ${currentX} ${currentY} 
                C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
            stroke="#ffd700"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
        );
      }
    }
    
    return paths;
  };

  const containerHeight = problems.length * 160 + 140;

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
          top: 20
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
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${completed ? 'completed' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 40
              }}
            >
              <Tooltip 
                content={`#${problem.questionFrontendId} ${title} | ${t(`difficulties.${problem.difficulty.toLowerCase()}`)} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}${completed ? ' | ✓' : ''}`}
              >
                <div 
                  className={`duolingo-node ${difficultyClass} ${completed ? 'is-completed' : ''}`}
                  onClick={(e) => handleNodeClick(e, problem)}
                >
                  <div className="node-inner">
                    {completed ? (
                      <span className="node-checkmark">✓</span>
                    ) : (
                      <span className="node-number">{problem.questionFrontendId}</span>
                    )}
                  </div>
                  
                  {problem.hasAnimation && (
                    <div 
                      className="node-animation-badge-wrapper"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnimationClick(e, problem.questionFrontendId, problem.hasAnimation, title, t, pagesUrl);
                      }}
                    >
                      <div className="node-animation-icon">🎬</div>
                    </div>
                  )}
                </div>
              </Tooltip>
              
              {/* 题目标题 */}
              <div className="node-title-label">
                <span className="node-title-id">#{problem.questionFrontendId}</span>
                <span className="node-title-text">{title}</span>
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
          top: containerHeight - 50
        }}
      >
        🏆 {currentLang === 'zh' ? '完成' : 'Complete'}
      </div>
    </div>
  );
};

export default DuolingoPath;
