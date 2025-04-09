import React from 'react';
import { useTranslation } from '../i18n/useCustomTranslation';
import { changeLanguage } from '../i18n/i18n';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    changeLanguage(newLang);
  };

  return (
    <div className="language-switcher">
      <button onClick={toggleLanguage}>
        {t(`languages.${currentLanguage === 'zh' ? 'en' : 'zh'}`)}
      </button>
    </div>
  );
};

export default LanguageSwitcher; 