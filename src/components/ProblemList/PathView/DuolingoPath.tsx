import React, { useRef, useEffect, useState } from 'react';
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

  // 多邻国风格的蜿蜒路径位置计算 - 增加间距和蜿蜒程度
  const getNodePosition = (index: number) => {
    const amplitude = 80; // 增大振幅，让路径更蜿蜒
    const period = 2; // 减小周期，让蜿蜒更频繁
    
    const phase = (index / period) * Math.PI;
    const xOffset = Math.sin(phase) * amplitude;
    const xPercent = 50 + xOffset;
    
    // 增加节点间距到280px，避免遮挡
    const yPosition = index * 280 + 120;
    
    return {
      xPercent,
      xPixel: (xPercent / 100) * containerWidth,
      yPosition,
      index
    };
  };

  // 使用定时器来区分单击和双击
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = React.useRef(0);

  const handleNodeClick = (e: React.MouseEvent, problem: Problem) => {
    e.preventDefault();
    e.stopPropagation();
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // 第一次点击，设置定时器等待可能的第二次点击
      clickTimeoutRef.current = setTimeout(() => {
        // 单击：打开题目详情
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
      // 双击：切换完成状态
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;
      onToggleCompletion(problem.questionFrontendId);
    }
  };

  const getDifficultyColor = (difficulty: string, completed: boolean) => {
    if (completed) return '#52c41a';
    switch (difficulty) {
      case 'EASY': return '#58cc02';
      case 'MEDIUM': return '#ffc800';
      case 'HARD': return '#ff4b4b';
      default: return '#999';
    }
  };

  const getDifficultyBgColor = (difficulty: string, completed: boolean) => {
    if (completed) return '#d9f7be';
    switch (difficulty) {
      case 'EASY': return '#d7ffb8';
      case 'MEDIUM': return '#fff4d4';
      case 'HARD': return '#ffdfe0';
      default: return '#f0f0f0';
    }
  };

  // 生成SVG路径连接线 - 根据完成状态显示不同颜色
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
      
      // 检查当前节点是否已完成
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      const pathColor = currentCompleted ? '#52c41a' : '#e5e5e5';
      
      paths.push(
        <path
          key={`path-${i}`}
          d={`M ${currentX} ${currentY} 
              C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`}
          stroke={pathColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    
    return paths;
  };

  // 计算容器高度
  const containerHeight = problems.length * 280 + 180;

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
          const completed = isCompleted(problem.questionFrontendId);
          const difficultyColor = getDifficultyColor(problem.difficulty, completed);
          const difficultyBgColor = getDifficultyBgColor(problem.difficulty, completed);
          const isLast = index === problems.length - 1;
          const pagesUrl = problem.repo?.pagesUrl || null;
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${isLast ? 'is-last' : ''} ${completed ? 'completed' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 32
              }}
            >
              <Tooltip 
                content={`#${problem.questionFrontendId} ${title} | ${t(`difficulties.${problem.difficulty.toLowerCase()}`)} | ${(problem.acRate * 100).toFixed(1)}%${problem.hasAnimation ? ' | 🎬' : ''}${completed ? ' | ✓' : ''}`}
              >
                <div 
                  className={`duolingo-node ${completed ? 'is-completed' : ''}`}
                  style={{
                    '--node-color': difficultyColor,
                    '--node-bg': difficultyBgColor
                  } as React.CSSProperties}
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
                      <AnimationBadge 
                        hasAnimation={problem.hasAnimation} 
                        problemId={problem.questionFrontendId} 
                        problemTitle={title}
                        animationUrl={pagesUrl || undefined}
                        pagesUrl={pagesUrl}
                        showPreview={true}
                      />
                    </div>
                  )}
                </div>
              </Tooltip>
              
              {/* 题目标题 - 显示完整的题号和名称 */}
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
          top: containerHeight - 40
        }}
      >
        🏆 {currentLang === 'zh' ? '完成' : 'Complete'}
      </div>
    </div>
  );
};

export default DuolingoPath;
