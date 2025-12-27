import React from 'react';
import Tooltip from '../Tooltip';
import './ResetProgressButton.css';

interface ResetProgressButtonProps {
  onClick: () => void;
  t: (key: string) => string;
}

const ResetProgressButton: React.FC<ResetProgressButtonProps> = ({ onClick, t }) => {
  return (
    <Tooltip content={t('resetProgress.tooltip')}>
      <button className="reset-progress-btn" onClick={onClick}>
        <span className="reset-icon">🔄</span>
        <span className="reset-text">{t('resetProgress.button')}</span>
      </button>
    </Tooltip>
  );
};

export default ResetProgressButton;
