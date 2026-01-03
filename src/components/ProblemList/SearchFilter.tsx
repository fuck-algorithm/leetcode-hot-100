import React from 'react';
import Tooltip from '../Tooltip';
import { LegacySortOption } from './types';
import { CompletionFilterType } from '../../services/completionStorage';
import CompletionFilterDropdown from './CompletionFilterDropdown';
import './SearchFilter.css';

// 搜索和筛选组件接口
export interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAnimationOnly: boolean;
  setShowAnimationOnly: (show: boolean) => void;
  showSortMenu: boolean;
  setShowSortMenu: (show: boolean) => void;
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  currentSort: LegacySortOption;
  t: (key: string) => string;
  children?: React.ReactNode;
  sortButtonRef?: React.RefObject<HTMLButtonElement>;
  filterButtonRef?: React.RefObject<HTMLButtonElement>;
  completionFilter?: CompletionFilterType;
  onCompletionFilterChange?: (filter: CompletionFilterType) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  showAnimationOnly,
  setShowAnimationOnly,
  showSortMenu,
  setShowSortMenu,
  showFilterMenu,
  setShowFilterMenu,
  currentSort,
  t,
  children,
  sortButtonRef,
  filterButtonRef,
  completionFilter = 'all',
  onCompletionFilterChange
}) => {
  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-buttons">
        {/* 完成状态筛选 */}
        {onCompletionFilterChange && (
          <Tooltip content={t('completionFilter.tooltip')}>
            <CompletionFilterDropdown
              value={completionFilter}
              onChange={onCompletionFilterChange}
              t={t}
            />
          </Tooltip>
        )}
        <div className="animation-filter">
          <Tooltip content={t('animationFilter')}>
            <label 
              className="animation-checkbox-label"
              onClick={(e) => e.stopPropagation()} // 防止点击事件冒泡
            >
              <input
                type="checkbox"
                checked={showAnimationOnly}
                onChange={(e) => {
                  setShowAnimationOnly(e.target.checked);
                  console.log('动画筛选状态改变为:', e.target.checked);
                }}
                className="animation-checkbox"
              />
              <span className="custom-checkbox">
                <span className="animation-icon">🎬</span>
              </span>
            </label>
          </Tooltip>
        </div>
        <Tooltip content={t('filters.title')}>
          <button ref={filterButtonRef} className="filter-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>🔍</button>
        </Tooltip>
        <Tooltip content={t(`sorting.${currentSort === '默认' ? 'default' : 
                            currentSort === '难度' ? 'difficulty' : 
                            currentSort === '通过率' ? 'passRate' : 
                            currentSort === '题号' ? 'problemId' : 'tags'}`)}>
          <button ref={sortButtonRef} className="sort-button" onClick={() => setShowSortMenu(!showSortMenu)}>↕</button>
        </Tooltip>
        {children}
      </div>
    </div>
  );
};

export default SearchFilter; 