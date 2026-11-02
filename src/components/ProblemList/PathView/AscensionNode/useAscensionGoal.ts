import { useCallback, useEffect, useState } from 'react';
import { AscensionGoal, DEFAULT_GOAL, STORAGE_KEY } from './types';
import { logoImageDB } from './logoImageDB';

/**
 * 飞升目标的持久化逻辑：localStorage 存配置，IndexedDB 存自定义 Logo 图片。
 */
export const useAscensionGoal = () => {
  const [goal, setGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [editingGoal, setEditingGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [isEditing, setIsEditing] = useState(false);
  const [customLogoImage, setCustomLogoImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved) as AscensionGoal;
        if (cancelled) return;

        setGoal(parsed);
        setEditingGoal(parsed);

        if (parsed.companyId === null && parsed.customLogoImage) {
          const imageData = await logoImageDB.getLogoImage('custom-logo');
          if (!cancelled && imageData) {
            setCustomLogoImage(imageData);
          }
        }
      } catch (error) {
        console.error('加载飞升目标失败:', error);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const startEditing = useCallback(() => {
    setEditingGoal(goal);
    setIsEditing(true);
  }, [goal]);

  const cancelEdit = useCallback(() => {
    setEditingGoal(goal);
    setIsEditing(false);
  }, [goal]);

  const saveGoal = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editingGoal));
      setGoal(editingGoal);
      setCustomLogoImage(editingGoal.companyId === null ? editingGoal.customLogoImage : null);
      setIsEditing(false);
    } catch (error) {
      console.error('保存飞升目标失败:', error);
    }
  }, [editingGoal]);

  return {
    goal,
    editingGoal,
    setEditingGoal,
    isEditing,
    customLogoImage,
    startEditing,
    cancelEdit,
    saveGoal,
  };
};
