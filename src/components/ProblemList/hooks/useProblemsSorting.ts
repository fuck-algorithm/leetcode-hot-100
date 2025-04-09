import { useState, useMemo, useEffect } from 'react';
import { Problem, SortOption, LegacySortOption } from '../types';

// 排序字段映射
const SORT_FIELD_MAP: Record<LegacySortOption, string> = {
  '默认': '',
  '难度': 'difficulty',
  '通过率': 'acRate',
  '题号': 'questionFrontendId',
  '标签': 'tags',
};

// 内部排序选项类型
interface InternalSortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// 将传统排序选项转换为内部排序选项格式
const convertLegacySort = (legacySort: LegacySortOption): InternalSortOption => {
  return {
    field: SORT_FIELD_MAP[legacySort] || '',
    direction: 'asc'
  };
};

// 获取排序后的值
const getSortValue = (problem: Problem, field: string): any => {
  switch (field) {
    case 'questionFrontendId':
      return parseInt(problem.questionFrontendId, 10);
    case 'title':
      return problem.title;
    case 'difficulty':
      return problem.difficulty;
    case 'acRate':
      // 直接使用acRate作为number
      return problem.acRate;
    default:
      return problem[field as keyof Problem] || '';
  }
};

// 比较函数
const compareValues = (a: any, b: any, direction: 'asc' | 'desc'): number => {
  if (a === b) return 0;
  
  const comparison = a < b ? -1 : 1;
  return direction === 'asc' ? comparison : -comparison;
};

interface UseProblemsSortingProps {
  problems: Problem[];
  setProblems?: React.Dispatch<React.SetStateAction<Problem[]>>;
}

export const useProblemsSorting = ({ problems }: UseProblemsSortingProps) => {
  // 从localStorage恢复状态或使用默认值
  const getStoredValue = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // 排序状态 - 使用localStorage中存储的值进行初始化
  const [internalSortOption, setInternalSortOption] = useState<InternalSortOption>(() => {
    const storedField = getStoredValue<string>('sortField', '');
    const storedDirection = getStoredValue<'asc' | 'desc'>('sortDirection', 'asc');
    return { field: storedField, direction: storedDirection };
  });
  
  // 添加菜单显示状态
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  // 当排序选项变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('sortField', JSON.stringify(internalSortOption.field));
    localStorage.setItem('sortDirection', JSON.stringify(internalSortOption.direction));
  }, [internalSortOption]);

  // 处理排序变更
  const handleSortChange = (field: string) => {
    setInternalSortOption(prev => {
      if (prev.field === field) {
        // 切换排序方向
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      // 设置新的排序字段，默认升序
      return { field, direction: 'asc' };
    });
  };

  // 设置传统格式的排序
  const setLegacySort = (legacyOption: LegacySortOption) => {
    const field = SORT_FIELD_MAP[legacyOption] || '';
    
    // 如果点击了已选中的排序选项，则切换排序方向
    if (field === internalSortOption.field) {
      setInternalSortOption(prev => ({
        ...prev,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      // 否则使用默认的升序
      setInternalSortOption({
        field,
        direction: 'asc'
      });
    }
  };

  // 处理排序选项的点击
  const sortProblems = (option: LegacySortOption) => {
    setLegacySort(option);
    setShowSortMenu(false); // 选择排序选项后关闭菜单
  };

  // 获取排序后的问题列表
  const sortedProblems = useMemo(() => {
    if (!internalSortOption.field) return [...problems];
    
    return [...problems].sort((a, b) => {
      const aValue = getSortValue(a, internalSortOption.field);
      const bValue = getSortValue(b, internalSortOption.field);
      return compareValues(aValue, bValue, internalSortOption.direction);
    });
  }, [problems, internalSortOption]);

  // 渲染排序指示器
  const renderSortIndicator = (field: string) => {
    if (internalSortOption.field !== field) return null;
    return internalSortOption.direction === 'asc' ? '↑' : '↓';
  };

  // 为了兼容性，当前排序选项使用字符串形式表示
  const currentSort = useMemo<LegacySortOption>(() => {
    // 反向查找排序字段对应的传统选项
    const entry = Object.entries(SORT_FIELD_MAP).find(([_, value]) => value === internalSortOption.field);
    return entry ? entry[0] as LegacySortOption : '默认';
  }, [internalSortOption]);

  // 排序方向指示器的别名
  const renderSortDirectionIndicator = (option: LegacySortOption) => {
    if (SORT_FIELD_MAP[option] === internalSortOption.field) {
      return internalSortOption.direction === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  return {
    sortOption: internalSortOption,
    sortedProblems,
    handleSortChange,
    setLegacySort,
    renderSortIndicator,
    // 为了兼容性添加的属性
    currentSort,
    showSortMenu,
    setShowSortMenu,
    sortProblems,
    renderSortDirectionIndicator
  };
};

export default useProblemsSorting;