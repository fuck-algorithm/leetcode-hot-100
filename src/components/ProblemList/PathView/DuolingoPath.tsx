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

  // 多邻国风格蜿蜒路径 - 更明显的S形曲线布局
  const getNodePosition = (index: number) => {
    const centerX = containerWidth / 2;
    // 更大的波动幅度，创建更明显的蜿蜒效果
    const amplitude = Math.min(100, (containerWidth - 160) / 3);
    
    // 使用正弦函数创建平滑的蜿蜒效果
    // 每3个节点完成一个完整的左右摆动周期
    const phase = (index * Math.PI) / 1.5;
    const xOffset = Math.sin(phase) * amplitude;
    let xPixel = centerX + xOffset;
    
    // 确保不超出边界
    const margin = 70;
    xPixel = Math.max(margin, Math.min(containerWidth - margin, xPixel));
    
    const xPercent = (xPixel / containerWidth) * 100;
    // 垂直间距
    const yPosition = index * 120 + 100;
    
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

  // 生成SVG路径连接线 - 多邻国风格圆点路径（优化版）
  const generatePathConnections = () => {
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < problems.length - 1; i++) {
      const current = getNodePosition(i);
      const next = getNodePosition(i + 1);
      
      const currentX = current.xPixel;
      const currentY = current.yPosition;
      const nextX = next.xPixel;
      const nextY = next.yPosition;
      
      // 计算控制点，创建更自然的S形曲线
      const midY = (currentY + nextY) / 2;
      const controlX1 = currentX;
      const controlY1 = midY;
      const controlX2 = nextX;
      const controlY2 = midY;
      
      // 创建平滑的贝塞尔曲线
      const pathD = `M ${currentX} ${currentY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${nextX} ${nextY}`;
      
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      const nextCompleted = isCompleted(problems[i + 1].questionFrontendId);
      const bothCompleted = currentCompleted && nextCompleted;
      
      // 路径底部深色阴影 - 增强3D效果
      paths.push(
        <path
          key={`path-shadow-bottom-${i}`}
          d={pathD}
          stroke="rgba(0, 0, 0, 0.15)"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 14"
          style={{ transform: 'translateY(4px)' }}
        />
      );
      
      // 路径中间阴影层
      paths.push(
        <path
          key={`path-shadow-mid-${i}`}
          d={pathD}
          stroke="rgba(0, 0, 0, 0.08)"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 14"
          style={{ transform: 'translateY(2px)' }}
        />
      );
      
      // 主路径背景 - 更粗的灰色底
      paths.push(
        <path
          key={`path-bg-${i}`}
          d={pathD}
          stroke={bothCompleted ? '#d4a000' : '#c8c8c8'}
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 14"
        />
      );
      
      // 主路径 - 圆点效果（多邻国风格）- 更大更明显
      paths.push(
        <path
          key={`path-dots-${i}`}
          d={pathD}
          stroke={bothCompleted ? '#ffd700' : '#e8e8e8'}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="4 14"
        />
      );
      
      // 完成状态的金色光晕 - 更强烈
      if (bothCompleted) {
        paths.push(
          <path
            key={`path-glow-outer-${i}`}
            d={pathD}
            stroke="rgba(255, 215, 0, 0.3)"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 14"
            style={{ filter: 'blur(8px)' }}
          />
        );
        
        paths.push(
          <path
            key={`path-glow-inner-${i}`}
            d={pathD}
            stroke="rgba(255, 215, 0, 0.5)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 14"
            style={{ filter: 'blur(4px)' }}
          />
        );
      }
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
      {/* 背景装饰元素 */}
      <div className="path-decoration path-decoration-1"></div>
      <div className="path-decoration path-decoration-2"></div>
      <div className="path-decoration path-decoration-3"></div>
      
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
          
          // 判断是否是当前进度节点（第一个未完成的节点）
          const isCurrentNode = !completed && (index === 0 || isCompleted(problems[index - 1].questionFrontendId));
          
          return (
            <div
              key={problem.id}
              className={`duolingo-node-wrapper ${completed ? 'completed' : ''} ${isCurrentNode ? 'current' : ''}`}
              style={{
                left: `${position.xPercent}%`,
                top: position.yPosition - 35,
                animationDelay: `${index * 0.03}s`
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
                  
                  {/* 当前节点的脉冲动画环 */}
                  {isCurrentNode && <div className="node-pulse-ring"></div>}
                  
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
              
              {/* 题目标题 - 仅在悬停时显示 */}
              <div className="node-title-label">
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
