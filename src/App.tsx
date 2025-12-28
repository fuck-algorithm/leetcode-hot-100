import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import ProblemList from './components/ProblemList';
import LanguageSwitcher from './components/LanguageSwitcher';
import WeChatFloat from './components/WeChatFloat';
import { useTranslation } from './i18n/useCustomTranslation';
import './i18n/i18n'; // 导入 i18n 配置
// 导入GitHub图标
import { FaGithub, FaStar } from 'react-icons/fa';
import { useGitHubStars } from './hooks/useGitHubStars';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { stars } = useGitHubStars('fuck-algorithm', 'leetcode-hot-100');
  const navigate = useNavigate();
  
  // 监听语言变化，更新页面标题
  useEffect(() => {
    document.title = t('appTitle');
  }, [t, i18n.language]);

  // 点击Logo跳转首页
  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo-container" onClick={handleLogoClick}>
          <div className="app-logo-title">
            <img 
              src={`${process.env.PUBLIC_URL}/favicon.png`} 
              alt="Logo" 
              className="app-logo" 
            />
            <h1>{t('appTitle')}</h1>
          </div>
          <div className="app-slogan">
            {t('appSlogan')}
          </div>
        </div>
        <div className="header-right">
          <a 
            href="https://github.com/fuck-algorithm/leetcode-hot-100" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
            title="GitHub"
          >
            {/* 使用GitHub图标 */}
            <span className="github-icon">
              {/* @ts-ignore */}
              <FaGithub size={24} color="#333" />
            </span>
            <span className="github-stars">
              {/* @ts-ignore */}
              <FaStar size={14} color="#f1c40f" />
              <span>{stars}</span>
            </span>
          </a>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/path" replace />} />
          <Route path="/list" element={<ProblemList viewMode="list" />} />
          <Route path="/path" element={<ProblemList viewMode="path" />} />
          <Route path="/path/:pathId" element={<ProblemList viewMode="path" />} />
        </Routes>
      </main>
      <WeChatFloat />
    </div>
  );
};

export default App; 