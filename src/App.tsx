import React from 'react';
import './App.css';
import ProblemList from './components/ProblemList';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from './i18n/useCustomTranslation';
import './i18n/i18n'; // 导入 i18n 配置

const App: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('appTitle')}</h1>
        <div className="header-right">
          <a 
            href="https://github.com/fuck-algorithm/leetcode-hot-100" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <img src={`${process.env.PUBLIC_URL}/github-mark.svg`} alt="GitHub" />
          </a>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-content">
        <ProblemList />
      </main>
    </div>
  );
};

export default App; 