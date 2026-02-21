import React, { forwardRef } from 'react';
import './ShareCard.css';
import { Problem } from '../ProblemList/types';

interface ShareCardProps {
  currentLang: string;
  totalExp: number;
  currentRealm: {
    name: string;
    nameEn: string;
    icon: string;
    color: string;
  };
  realmProgress: number;
  expToNextRealm: number;
  completedProblems: number;
  totalProblems: number;
  pathProgress: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    completed: number;
    total: number;
  }>;
  problems: Problem[];
  completions: Map<string, boolean>;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ currentLang, totalExp, currentRealm, completedProblems, totalProblems, problems, completions }, ref) => {
    const problemPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

    // 获取难度颜色
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'EASY': return '#22c55e';
        case 'MEDIUM': return '#f59e0b';
        case 'HARD': return '#ef4444';
        default: return '#6b7280';
      }
    };

    // 获取难度标签
    const getDifficultyLabel = (difficulty: string) => {
      switch (difficulty) {
        case 'EASY': return currentLang === 'zh' ? '简单' : 'Easy';
        case 'MEDIUM': return currentLang === 'zh' ? '中等' : 'Medium';
        case 'HARD': return currentLang === 'zh' ? '困难' : 'Hard';
        default: return difficulty;
      }
    };

    // 检查题目是否完成
    const isProblemCompleted = (problemId: string) => {
      return completions.get(problemId) ?? false;
    };

    return (
      <div ref={ref} className="share-card-list">
        {/* 头部 - 标题和汇总统计 */}
        <div className="share-card-header">
          <div className="share-card-title-section">
            <h1 className="share-card-main-title">LeetCode Hot 100</h1>
            <p className="share-card-subtitle">
              {currentLang === 'zh' ? '算法学习进度' : 'Algorithm Learning Progress'}
            </p>
          </div>
          
          <div className="share-card-summary">
            <div className="share-card-stat-box">
              <span className="share-card-stat-number">{completedProblems}</span>
              <span className="share-card-stat-label">
                {currentLang === 'zh' ? '已完成' : 'Completed'}
              </span>
            </div>
            <div className="share-card-stat-divider">/</div>
            <div className="share-card-stat-box">
              <span className="share-card-stat-number">{totalProblems}</span>
              <span className="share-card-stat-label">
                {currentLang === 'zh' ? '总题数' : 'Total'}
              </span>
            </div>
            <div className="share-card-stat-percent">{problemPercentage}%</div>
          </div>

          <div className="share-card-realm-info">
            <span className="share-card-realm-icon">{currentRealm.icon}</span>
            <span className="share-card-realm-name" style={{ color: currentRealm.color }}>
              {currentLang === 'zh' ? currentRealm.name : currentRealm.nameEn}
            </span>
            <span className="share-card-exp">{totalExp.toLocaleString()} EXP</span>
          </div>
        </div>

        {/* 题目列表 */}
        <div className="share-card-problem-list">
          <div className="share-card-list-header">
            <span className="share-card-col-id">#</span>
            <span className="share-card-col-title">
              {currentLang === 'zh' ? '题目' : 'Problem'}
            </span>
            <span className="share-card-col-diff">
              {currentLang === 'zh' ? '难度' : 'Diff'}
            </span>
            <span className="share-card-col-status">
              {currentLang === 'zh' ? '状态' : 'Status'}
            </span>
          </div>
          
          <div className="share-card-list-body">
            {problems.map((problem, index) => {
              const isCompleted = isProblemCompleted(problem.questionFrontendId);
              return (
                <div 
                  key={problem.questionFrontendId} 
                  className={`share-card-problem-item ${isCompleted ? 'completed' : ''}`}
                >
                  <span className="share-card-problem-id">{problem.questionFrontendId}</span>
                  <span className="share-card-problem-title">
                    {currentLang === 'zh' && problem.translatedTitle 
                      ? problem.translatedTitle 
                      : problem.title}
                  </span>
                  <span 
                    className="share-card-problem-difficulty"
                    style={{ color: getDifficultyColor(problem.difficulty) }}
                  >
                    {getDifficultyLabel(problem.difficulty)}
                  </span>
                  <span className="share-card-problem-status">
                    {isCompleted ? '✓' : '○'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部 */}
        <div className="share-card-footer">
          <p className="share-card-slogan">
            {currentLang === 'zh' ? '让天下没有难学的算法！' : 'Make algorithms easy to learn!'}
          </p>
          <p className="share-card-url">github.com/fuck-algorithm/leetcode-hot-100</p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
