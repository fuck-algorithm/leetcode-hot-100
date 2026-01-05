import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import ToastContainer from '../ToastContainer';
import { useToast } from '../../hooks/useToast';
import OverallProgressBar from './OverallProgressBar';
import ExperienceBar from '../ExperienceBar';
import { Problem } from './types';

interface ProblemListProps {
  viewMode?: ViewMode;
}

const ProblemList: React.FC<ProblemListProps> = ({ viewMode: propViewMode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathId } = useParams<{ pathId?: string }>();
  
  // 从location state获取需要滚动到的路径ID
  const scrollToPathId = (location.state as { scrollToPathId?: string })?.scrollToPathId;
  
  // Toast 通知
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
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
  
  // 处理返回路径概览 - 传递当前路径ID用于定位
  const handleBackToOverview = useCallback(() => {
    // 使用state传递需要滚动到的路径ID
    navigate('/path', { state: { scrollToPathId: pathId } });
  }, [navigate, pathId]);
  
  // 重置确认对话框状态
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // 使用自定义hooks加载和管理数据
  const { problems, setProblems, allTags } = useProblemsData();
  
  // 使用完成状态hook
  const {
    isCompleted,
    toggleCompletion,
    resetAllProgress,
    resetPathProgress,
    getStatsForProblems,
    refreshCompletions,
    experience
  } = useCompletionStatus();
  
  // 创建一个包装函数，用于在切换完成状态时传递难度
  const problemsMap = React.useMemo(() => {
    const map = new Map<string, Problem>();
    problems.forEach(p => map.set(p.questionFrontendId, p));
    return map;
  }, [problems]);
  
  const handleToggleCompletion = useCallback(async (problemId: string) => {
    const problem = problemsMap.get(problemId);
    const difficulty = problem?.difficulty as 'EASY' | 'MEDIUM' | 'HARD' | undefined;
    await toggleCompletion(problemId, difficulty);
  }, [toggleCompletion, problemsMap]);
  
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
    completionFilter,
    setCompletionFilter,
    toggleTag,
    clearFilters,
    filteredProblems
  } = useProblemsFiltering({ 
    problems: sortedProblems,
    allTags, 
    currentLang: i18n.language,
    isCompleted
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
      
      // 显示成功提示
      showSuccess(t('resetProgress.success'));
      
      // 刷新完成状态，确保页面重新绘制
      await refreshCompletions();
      
      // 强制重新渲染组件
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('重置进度失败:', error);
      showError('重置进度失败，请重试');
    }
  };
  
  return (
    <div className="problem-list-container">
      {/* 视图模式切换区域 */}
      <div className="view-mode-row">
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
      </div>
      
      {/* 搜索筛选区域 - 仅在列表模式下显示 */}
      {viewMode === 'list' && (
        <div className="search-filter-row">
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
            completionFilter={completionFilter}
            onCompletionFilterChange={setCompletionFilter}
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
        </div>
      )}
      
      {/* 经验值条 - 仅在路径视图显示（已整合题目进度） */}
      {viewMode === 'path' && (
        <ExperienceBar 
          currentLang={i18n.language}
          refreshTrigger={experience.totalExp}
          completedProblems={getStatsForProblems(problems.map(p => p.questionFrontendId)).completed}
          totalProblems={problems.length}
        />
      )}
      
      {/* 整体进度条 - 仅在列表视图显示 */}
      {viewMode === 'list' && (
        <OverallProgressBar 
          completed={getStatsForProblems(problems.map(p => p.questionFrontendId)).completed}
          total={problems.length}
          t={t}
        />
      )}
      
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
                onToggleCompletion={handleToggleCompletion}
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
          onToggleCompletion={handleToggleCompletion}
          getStatsForProblems={getStatsForProblems}
          selectedPathId={pathId}
          onPathClick={handlePathClick}
          onBackToOverview={handleBackToOverview}
          onResetPathProgress={resetPathProgress}
          scrollToPathId={scrollToPathId}
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

      {/* Toast 通知容器 */}
      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};

export default ProblemList;
