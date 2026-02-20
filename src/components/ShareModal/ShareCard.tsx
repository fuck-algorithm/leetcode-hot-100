import React, { forwardRef } from 'react';
import './ShareCard.css';

interface ShareCardProps {
  currentLang: string;
  // 经验值数据
  totalExp: number;
  currentRealm: {
    name: string;
    nameEn: string;
    icon: string;
    color: string;
  };
  realmProgress: number;
  expToNextRealm: number;
  // 题目完成数据
  completedProblems: number;
  totalProblems: number;
  // 路径进度数据
  pathProgress: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    completed: number;
    total: number;
  }>;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  (
    {
      currentLang,
      totalExp,
      currentRealm,
      realmProgress,
      expToNextRealm,
      completedProblems,
      totalProblems,
      pathProgress,
    },
    ref
  ) => {
    const problemPercentage = totalProblems > 0
      ? Math.round((completedProblems / totalProblems) * 100)
      : 0;

    // 只展示前6个路径，避免卡片过长
    const displayPaths = pathProgress.slice(0, 6);

    return (
      <div ref={ref} className="share-card">
        {/* 头部 - 标题和 Logo */}
        <div className="share-card-header">
          <div className="share-card-logo">
            <span className="share-card-logo-icon">🎯</span>
            <span className="share-card-logo-text">LeetCode Hot 100</span>
          </div>
          <p className="share-card-subtitle">
            {currentLang === 'zh' ? '算法学习进度' : 'Algorithm Learning Progress'}
          </p>
        </div>

        {/* 主体内容 */}
        <div className="share-card-body">
          {/* 境界和总进度 */}
          <div className="share-card-main-stats">
            {/* 当前境界 */}
            <div className="share-card-realm">
              <div
                className="share-card-realm-icon"
                style={{ color: currentRealm.color }}
              >
                {currentRealm.icon}
              </div>
              <div className="share-card-realm-info">
                <p className="share-card-realm-label">
                  {currentLang === 'zh' ? '当前境界' : 'Current Realm'}
                </p>
                <p
                  className="share-card-realm-name"
                  style={{ color: currentRealm.color }}
                >
                  {currentLang === 'zh' ? currentRealm.name : currentRealm.nameEn}
                </p>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="share-card-divider" />

            {/* 总进度 */}
            <div className="share-card-progress">
              <div className="share-card-progress-main">
                <span className="share-card-progress-completed">{completedProblems}</span>
                <span className="share-card-progress-separator">/</span>
                <span className="share-card-progress-total">{totalProblems}</span>
                <span className="share-card-progress-percent">{problemPercentage}%</span>
              </div>
              <p className="share-card-progress-label">
                {currentLang === 'zh' ? '已完成题目' : 'Problems Solved'}
              </p>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="share-card-exp-section">
            <div className="share-card-exp-header">
              <span className="share-card-exp-value">
                {totalExp.toLocaleString()} {currentLang === 'zh' ? '经验值' : 'EXP'}
              </span>
              <span className="share-card-exp-next">
                {expToNextRealm > 0
                  ? (currentLang === 'zh'
                    ? `距下一境界还需 ${expToNextRealm.toLocaleString()} EXP`
                    : `${expToNextRealm.toLocaleString()} EXP to next realm`)
                  : (currentLang === 'zh' ? '已达到最高境界' : 'Max Realm Reached')}
              </span>
            </div>
            <div className="share-card-exp-bar">
              <div
                className="share-card-exp-fill"
                style={{
                  width: `${realmProgress}%`,
                  background: `linear-gradient(90deg, ${currentRealm.color} 0%, ${currentRealm.color}dd 100%)`,
                }}
              />
            </div>
          </div>

          {/* 路径进度详情 */}
          {displayPaths.length > 0 && (
            <div className="share-card-paths">
              <p className="share-card-paths-title">
                {currentLang === 'zh' ? '学习路径进度' : 'Learning Path Progress'}
              </p>
              <div className="share-card-paths-grid">
                {displayPaths.map((path) => (
                  <div key={path.id} className="share-card-path-item">
                    <div
                      className="share-card-path-icon"
                      style={{ color: path.color }}
                    >
                      {path.icon}
                    </div>
                    <div className="share-card-path-info">
                      <span className="share-card-path-name">
                        {currentLang === 'zh' ? path.name : path.nameEn}
                      </span>
                      <span className="share-card-path-count">
                        {path.completed}/{path.total}
                      </span>
                    </div>
                    <div className="share-card-path-bar">
                      <div
                        className="share-card-path-fill"
                        style={{
                          width: `${path.total > 0 ? (path.completed / path.total) * 100 : 0}%`,
                          backgroundColor: path.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="share-card-footer">
          <p className="share-card-slogan">
            {currentLang === 'zh'
              ? '让天下没有难学的算法，把一天能理解的知识，缩短到一个小时！'
              : 'Make algorithms easy to learn - understand in hours what takes days!'}
          </p>
          <p className="share-card-url">github.com/fuck-algorithm/leetcode-hot-100</p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';

export default ShareCard;
