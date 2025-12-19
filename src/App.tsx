import React, { useEffect } from 'react';
import './App.css';
import ProblemList from './components/ProblemList';
import LanguageSwitcher from './components/LanguageSwitcher';
import WeChatFloat from './components/WeChatFloat';
import { useTranslation } from './i18n/useCustomTranslation';
import './i18n/i18n'; // 导入 i18n 配置
// 导入GitHub图标
import { FaGithub } from 'react-icons/fa';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // 监听语言变化，更新页面标题
  useEffect(() => {
    document.title = t('appTitle');
  }, [t, i18n.language]);
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo-container">
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
          </a>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-content">
        <ProblemList />
      </main>
      <WeChatFloat />
    </div>
  );
};

export default App; 