import React, { useEffect, useState, useCallback } from 'react';
import { experienceStorage, ExperienceRecord, calculateLevelProgress } from '../../services/experienceStorage';
import './ExperienceBar.css';

interface ExperienceBarProps {
  currentLang: string;
  refreshTrigger?: number; // 用于触发刷新
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ currentLang, refreshTrigger }) => {
  const [experience, setExperience] = useState<ExperienceRecord>({
    id: 'total',
    totalExp: 0,
    level: 1,
    lastUpdated: Date.now()
  });
  const [showExpGain, setShowExpGain] = useState(false);
  const [expGainAmount, setExpGainAmount] = useState(0);

  const loadExperience = useCallback(async () => {
    try {
      const exp = await experienceStorage.getTotalExperience();
      setExperience(exp);
    } catch (error) {
      console.error('加载经验值失败:', error);
    }
  }, []);

  useEffect(() => {
    loadExperience();
  }, [loadExperience, refreshTrigger]);

  // 监听经验值变化事件
  useEffect(() => {
    const handleExpChange = (event: CustomEvent<{ amount: number; newExp: ExperienceRecord }>) => {
      const { amount, newExp } = event.detail;
      setExperience(newExp);
      
      // 显示经验值获取动画
      if (amount > 0) {
        setExpGainAmount(amount);
        setShowExpGain(true);
        setTimeout(() => setShowExpGain(false), 2000);
      }
    };

    window.addEventListener('expChange', handleExpChange as EventListener);
    return () => {
      window.removeEventListener('expChange', handleExpChange as EventListener);
    };
  }, []);

  const levelProgress = calculateLevelProgress(experience.totalExp);
  const expToNextLevel = 100 - levelProgress;

  return (
    <div className="experience-bar-container">
      <div className="experience-bar-content">
        {/* 等级徽章 */}
        <div className="level-badge">
          <span className="level-icon">⭐</span>
          <span className="level-number">{experience.level}</span>
        </div>
        
        {/* 经验条 */}
        <div className="exp-bar-wrapper">
          <div className="exp-bar-track">
            <div 
              className="exp-bar-fill"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="exp-bar-text">
            <span className="exp-current">{experience.totalExp} EXP</span>
            <span className="exp-next">
              {currentLang === 'zh' 
                ? `距下一级还需 ${expToNextLevel} EXP`
                : `${expToNextLevel} EXP to next level`
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* 经验值获取动画 */}
      {showExpGain && (
        <div className="exp-gain-popup">
          +{expGainAmount} EXP
        </div>
      )}
    </div>
  );
};

export default ExperienceBar;
