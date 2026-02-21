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
      <div ref={ref} className="share-card">
        {/* Header */}
        <div className="share-card-header">
          <div className="header-content">
            <h1 className="header-title">LeetCode Hot 100</h1>
            <p className="header-subtitle">
              {currentLang === 'zh' ? '算法学习进度' : 'Algorithm Learning Progress'}
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{completedProblems}</span>
              <span className="stat-label">{currentLang === 'zh' ? '已完成' : 'Done'}</span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
              <span className="stat-value">{totalProblems}</span>
              <span className="stat-label">{currentLang === 'zh' ? '总题数' : 'Total'}</span>
            </div>
            <div className="stat-percent">{problemPercentage}%</div>
          </div>

          <div className="header-realm">
            <span className="realm-icon">{currentRealm.icon}</span>
            <span className="realm-name" style={{ color: currentRealm.color }}>
              {currentLang === 'zh' ? currentRealm.name : currentRealm.nameEn}
            </span>
            <span className="realm-exp">{totalExp.toLocaleString()} EXP</span>
          </div>
        </div>

        {/* Problem List */}
        <div className="problem-list">
          <div className="list-header">
            <span className="col-id">#</span>
            <span className="col-title">{currentLang === 'zh' ? '题目' : 'Problem'}</span>
            <span className="col-diff">{currentLang === 'zh' ? '难度' : 'Diff'}</span>
            <span className="col-status">{currentLang === 'zh' ? '状态' : 'Status'}</span>
          </div>
          
          <div className="list-body">
            {problems.map((problem) => {
              const isCompleted = isProblemCompleted(problem.questionFrontendId);
              return (
                <div 
                  key={problem.questionFrontendId} 
                  className={`problem-row ${isCompleted ? 'completed' : ''}`}
                >
                  <span className="problem-id">{problem.questionFrontendId}</span>
                  <span className="problem-title">
                    {currentLang === 'zh' && problem.translatedTitle 
                      ? problem.translatedTitle 
                      : problem.title}
                  </span>
                  <span 
                    className="problem-difficulty"
                    style={{ 
                      color: getDifficultyColor(problem.difficulty),
                      backgroundColor: `${getDifficultyColor(problem.difficulty)}15`
                    }}
                  >
                    {getDifficultyLabel(problem.difficulty)}
                  </span>
                  <span className="problem-status">
                    {isCompleted ? '✓' : '○'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="share-card-footer">
          <p className="footer-slogan">
            {currentLang === 'zh' ? '让天下没有难学的算法' : 'Make algorithms easy to learn'}
          </p>
          <p className="footer-url">github.com/fuck-algorithm/leetcode-hot-100</p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
