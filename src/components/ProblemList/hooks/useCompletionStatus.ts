import { useState, useEffect, useCallback } from 'react';
import { completionStorage, CompletionRecord } from '../../../services/completionStorage';
import { experienceStorage, DIFFICULTY_EXP, ExperienceRecord } from '../../../services/experienceStorage';

interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

// 题目信息，用于重置时计算经验值
interface ProblemInfo {
  problemId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface UseCompletionStatusReturn {
  completions: Map<string, CompletionRecord>;
  isLoading: boolean;
  toggleCompletion: (problemId: string, difficulty?: 'EASY' | 'MEDIUM' | 'HARD') => Promise<void>;
  isCompleted: (problemId: string) => boolean;
  resetAllProgress: () => Promise<void>;
  resetPathProgress: (pathId: string, problems: ProblemInfo[]) => Promise<void>;
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

  // 重置单个学习路径的进度
  const resetPathProgress = useCallback(async (pathId: string, problems: ProblemInfo[]) => {
    try {
      // 计算需要扣除的经验值
      let expToRemove = 0;
      const problemsToReset: string[] = [];
      
      problems.forEach(problem => {
        if (completions.get(problem.problemId)?.completed) {
          problemsToReset.push(problem.problemId);
          expToRemove += DIFFICULTY_EXP[problem.difficulty];
        }
      });
      
      // 如果没有已完成的题目，直接返回
      if (problemsToReset.length === 0) {
        return;
      }
      
      // 批量重置完成状态
      await completionStorage.setCompletions(
        problemsToReset.map(id => ({ problemId: id, completed: false }))
      );
      
      // 扣除经验值
      const newExp = await experienceStorage.removeExperience(expToRemove);
      
      // 重置该路径相关的宝箱（如果有的话）
      // 宝箱ID格式: 'path-{pathId}-stage-{stageIndex}' 或 'detail-{pathId}-stage-{stageIndex}'
      const treasures = await experienceStorage.getAllOpenedTreasures();
      const pathTreasures = treasures.filter(t => 
        t.treasureId.includes(`path-${pathId}-`) || 
        t.treasureId.includes(`detail-${pathId}-`)
      );
      
      // 扣除宝箱经验值
      let treasureExpToRemove = 0;
      for (const treasure of pathTreasures) {
        treasureExpToRemove += treasure.expAwarded;
      }
      
      let finalExp = newExp;
      if (treasureExpToRemove > 0) {
        finalExp = await experienceStorage.removeExperience(treasureExpToRemove);
        // 重置宝箱状态
        await experienceStorage.resetPathTreasures(pathId);
      }
      
      // 更新本地状态
      setCompletions(prev => {
        const newMap = new Map(prev);
        problemsToReset.forEach(id => {
          newMap.set(id, {
            problemId: id,
            completed: false,
            completedAt: null
          });
        });
        return newMap;
      });
      
      setExperience(finalExp);
      
      // 触发经验值变化事件
      window.dispatchEvent(new CustomEvent('expChange', {
        detail: { amount: -(expToRemove + treasureExpToRemove), newExp: finalExp }
      }));
      
    } catch (error) {
      console.error('重置路径进度失败:', error);
      throw error;
    }
  }, [completions]);

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
    resetPathProgress,
    getStatsForProblems,
    refreshCompletions,
    experience
  };
}

export default useCompletionStatus;
