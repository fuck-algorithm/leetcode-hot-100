import { LegacySortOption } from '../types';

// 根据排序选项和当前语言获取显示文本
export const getSortOptionText = (option: LegacySortOption, t: (key: string) => string): string => {
  switch(option) {
    case '默认': return t('sorting.default');
    case '难度': return t('sorting.difficulty');
    case '通过率': return t('sorting.passRate');
    case '题号': return t('sorting.problemId');
    case '标签': return t('sorting.tags');
    default: return String(option);
  }
};

// 获取排序提示文本
export const getSortTooltip = (currentSort: LegacySortOption, t: (key: string) => string): string => {
  return t(`sorting.${
    currentSort === '默认' ? 'default' : 
    currentSort === '难度' ? 'difficulty' : 
    currentSort === '通过率' ? 'passRate' : 
    currentSort === '题号' ? 'problemId' : 'tags'
  }`);
}; 