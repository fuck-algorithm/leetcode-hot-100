import React, { useState, useEffect, useCallback } from 'react';
import ProgressRing from './ProgressRing';
import InfoCard from './InfoCard';
import GoalEditor from './GoalEditor';
import { CompanyLogo } from './CompanyLogos';
import { 
  AscensionGoal, 
  DEFAULT_GOAL, 
  STORAGE_KEY, 
  PRESET_COMPANIES,
  DisplayInfo 
} from './types';
import './styles.css';

// 导出类型供外部使用
export type { AscensionGoal, PresetCompany } from './types';
export { PRESET_COMPANIES } from './types';

interface AscensionNodeProps {
  currentLang: string;
  completionPercentage: number; // 整体完成进度 0-100
  totalProblems: number;
  completedProblems: number;
}

const AscensionNode: React.FC<AscensionNodeProps> = ({
  currentLang,
  completionPercentage,
  totalProblems,
  completedProblems,
}) => {
  const [goal, setGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [isHovered, setIsHovered] = useState(false);

  // 加载保存的目标
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setGoal(parsed);
        setEditingGoal(parsed);
      }
    } catch (error) {
      console.error('加载飞升目标失败:', error);
    }
  }, []);

  // 保存目标
  const saveGoal = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editingGoal));
      setGoal(editingGoal);
      setIsEditing(false);
    } catch (error) {
      console.error('保存飞升目标失败:', error);
    }
  }, [editingGoal]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditingGoal(goal);
    setIsEditing(false);
  }, [goal]);

  // 获取当前显示的公司信息
  const getDisplayInfo = useCallback((): DisplayInfo => {
    if (goal.companyId) {
      const preset = PRESET_COMPANIES.find(c => c.id === goal.companyId);
      if (preset) {
        return {
          name: currentLang === 'zh' ? preset.name : preset.nameEn,
          logo: preset.logo,
          color: preset.color,
        };
      }
    }
    return {
      name: goal.customName || (currentLang === 'zh' ? '设置目标' : 'Set Goal'),
      logo: goal.customLogo || '🎯',
      color: goal.color || '#FFD700',
    };
  }, [goal, currentLang]);

  const displayInfo = getDisplayInfo();

  return (
    <div 
      className={`ascension-node ${isEditing ? 'editing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 飞升标签 */}
      <div className="ascension-label">
        🚀 {currentLang === 'zh' ? '飞升目标' : 'Ascension Goal'}
      </div>

      {/* 主节点 */}
      <div 
        className="ascension-main"
        style={{ '--ascension-color': displayInfo.color } as React.CSSProperties}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {/* 进度环 */}
        <ProgressRing 
          percentage={completionPercentage} 
          color={displayInfo.color} 
        />

        {/* 节点内容 */}
        <div 
          className="ascension-content"
          style={{ backgroundColor: '#ffffff' }}
        >
          <span className="ascension-logo">
            {goal.companyId ? (
              <CompanyLogo companyId={goal.companyId} size={72} />
            ) : (
              displayInfo.logo
            )}
          </span>
        </div>

        {/* 飞升光效 */}
        {completionPercentage === 100 && (
          <div className="ascension-glow"></div>
        )}
      </div>

      {/* 节点信息卡片 */}
      <InfoCard
        displayInfo={displayInfo}
        goal={goal}
        currentLang={currentLang}
        completedProblems={completedProblems}
        totalProblems={totalProblems}
        completionPercentage={completionPercentage}
        isHovered={isHovered}
        isEditing={isEditing}
        onEdit={() => !isEditing && setIsEditing(true)}
      />

      {/* 编辑弹窗 */}
      {isEditing && (
        <GoalEditor
          currentLang={currentLang}
          editingGoal={editingGoal}
          setEditingGoal={setEditingGoal}
          onSave={saveGoal}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default AscensionNode;
