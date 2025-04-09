import React, { useRef, useEffect } from 'react';
import '../ProblemList.css';
import { useTranslation } from '../../i18n/useCustomTranslation';
import SearchFilter from './SearchFilter';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import SelectedTags from './SelectedTags';
import TableHeader from './TableHeader';
import ProblemItem from './ProblemItem';
import { useProblemsData } from './hooks/useProblemsData';
import { useProblemsSorting } from './hooks/useProblemsSorting';
import { useProblemsFiltering } from './hooks/useProblemsFiltering';
import { handleAnimationClick } from './utils/animationUtils';
import { getSortOptionText } from './utils/localeUtils';

const ProblemList: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // 使用自定义hooks加载和管理数据
  const { problems, setProblems, allTags } = useProblemsData();
  
  // 使用自定义hooks处理排序逻辑
  const { 
    currentSort, 
    showSortMenu, 
    setShowSortMenu,
    sortProblems, 
    renderSortDirectionIndicator,
    sortedProblems
  } = useProblemsSorting({ problems, setProblems });
  
  // 使用自定义hooks处理筛选逻辑
  const { 
    searchTerm, 
    setSearchTerm,
    selectedTags,
    showFilterMenu,
    setShowFilterMenu,
    showAnimationOnly,
    setShowAnimationOnly,
    toggleTag,
    clearFilters,
    filteredProblems
  } = useProblemsFiltering({ 
    problems: sortedProblems, // 使用排序后的问题列表
    allTags, 
    currentLang: i18n.language 
  });

  // 创建引用来保存菜单和按钮的DOM元素
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // 添加点击事件监听器，处理点击空白区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 如果排序菜单可见且点击位置不在排序菜单或排序按钮上
      if (
        showSortMenu && 
        sortMenuRef.current && 
        !sortMenuRef.current.contains(event.target as Node) && 
        sortButtonRef.current && 
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }

      // 如果筛选菜单可见且点击位置不在筛选菜单或筛选按钮上
      if (
        showFilterMenu && 
        filterMenuRef.current && 
        !filterMenuRef.current.contains(event.target as Node) && 
        filterButtonRef.current && 
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu, showFilterMenu, setShowSortMenu, setShowFilterMenu]);
  
  // 用于调试的effect
  useEffect(() => {
    console.log('当前排序状态:', currentSort, '排序后问题数量:', sortedProblems.length);
  }, [currentSort, sortedProblems]);
  
  return (
    <div className="problem-list-container">
      {/* 搜索筛选区域 */}
      <SearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showAnimationOnly={showAnimationOnly}
        setShowAnimationOnly={setShowAnimationOnly}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        currentSort={currentSort}
        t={t}
        sortButtonRef={sortButtonRef}
        filterButtonRef={filterButtonRef}
      >
        {/* 排序菜单 */}
        <SortMenu 
          visible={showSortMenu}
          currentSort={currentSort}
          sortProblems={sortProblems}
          getSortOptionText={(option) => getSortOptionText(option, t)}
          renderSortDirectionIndicator={renderSortDirectionIndicator}
          t={t}
          ref={sortMenuRef}
        />
        
        {/* 标签筛选菜单 */}
        <FilterMenu 
          visible={showFilterMenu}
          selectedTags={selectedTags}
          allTags={allTags}
          toggleTag={toggleTag}
          clearFilters={clearFilters}
          currentLang={i18n.language}
          t={t}
          ref={filterMenuRef}
        />
      </SearchFilter>
      
      {/* 已选标签列表 */}
      <SelectedTags 
        selectedTags={selectedTags}
        allTags={allTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
        currentLang={i18n.language}
        t={t}
      />
      
      {/* 表格标题行 */}
      <TableHeader 
        t={t} 
        currentSort={currentSort}
        onSortChange={sortProblems}
        renderSortDirectionIndicator={renderSortDirectionIndicator}
      />
      
      {/* 问题列表 */}
      <div className="problems-container">
        {filteredProblems.map(problem => (
          <ProblemItem 
            key={problem.id}
            problem={problem}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            handleAnimationClick={handleAnimationClick}
            currentLang={i18n.language}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

export default ProblemList; 