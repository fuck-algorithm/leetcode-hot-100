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
  const isPathMode = currentMode === 'path';
  
  const handleToggle = () => {
    onModeChange(isPathMode ? 'list' : 'path');
  };

  return (
    <div className="view-mode-switch-container">
      <span 
        className={`switch-label ${!isPathMode ? 'active' : ''}`}
        onClick={() => onModeChange('list')}
      >
        📋 {t('viewMode.list')}
      </span>
      
      <button
        className={`toggle-switch ${isPathMode ? 'path-active' : 'list-active'}`}
        onClick={handleToggle}
        title={isPathMode ? t('viewMode.listTooltip') : t('viewMode.pathTooltip')}
        aria-label="Toggle view mode"
      >
        <span className="toggle-slider" />
      </button>
      
      <span 
        className={`switch-label ${isPathMode ? 'active' : ''}`}
        onClick={() => onModeChange('path')}
      >
        🛤️ {t('viewMode.path')}
      </span>
    </div>
  );
};

export default ViewModeSwitch;
