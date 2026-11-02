import React, { useMemo, useState } from 'react';
import AscensionOrb from './AscensionOrb';
import GoalCard from './GoalCard';
import GoalEditor from './GoalEditor';
import { useAscensionGoal } from './useAscensionGoal';
import { PRESET_COMPANIES, DisplayInfo } from './types';
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
  const [isHovered, setIsHovered] = useState(false);
  const {
    goal,
    editingGoal,
    setEditingGoal,
    isEditing,
    customLogoImage,
    startEditing,
    cancelEdit,
    saveGoal,
  } = useAscensionGoal();

  const isComplete = completionPercentage >= 100;

  const displayInfo = useMemo<DisplayInfo>(() => {
    if (goal.companyId) {
      const preset = PRESET_COMPANIES.find(company => company.id === goal.companyId);
      if (preset) {
        return {
          name: currentLang === 'zh' ? preset.name : preset.nameEn,
          logo: preset.logo,
          logoImage: null,
          color: preset.color,
        };
      }
    }

    return {
      name: goal.customName || (currentLang === 'zh' ? '设置目标' : 'Set Goal'),
      logo: goal.customLogo || '🎯',
      logoImage: customLogoImage,
      color: goal.color || '#FFD700',
    };
  }, [goal, currentLang, customLogoImage]);

  const handleActivate = () => {
    if (!isEditing) startEditing();
  };

  return (
    <div
      className={`ascension-node ${isEditing ? 'editing' : ''} ${
        isComplete ? 'is-complete' : ''
      }`}
      style={{ '--ascension-color': displayInfo.color } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="ascension-label">
        {isComplete
          ? (currentLang === 'zh' ? '🎉 已飞升' : '🎉 Ascended')
          : (currentLang === 'zh' ? '🚀 飞升目标' : '🚀 Ascension Goal')}
      </div>

      <AscensionOrb
        goal={goal}
        displayInfo={displayInfo}
        completionPercentage={completionPercentage}
        isComplete={isComplete}
        onActivate={handleActivate}
      />

      <GoalCard
        displayInfo={displayInfo}
        goal={goal}
        currentLang={currentLang}
        completedProblems={completedProblems}
        totalProblems={totalProblems}
        completionPercentage={completionPercentage}
        isHovered={isHovered}
        isEditing={isEditing}
        isComplete={isComplete}
        onEdit={handleActivate}
      />

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
