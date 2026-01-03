import React from 'react';
import Tooltip from '../Tooltip';
import { Tag } from './types';
import './SelectedTags.css';

// 已选标签组件接口
export interface SelectedTagsProps {
  selectedTags: string[];
  allTags: Tag[];
  toggleTag: (tagSlug: string) => void;
  clearFilters: () => void;
  currentLang: string;
  t: (key: string) => string;
}

const SelectedTags: React.FC<SelectedTagsProps> = ({ 
  selectedTags, 
  allTags, 
  toggleTag, 
  clearFilters, 
  currentLang,
  t
}) => {
  if (selectedTags.length === 0) return null;
  
  return (
    <div className="selected-tags-container">
      <div className="selected-tags">
        {selectedTags.map(tagSlug => {
          const tag = allTags.find(t => t.slug === tagSlug);
          if (!tag) return null;
          const tagName = currentLang === 'zh' ? tag.nameTranslated : tag.name;
          return (
            <Tooltip key={tagSlug} content={tagName}>
              <div className="selected-tag">
                <span>{tagName}</span>
                <button onClick={() => toggleTag(tagSlug)}>×</button>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <Tooltip content={t('filters.clearAll')}>
        <button className="clear-all" onClick={clearFilters}>{t('filters.clearAll')}</button>
      </Tooltip>
    </div>
  );
};

export default SelectedTags; 