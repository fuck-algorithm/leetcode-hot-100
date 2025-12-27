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
        <svg className="reset-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </Tooltip>
  );
};

export default ResetProgressButton;
