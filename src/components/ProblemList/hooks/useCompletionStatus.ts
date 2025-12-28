import { useState, useEffect, useCallback } from 'react';
import { completionStorage, CompletionRecord } from '../../../services/completionStorage';
import { experienceStorage, DIFFICULTY_EXP, ExperienceRecord } from '../../../services/experienceStorage';

interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

interface UseCompletionStatusReturn {
  completions: Map<string, CompletionRecord>;
  isLoading: boolean;
  toggleCompletion: (problemId: string, difficulty?: 'EASY' | 'MEDIUM' | 'HARD') => Promise<void>;
  isCompleted: (problemId: string) => boolean;
  resetAllProgress: () => Promise<void>;
  getStatsForProblems: (problemIds: string[]) => CompletionStats;
  refreshCompletions: () => Promise<void>;
  experience: ExperienceRecord;
}

export function useCompletionStatus(): UseCompletionStatusReturn {
  const [completions, setCompletions] = useState<Map<string, CompletionRecord>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [experience, setExperience] = useState<ExperienceRecord>({
    id: 'total',
    totalExp: 0,
    level: 1,
    lastUpdated: Date.now()
  });

  // 加载所有完成状态
  const loadCompletions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await completionStorage.getAllCompletions();
      setCompletions(data);
      
      // 同时加载经验值
      const exp = await experienceStorage.getTotalExperience();
      setExperience(exp);
    } catch (error) {
      console.error('加载完成状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化时加载数据
  useEffect(() => {
    loadCompletions();
  }, [loadCompletions]);

  // 切换完成状态
  const toggleCompletion = useCallback(async (problemId: string, difficulty?: 'EASY' | 'MEDIUM' | 'HARD') => {
    const currentRecord = completions.get(problemId);
    const newCompleted = !(currentRecord?.completed ?? false);
    
    try {
      await completionStorage.setCompletion(problemId, newCompleted);
      
      // 更新经验值
      if (difficulty) {
        const expAmount = DIFFICULTY_EXP[difficulty];
        let newExp: ExperienceRecord;
        
        if (newCompleted) {
          // 完成题目，增加经验值
          newExp = await experienceStorage.addExperience(expAmount);
          
          // 触发经验值变化事件
          window.dispatchEvent(new CustomEvent('expChange', {
            detail: { amount: expAmount, newExp }
          }));
        } else {
          // 取消完成，减少经验值
          newExp = await experienceStorage.removeExperience(expAmount);
          
          // 触发经验值变化事件（负数表示减少）
          window.dispatchEvent(new CustomEvent('expChange', {
            detail: { amount: -expAmount, newExp }
          }));
        }
        
        setExperience(newExp);
      }
      
      // 更新本地状态
      setCompletions(prev => {
        const newMap = new Map(prev);
        newMap.set(problemId, {
          problemId,
          completed: newCompleted,
          completedAt: newCompleted ? Date.now() : null
        });
        return newMap;
      });
    } catch (error) {
      console.error('更新完成状态失败:', error);
    }
  }, [completions]);

  // 检查是否已完成
  const isCompleted = useCallback((problemId: string): boolean => {
    return completions.get(problemId)?.completed ?? false;
  }, [completions]);

  // 重置所有进度
  const resetAllProgress = useCallback(async () => {
    try {
      await completionStorage.clearAll();
      await experienceStorage.resetAll();
      setCompletions(new Map());
      setExperience({
        id: 'total',
        totalExp: 0,
        level: 1,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('重置进度失败:', error);
      throw error;
    }
  }, []);

  // 获取指定题目列表的统计信息
  const getStatsForProblems = useCallback((problemIds: string[]): CompletionStats => {
    const total = problemIds.length;
    let completed = 0;
    
    problemIds.forEach(id => {
      if (completions.get(id)?.completed) {
        completed++;
      }
    });
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [completions]);

  // 刷新完成状态
  const refreshCompletions = useCallback(async () => {
    await loadCompletions();
  }, [loadCompletions]);

  return {
    completions,
    isLoading,
    toggleCompletion,
    isCompleted,
    resetAllProgress,
    getStatsForProblems,
    refreshCompletions,
    experience
  };
}

export default useCompletionStatus;
