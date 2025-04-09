import React from 'react';
import Tooltip from '../Tooltip';

// 难度组件接口
export interface DifficultyProps {
  difficulty: string;
  t: (key: string) => string;
}

const DifficultyBadge: React.FC<DifficultyProps> = ({ difficulty, t }) => {
  let tooltipContent = '';
  let element = null;
  
  switch(difficulty) {
    case 'EASY':
      tooltipContent = t('difficulties.easy');
      element = <span className="difficulty simple">{tooltipContent}</span>;
      break;
    case 'MEDIUM':
      tooltipContent = t('difficulties.medium');
      element = <span className="difficulty medium">{tooltipContent}</span>;
      break;
    case 'HARD':
      tooltipContent = t('difficulties.hard');
      element = <span className="difficulty hard">{tooltipContent}</span>;
      break;
    default:
      return null;
  }
  
  return <Tooltip content={tooltipContent}>{element}</Tooltip>;
};

export default DifficultyBadge; 