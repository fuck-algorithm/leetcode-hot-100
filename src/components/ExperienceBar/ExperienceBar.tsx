import React, { useEffect, useState, useCallback } from 'react';
import { experienceStorage, ExperienceRecord, calculateLevelProgress } from '../../services/experienceStorage';
import './ExperienceBar.css';

interface ExperienceBarProps {
  currentLang: string;
  refreshTrigger?: number; // 用于触发刷新
}

// 修仙境界称号系统
interface RealmInfo {
  name: string;
  nameEn: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  icon: string;
  bgGradient: string;
}

// 纯白色背景 - 与页面整体风格一致
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 5, color: '#78716c', icon: '🌱', bgGradient: '#ffffff' },
  { name: '筑基期', nameEn: 'Foundation', minLevel: 6, maxLevel: 10, color: '#22c55e', icon: '🌿', bgGradient: '#ffffff' },
  { name: '金丹期', nameEn: 'Golden Core', minLevel: 11, maxLevel: 20, color: '#eab308', icon: '💫', bgGradient: '#ffffff' },
  { name: '元婴期', nameEn: 'Nascent Soul', minLevel: 21, maxLevel: 35, color: '#f97316', icon: '🔥', bgGradient: '#ffffff' },
  { name: '化神期', nameEn: 'Spirit Severing', minLevel: 36, maxLevel: 50, color: '#ef4444', icon: '⚡', bgGradient: '#ffffff' },
  { name: '炼虚期', nameEn: 'Void Refining', minLevel: 51, maxLevel: 70, color: '#a855f7', icon: '🌀', bgGradient: '#ffffff' },
  { name: '合体期', nameEn: 'Body Integration', minLevel: 71, maxLevel: 90, color: '#6366f1', icon: '💎', bgGradient: '#ffffff' },
  { name: '大乘期', nameEn: 'Mahayana', minLevel: 91, maxLevel: 100, color: '#ec4899', icon: '🌸', bgGradient: '#ffffff' },
  { name: '渡劫期', nameEn: 'Tribulation', minLevel: 101, maxLevel: 150, color: '#14b8a6', icon: '⛈️', bgGradient: '#ffffff' },
  { name: '大罗金仙', nameEn: 'Golden Immortal', minLevel: 151, maxLevel: 999, color: '#fbbf24', icon: '👑', bgGradient: '#ffffff' },
];

// 根据等级获取境界信息
const getRealmByLevel = (level: number): RealmInfo => {
  for (const realm of REALMS) {
    if (level >= realm.minLevel && level <= realm.maxLevel) {
      return realm;
    }
  }
  return REALMS[REALMS.length - 1]; // 默认返回最高境界
};

// 获取下一个境界信息
const getNextRealm = (level: number): RealmInfo | null => {
  const currentRealm = getRealmByLevel(level);
  const currentIndex = REALMS.findIndex(r => r.name === currentRealm.name);
  if (currentIndex < REALMS.length - 1) {
    return REALMS[currentIndex + 1];
  }
  return null;
};

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
  const currentRealm = getRealmByLevel(experience.level);
  const nextRealm = getNextRealm(experience.level);
  const realmName = currentLang === 'zh' ? currentRealm.name : currentRealm.nameEn;

  return (
    <div className="experience-bar-container" style={{ background: currentRealm.bgGradient }}>
      <div className="experience-bar-content">
        {/* 境界徽章 */}
        <div className="realm-badge" style={{ borderColor: currentRealm.color }}>
          <span className="realm-icon">{currentRealm.icon}</span>
          <div className="realm-info">
            <span className="realm-name">{realmName}</span>
            <span className="realm-level">Lv.{experience.level}</span>
          </div>
        </div>
        
        {/* 经验条 */}
        <div className="exp-bar-wrapper">
          <div className="exp-bar-track">
            <div 
              className="exp-bar-fill"
              style={{ 
                width: `${levelProgress}%`,
                background: `linear-gradient(90deg, ${currentRealm.color} 0%, ${currentRealm.color}cc 100%)`
              }}
            />
            <div className="exp-bar-shine"></div>
          </div>
          <div className="exp-bar-text">
            <span className="exp-current">{experience.totalExp} EXP</span>
            <span className="exp-next">
              {nextRealm 
                ? (currentLang === 'zh' 
                    ? `距 ${nextRealm.name} 还需 ${(nextRealm.minLevel - experience.level) * 100 - levelProgress} EXP`
                    : `${(nextRealm.minLevel - experience.level) * 100 - levelProgress} EXP to ${nextRealm.nameEn}`)
                : (currentLang === 'zh' 
                    ? `距下一级还需 ${expToNextLevel} EXP`
                    : `${expToNextLevel} EXP to next level`)
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* 经验值获取动画 */}
      {showExpGain && (
        <div className="exp-gain-popup" style={{ background: currentRealm.bgGradient }}>
          +{expGainAmount} EXP
        </div>
      )}
    </div>
  );
};

export default ExperienceBar;
