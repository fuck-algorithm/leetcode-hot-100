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

  // 蜿蜒路径位置计算 - 更自然的S形曲线
  const getNodePosition = (index: number) => {
    const margin = 100;
    const leftBound = margin;
    const rightBound = containerWidth - margin;
    const centerX = containerWidth / 2;
    const amplitude = (containerWidth - margin * 2) / 3; // 波动幅度
    
    // 使用正弦函数创建更自然的蜿蜒效果
    const phase = (index * Math.PI) / 1.8;
    const xOffset = Math.sin(phase) * amplitude;
    let xPixel = centerX + xOffset;
    
    // 确保不超出边界
    xPixel = Math.max(leftBound, Math.min(rightBound, xPixel));
    
    const xPercent = (xPixel / containerWidth) * 100;
    const yPosition = index * 140 + 80;
    
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

  // 生成SVG路径连接线 - 多邻国风格蜿蜒曲线
  const generatePathConnections = () => {
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < problems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      // 计算平滑的贝塞尔曲线控制点
      const midY = (currentY + nextY) / 2;
      
      // 创建更平滑的S形曲线
      const pathD = `M ${currentX} ${currentY} C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`;
      
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      
      // 外层阴影路径 - 3D效果
      paths.push(
        <path
          key={`path-shadow-${i}`}
          d={pathD}
          stroke="#d8d8d8"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          style={{ transform: 'translateY(3px)' }}
        />
      );
      
      // 主路径背景
      paths.push(
        <path
          key={`path-bg-${i}`}
          d={pathD}
          stroke="#e8e8e8"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
      );
      
      // 路径内部 - 浅色
      paths.push(
        <path
          key={`path-inner-${i}`}
          d={pathD}
          stroke="#f2f2f2"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      );
      
      // 完成状态的金色路径
      if (currentCompleted) {
        // 金色阴影
        paths.push(
          <path
            key={`path-gold-shadow-${i}`}
            d={pathD}
            stroke="#cd7800"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            style={{ transform: 'translateY(3px)' }}
          />
        );
        
        // 金色主路径
        paths.push(
          <path
            key={`path-gold-${i}`}
            d={pathD}
            stroke="url(#goldGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
        );
        
        // 金色高光
        paths.push(
          <path
            key={`path-gold-highlight-${i}`}
            d={pathD}
            stroke="url(#goldHighlight)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        );
      }
    }
    
    return paths;
  };

  const containerHeight = problems.length * 140 + 140;

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
        {/* 渐变定义 */}
        <defs>
          {/* 金色渐变 - 主路径 */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd900" />
            <stop offset="50%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#ffd900" />
          </linearGradient>
          {/* 金色高光渐变 */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
          </linearGradient>
          {/* 绿色渐变 - 进行中 */}
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#89e219" />
            <stop offset="100%" stopColor="#58cc02" />
          </linearGradient>
        </defs>
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
                top: position.yPosition - 40,
                animationDelay: `${index * 0.05}s`
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
