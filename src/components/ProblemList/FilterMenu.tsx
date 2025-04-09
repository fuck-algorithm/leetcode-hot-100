import React, { forwardRef } from 'react';
import Tooltip from '../Tooltip';
import { Tag } from './types';

// 标签筛选菜单组件接口
export interface FilterMenuProps {
  visible: boolean;
  selectedTags: string[];
  allTags: Tag[];
  toggleTag: (tagSlug: string) => void;
  clearFilters: () => void;
  currentLang: string;
  t: (key: string) => string;
}

const FilterMenu = forwardRef<HTMLDivElement, FilterMenuProps>(({ 
  visible, 
  selectedTags, 
  allTags, 
  toggleTag, 
  clearFilters, 
  currentLang,
  t
}, ref) => {
  if (!visible) return null;
  
  return (
    <div className="filter-menu" ref={ref}>
      <div className="filter-header">
        <span>{t('filters.title')}</span>
        {selectedTags.length > 0 && (
          <Tooltip content={t('filters.clear')}>
            <button className="clear-filters" onClick={clearFilters}>{t('filters.clear')}</button>
          </Tooltip>
        )}
      </div>
      <div className="filter-tags">
        {allTags.map(tag => {
          const tagName = currentLang === 'zh' ? tag.nameTranslated : tag.name;
          return (
            <Tooltip key={tag.slug} content={tagName}>
              <div 
                className={`filter-tag ${selectedTags.includes(tag.slug) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.slug)}
              >
                <span>{tagName}</span>
                <span className="tag-count">({tag.count})</span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
});

// 添加displayName用于调试目的
FilterMenu.displayName = 'FilterMenu';

export default FilterMenu; 