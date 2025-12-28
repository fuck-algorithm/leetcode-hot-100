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

// 中文数字转换
const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const getChineseNumber = (num: number): string => {
  if (num <= 0) return '一';
  if (num <= 10) return chineseNumbers[num - 1];
  if (num < 20) return '十' + (num === 10 ? '' : chineseNumbers[num - 11]);
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return chineseNumbers[tens - 1] + '十' + (ones === 0 ? '' : chineseNumbers[ones - 1]);
  }
  return num.toString();
};

// 纯白色背景 - 与页面整体风格一致
// 经验值系统说明：
// - 100道题目总经验值约1920 EXP (EASY:10×20=200, MEDIUM:20×68=1360, HARD:30×12=360)
// - 14个学习路径的宝箱总经验值约1150 EXP (23个宝箱×50)
// - 总计约3070 EXP，对应约31级
// - 境界系统设计为每个境界3层，共10个境界，确保用户能达到最终境界
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 3, color: '#78716c', icon: '🌱', bgGradient: '#ffffff' },
  { name: '筑基期', nameEn: 'Foundation', minLevel: 4, maxLevel: 6, color: '#22c55e', icon: '🌿', bgGradient: '#ffffff' },
  { name: '金丹期', nameEn: 'Golden Core', minLevel: 7, maxLevel: 9, color: '#eab308', icon: '💫', bgGradient: '#ffffff' },
  { name: '元婴期', nameEn: 'Nascent Soul', minLevel: 10, maxLevel: 12, color: '#f97316', icon: '🔥', bgGradient: '#ffffff' },
  { name: '化神期', nameEn: 'Spirit Severing', minLevel: 13, maxLevel: 15, color: '#ef4444', icon: '⚡', bgGradient: '#ffffff' },
  { name: '炼虚期', nameEn: 'Void Refining', minLevel: 16, maxLevel: 18, color: '#a855f7', icon: '🌀', bgGradient: '#ffffff' },
  { name: '合体期', nameEn: 'Body Integration', minLevel: 19, maxLevel: 21, color: '#6366f1', icon: '💎', bgGradient: '#ffffff' },
  { name: '大乘期', nameEn: 'Mahayana', minLevel: 22, maxLevel: 24, color: '#ec4899', icon: '🌸', bgGradient: '#ffffff' },
  { name: '渡劫期', nameEn: 'Tribulation', minLevel: 25, maxLevel: 27, color: '#14b8a6', icon: '⛈️', bgGradient: '#ffffff' },
  { name: '大罗金仙', nameEn: 'Golden Immortal', minLevel: 28, maxLevel: 999, color: '#fbbf24', icon: '👑', bgGradient: '#ffffff' },
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
  
  // 计算当前境界内的层数
  const layerInRealm = experience.level - currentRealm.minLevel + 1;
  // 生成称号文本：中文用"练气期一层"格式，英文用"Qi Refining Layer 1"格式
  const realmTitle = currentLang === 'zh' 
    ? `${currentRealm.name}${getChineseNumber(layerInRealm)}层`
    : `${currentRealm.nameEn} Layer ${layerInRealm}`;

  return (
    <div className="experience-bar-container" style={{ background: currentRealm.bgGradient }}>
      <div className="experience-bar-content">
        {/* 境界徽章 */}
        <div className="realm-badge" style={{ borderColor: currentRealm.color }}>
          <span className="realm-icon">{currentRealm.icon}</span>
          <div className="realm-info">
            <span className="realm-name">{realmTitle}</span>
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
