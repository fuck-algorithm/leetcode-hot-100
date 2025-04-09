import React from 'react';
import Tooltip from '../Tooltip';
import { LegacySortOption } from './types';

// 表格标题组件接口
export interface TableHeaderProps {
  t: (key: string) => string;
  currentSort?: LegacySortOption;
  onSortChange?: (field: LegacySortOption) => void;
  renderSortDirectionIndicator?: (option: LegacySortOption) => React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  t,
  currentSort,
  onSortChange,
  renderSortDirectionIndicator
}) => {
  // 处理点击标题栏排序
  const handleSortClick = (sortField: LegacySortOption) => {
    if (onSortChange) {
      onSortChange(sortField);
    }
  };

  return (
    <div className="table-header">
      <div className="table-header-left">
        <Tooltip content={t('columns.problem')}>
          <span 
            className="column-title" 
            onClick={() => handleSortClick('题号')}
            style={{ cursor: 'pointer' }}
          >
            {t('columns.problem')}
            {currentSort === '题号' && renderSortDirectionIndicator && renderSortDirectionIndicator('题号')}
          </span>
        </Tooltip>
      </div>
      <div className="table-header-right">
        <Tooltip content={t('columns.passRate')}>
          <span 
            className="column-title" 
            onClick={() => handleSortClick('通过率')}
            style={{ cursor: 'pointer' }}
          >
            {t('columns.passRate')}
            {currentSort === '通过率' && renderSortDirectionIndicator && renderSortDirectionIndicator('通过率')}
          </span>
        </Tooltip>
        <Tooltip content={t('columns.difficulty')}>
          <span 
            className="column-title" 
            onClick={() => handleSortClick('难度')}
            style={{ cursor: 'pointer' }}
          >
            {t('columns.difficulty')}
            {currentSort === '难度' && renderSortDirectionIndicator && renderSortDirectionIndicator('难度')}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default TableHeader; 