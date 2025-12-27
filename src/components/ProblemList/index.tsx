import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../ProblemList.css';
import { useTranslation } from '../../i18n/useCustomTranslation';
import SearchFilter from './SearchFilter';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import SelectedTags from './SelectedTags';
import TableHeader from './TableHeader';
import ProblemItem from './ProblemItem';
import ViewModeSwitch, { ViewMode } from './ViewModeSwitch';
import PathView from './PathView';
import { useProblemsData } from './hooks/useProblemsData';
import { useProblemsSorting } from './hooks/useProblemsSorting';
import { useProblemsFiltering } from './hooks/useProblemsFiltering';
import { useCompletionStatus } from './hooks/useCompletionStatus';
import { handleAnimationClick } from './utils/animationUtils';
import { getSortOptionText } from './utils/localeUtils';
import ResetProgressButton from './ResetProgressButton';
import ConfirmDialog from './ConfirmDialog';

interface ProblemListProps {
  viewMode?: ViewMode;
}

const ProblemList: React.FC<ProblemListProps> = ({ viewMode: propViewMode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathId } = useParams<{ pathId?: string }>();
  
  // 视图模式状态 - 从props获取
  const viewMode = propViewMode || 'path';
  
  // 处理视图模式变化
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    if (mode === 'list') {
      navigate('/list');
    } else {
      navigate('/path');
    }
  }, [navigate]);
  
  // 处理路径点击 - 导航到路径详情页
  const handlePathClick = useCallback((clickedPathId: string) => {
    navigate(`/path/${clickedPathId}`);
  }, [navigate]);
  
  // 处理返回路径概览
  const handleBackToOverview = useCallback(() => {
    navigate('/path');
  }, [navigate]);
  
  // 重置确认对话框状态
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // 使用自定义hooks加载和管理数据
  const { problems, setProblems, allTags } = useProblemsData();
  
  // 使用完成状态hook
  const {
    isCompleted,
    toggleCompletion,
    resetAllProgress,
    getStatsForProblems
  } = useCompletionStatus();
  
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
    problems: sortedProblems,
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
      if (
        showSortMenu && 
        sortMenuRef.current && 
        !sortMenuRef.current.contains(event.target as Node) && 
        sortButtonRef.current && 
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }

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

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu, showFilterMenu, setShowSortMenu, setShowFilterMenu]);

  // 处理重置进度
  const handleResetProgress = async () => {
    try {
      await resetAllProgress();
      setShowResetDialog(false);
    } catch (error) {
      console.error('重置进度失败:', error);
    }
  };
  
  return (
    <div className="problem-list-container">
      {/* 视图模式切换和搜索筛选区域 */}
      <div className="view-mode-and-search">
        <ViewModeSwitch 
          currentMode={viewMode}
          onModeChange={handleViewModeChange}
          t={t}
        />
        
        {/* 重新开始按钮 */}
        <ResetProgressButton 
          onClick={() => setShowResetDialog(true)}
          t={t}
        />
        
        {/* 搜索筛选区域 - 仅在列表模式下显示 */}
        {viewMode === 'list' && (
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
        )}
      </div>
      
      {/* 列表视图 */}
      {viewMode === 'list' && (
        <>
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
                isCompleted={isCompleted(problem.questionFrontendId)}
                onToggleCompletion={toggleCompletion}
              />
            ))}
          </div>
        </>
      )}
      
      {/* 路径视图 */}
      {viewMode === 'path' && (
        <PathView 
          problems={problems}
          currentLang={i18n.language}
          t={t}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          handleAnimationClick={handleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={toggleCompletion}
          getStatsForProblems={getStatsForProblems}
          selectedPathId={pathId}
          onPathClick={handlePathClick}
          onBackToOverview={handleBackToOverview}
        />
      )}

      {/* 重置确认对话框 */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title={t('resetProgress.title')}
        message={t('resetProgress.message')}
        confirmText={t('resetProgress.confirm')}
        cancelText={t('resetProgress.cancel')}
        onConfirm={handleResetProgress}
        onCancel={() => setShowResetDialog(false)}
        danger
      />
    </div>
  );
};

export default ProblemList;
