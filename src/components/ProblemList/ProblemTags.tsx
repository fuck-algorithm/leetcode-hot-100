import React from 'react';
import Tooltip from '../Tooltip';
import './ProblemTags.css';

// 问题标签组件接口
export interface ProblemTagsProps {
  tags: Array<{name: string, nameTranslated: string, slug: string}>;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  currentLang: string;
}

const ProblemTags: React.FC<ProblemTagsProps> = ({ tags, selectedTags, toggleTag, currentLang }) => {
  // 最多显示3个标签
  const displayTags = tags.slice(0, 3);
  
  return (
    <div className="problem-tags">
      {displayTags.map((tag, index) => {
        const tagName = currentLang === 'zh' ? tag.nameTranslated : tag.name;
        return (
          <Tooltip key={index} content={tagName}>
            <span 
              className={`problem-tag ${selectedTags.includes(tag.slug) ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleTag(tag.slug);
              }}
            >
              {tagName}
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ProblemTags; 