import React from 'react';
import './ViewModeSwitch.css';

export type ViewMode = 'list' | 'path';

interface ViewModeSwitchProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  t: (key: string) => string;
}

const ViewModeSwitch: React.FC<ViewModeSwitchProps> = ({
  currentMode,
  onModeChange,
  t
}) => {
  return (
    <div className="view-mode-switch">
      <button
        className={`view-mode-btn ${currentMode === 'list' ? 'active' : ''}`}
        onClick={() => onModeChange('list')}
        title={t('viewMode.listTooltip')}
      >
        <span className="view-mode-icon">📋</span>
        <span className="view-mode-text">{t('viewMode.list')}</span>
      </button>
      <button
        className={`view-mode-btn ${currentMode === 'path' ? 'active' : ''}`}
        onClick={() => onModeChange('path')}
        title={t('viewMode.pathTooltip')}
      >
        <span className="view-mode-icon">🛤️</span>
        <span className="view-mode-text">{t('viewMode.path')}</span>
      </button>
    </div>
  );
};

export default ViewModeSwitch;
