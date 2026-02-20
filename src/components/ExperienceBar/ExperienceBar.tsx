import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { experienceAdapter } from '../../services/experience-adapter';
import { ExperienceRecord } from '../../services/experienceStorage';
import RealmHelpTooltip from './RealmHelpTooltip';
import ShareModal from '../ShareModal';
import { learningPaths } from '../ProblemList/data/learningPaths';
import { useCompletionStatus } from '../ProblemList/hooks/useCompletionStatus';
import './ExperienceBar.css';

interface ExperienceBarProps {
  currentLang: string;
  refreshTrigger?: number; // 用于触发刷新
  // 新增：题目完成进度
  completedProblems?: number;
  totalProblems?: number;
}

// 修仙境界称号系统
interface RealmInfo {
  name: string;
  nameEn: string;
  translationKey: string;
  color: string;
  icon: string;
  bgGradient: string;
}

// 玄幻修仙风格 - 深色背景配金色主题
// 新系统：11个境界，基于realm索引（0-10）
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', translationKey: 'qiRefining', color: '#78716c', icon: '🌱', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '筑基期', nameEn: 'Foundation', translationKey: 'foundation', color: '#22c55e', icon: '🌿', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '金丹期', nameEn: 'Golden Core', translationKey: 'goldenCore', color: '#eab308', icon: '💫', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '元婴期', nameEn: 'Nascent Soul', translationKey: 'nascentSoul', color: '#f97316', icon: '🔥', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '化神期', nameEn: 'Spirit Severing', translationKey: 'spiritSevering', color: '#ef4444', icon: '⚡', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '炼虚期', nameEn: 'Void Refining', translationKey: 'voidRefining', color: '#a855f7', icon: '🌀', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '合体期', nameEn: 'Body Integration', translationKey: 'bodyIntegration', color: '#6366f1', icon: '💎', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '大乘期', nameEn: 'Mahayana', translationKey: 'mahayana', color: '#ec4899', icon: '🌸', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '渡劫期', nameEn: 'Tribulation', translationKey: 'tribulation', color: '#14b8a6', icon: '⛈️', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '大罗金仙', nameEn: 'Golden Immortal', translationKey: 'goldenImmortal', color: '#fbbf24', icon: '👑', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
  { name: '飞升仙界', nameEn: 'Ascension', translationKey: 'ascension', color: '#fde68a', icon: '✨', bgGradient: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)' },
];

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentLang,
  refreshTrigger,
  completedProblems = 0,
  totalProblems = 100
}) => {
  const { t } = useTranslation();
  const [experience, setExperience] = useState<ExperienceRecord>({
    id: 'total',
    totalExp: 0,
    level: 1,
    lastUpdated: Date.now()
  });
  const [showExpGain, setShowExpGain] = useState(false);
  const [expGainAmount, setExpGainAmount] = useState(0);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [helpIconRect, setHelpIconRect] = useState<DOMRect | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const helpIconRef = useRef<HTMLDivElement>(null);

  const { getStatsForProblems } = useCompletionStatus();

  const loadExperience = useCallback(async () => {
    try {
      const exp = await experienceAdapter.getTotalExperience();
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

  // 使用新的realm系统
  const currentRealmIndex = experienceAdapter.getCurrentRealm(experience.totalExp);
  const realmProgress = experienceAdapter.getRealmProgress(experience.totalExp);
  const expToNextRealm = experienceAdapter.getExperienceToNextRealm(experience.totalExp);
  
  // 获取当前realm信息（realm索引0-10对应REALMS数组）
  const currentRealm = REALMS[Math.min(currentRealmIndex, REALMS.length - 1)];
  const nextRealm = currentRealmIndex < REALMS.length - 1 ? REALMS[currentRealmIndex + 1] : null;
  
  // 计算当前等级进度（用于进度条显示）
  const levelProgress = realmProgress;
  const expToNextLevel = expToNextRealm;
  
  // 生成称号文本：直接使用境界名称，不再有"层"的概念
  const realmName = t(`realms.${currentRealm.translationKey}`);
  const realmTitle = realmName;

  // 计算题目完成百分比
  const problemPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  // 准备路径进度数据
  const getPathProgress = useCallback(() => {
    return learningPaths.map(path => {
      const stats = getStatsForProblems([]);
      return {
        id: path.id,
        name: path.name,
        nameEn: path.nameEn,
        icon: path.icon,
        color: path.color,
        completed: 0,
        total: 10
      };
    });
  }, [getStatsForProblems]);

  return (
    <div className="experience-bar-container">
      <div className="experience-bar-content">
        {/* 境界徽章和帮助图标 */}
        <div className="realm-section">
          <div className="realm-badge">
            <span className="realm-icon">{currentRealm.icon}</span>
            <div className="realm-info">
              <span className="realm-name" style={{ color: currentRealm.color, textShadow: `0 0 10px ${currentRealm.color}80` }}>{realmTitle}</span>
            </div>
          </div>
          
          {/* 帮助图标 */}
          <div 
            className="help-icon-wrapper"
            ref={helpIconRef}
            onMouseEnter={() => {
              if (helpIconRef.current) {
                setHelpIconRect(helpIconRef.current.getBoundingClientRect());
              }
              setShowHelpTooltip(true);
            }}
            onMouseLeave={() => setShowHelpTooltip(false)}
          >
            <button className="help-icon" aria-label={t('experience.viewRealmInfo')}>
              ?
            </button>
            <RealmHelpTooltip
              currentLang={currentLang}
              totalExp={experience.totalExp}
              isVisible={showHelpTooltip}
              anchorRect={helpIconRect}
            />
          </div>
        </div>
        
        {/* 进度区域 */}
        <div className="progress-section">
          {/* 分享按钮 */}
          <button
            className="share-button"
            onClick={() => setShowShareModal(true)}
            aria-label={t('share.shareProgress', '分享进度')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>{t('share.share', '分享')}</span>
          </button>

          {/* 题目完成进度 */}
          <div className="problem-progress">
            <div className="problem-progress-info">
              <span className="problem-progress-text">
                <span className="problem-completed">{completedProblems}</span>
                <span className="problem-separator">/</span>
                <span className="problem-total">{totalProblems}</span>
              </span>
              <span className="problem-percentage">{problemPercentage}%</span>
            </div>
            <div className="problem-progress-track">
              <div
                className="problem-progress-fill"
                style={{ width: `${problemPercentage}%` }}
              />
            </div>
          </div>

          {/* 经验条 */}
          <div className="exp-bar-wrapper">
            <div className="exp-bar-track">
              <div
                className="exp-bar-fill"
                style={{ width: `${levelProgress}%` }}
              />
              <div className="exp-bar-shine"></div>
            </div>
            <div className="exp-bar-text">
              <span className="exp-current">{experience.totalExp.toLocaleString()} {t('experience.exp')}</span>
              <span className="exp-next">
                {nextRealm
                  ? t('experience.toNextRealm', {
                      realm: t(`realms.${nextRealm.translationKey}`),
                      exp: expToNextRealm.toLocaleString()
                    })
                  : t('experience.toNextLevel', { exp: expToNextLevel.toLocaleString() })
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 经验值获取动画 */}
      {showExpGain && (
        <div className="exp-gain-popup">
          +{expGainAmount.toLocaleString()} {t('experience.exp')}
        </div>
      )}

      {/* 分享弹窗 */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        currentLang={currentLang}
        totalExp={experience.totalExp}
        currentRealm={{
          name: currentRealm.name,
          nameEn: currentRealm.nameEn,
          icon: currentRealm.icon,
          color: currentRealm.color
        }}
        realmProgress={realmProgress}
        expToNextRealm={expToNextRealm}
        completedProblems={completedProblems}
        totalProblems={totalProblems}
        pathProgress={getPathProgress()}
      />
    </div>
  );
};

export default ExperienceBar;
