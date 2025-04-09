import React, { forwardRef } from 'react';
import Tooltip from '../Tooltip';
import { LegacySortOption } from './types';

// 排序菜单组件接口
export interface SortMenuProps {
  visible: boolean;
  currentSort: LegacySortOption;
  sortProblems: (option: LegacySortOption) => void;
  getSortOptionText: (option: LegacySortOption) => string;
  renderSortDirectionIndicator: (option: LegacySortOption) => React.ReactNode;
  t: (key: string) => string;
}

const SortMenu = forwardRef<HTMLDivElement, SortMenuProps>(({ 
  visible, 
  currentSort, 
  sortProblems, 
  getSortOptionText, 
  renderSortDirectionIndicator,
  t
}, ref) => {
  if (!visible) return null;
  
  // 定义排序选项数组
  const sortOptions: LegacySortOption[] = ['默认', '难度', '通过率', '题号', '标签'];
  
  return (
    <div className="sort-menu" ref={ref}>
      {sortOptions.map((option) => (
        <div key={option} className="sort-option" onClick={() => sortProblems(option)}>
          <Tooltip content={t(`sorting.${option === '默认' ? 'default' : 
                              option === '难度' ? 'difficulty' : 
                              option === '通过率' ? 'passRate' : 
                              option === '题号' ? 'problemId' : 'tags'}`)}>
            <span>{getSortOptionText(option)}</span>
          </Tooltip>
          <div className="sort-option-right">
            {renderSortDirectionIndicator(option)}
            {currentSort === option && <span className="check-mark">✓</span>}
            {option === '标签' && currentSort !== option && <span className="sort-icon hidden">👁</span>}
          </div>
        </div>
      ))}
    </div>
  );
});

// 添加displayName用于调试目的
SortMenu.displayName = 'SortMenu';

export default SortMenu; 