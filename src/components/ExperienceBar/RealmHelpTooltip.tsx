import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { experienceAdapter } from '../../services/experience-adapter';
import './RealmHelpTooltip.css';

// 修仙境界称号系统
interface RealmInfo {
  name: string;
  nameEn: string;
  translationKey: string;
  color: string;
  icon: string;
  threshold: number; // 该境界的起始经验值阈值
}

// 境界阈值配置（从 experience-config.json 同步）
const REALM_THRESHOLDS = [
  0,       // 练气期
  50000,   // 筑基期
  120000,  // 金丹期
  210000,  // 元婴期
  320000,  // 化神期
  450000,  // 炼虚期
  600000,  // 合体期
  770000,  // 大乘期
  900000,  // 渡劫期
  950000,  // 大罗金仙
  1000000  // 飞升仙界
];

// 经验值配置（从 experience-config.json 同步）
const EXP_CONFIG = {
  easy: 5000,
  medium: 8000,
  hard: 12000,
  treasure: 15000, // 早期宝箱
  totalExperience: 1000000
};

// 境界数据 - 使用新的经验值系统
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', translationKey: 'qiRefining', color: '#78716c', icon: '🌱', threshold: REALM_THRESHOLDS[0] },
  { name: '筑基期', nameEn: 'Foundation', translationKey: 'foundation', color: '#22c55e', icon: '🌿', threshold: REALM_THRESHOLDS[1] },
  { name: '金丹期', nameEn: 'Golden Core', translationKey: 'goldenCore', color: '#eab308', icon: '💫', threshold: REALM_THRESHOLDS[2] },
  { name: '元婴期', nameEn: 'Nascent Soul', translationKey: 'nascentSoul', color: '#f97316', icon: '🔥', threshold: REALM_THRESHOLDS[3] },
  { name: '化神期', nameEn: 'Spirit Severing', translationKey: 'spiritSevering', color: '#ef4444', icon: '⚡', threshold: REALM_THRESHOLDS[4] },
  { name: '炼虚期', nameEn: 'Void Refining', translationKey: 'voidRefining', color: '#a855f7', icon: '🌀', threshold: REALM_THRESHOLDS[5] },
  { name: '合体期', nameEn: 'Body Integration', translationKey: 'bodyIntegration', color: '#6366f1', icon: '💎', threshold: REALM_THRESHOLDS[6] },
  { name: '大乘期', nameEn: 'Mahayana', translationKey: 'mahayana', color: '#ec4899', icon: '🌸', threshold: REALM_THRESHOLDS[7] },
  { name: '渡劫期', nameEn: 'Tribulation', translationKey: 'tribulation', color: '#14b8a6', icon: '⛈️', threshold: REALM_THRESHOLDS[8] },
  { name: '大罗金仙', nameEn: 'Golden Immortal', translationKey: 'goldenImmortal', color: '#fbbf24', icon: '👑', threshold: REALM_THRESHOLDS[9] },
  { name: '飞升仙界', nameEn: 'Ascension', translationKey: 'ascension', color: '#fde68a', icon: '✨', threshold: REALM_THRESHOLDS[10] },
];

interface RealmHelpTooltipProps {
  currentLang: string;
  totalExp: number; // 使用经验值而不是等级
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}

// 获取配置的经验值
const getExpConfig = () => {
  return EXP_CONFIG;
};

// 计算达到某个境界所需的总经验值
export const calculateExpForRealm = (realm: RealmInfo): number => {
  return realm.threshold;
};

// 计算达到某个境界的推荐刷题数量（基于新的经验值系统）
export const calculateProblemEstimate = (totalExp: number): {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
} => {
  if (totalExp <= 0) {
    return { easyCount: 0, mediumCount: 0, hardCount: 0 };
  }
  
  const expConfig = getExpConfig();
  
  // 基于 LeetCode Hot 100 的题目分布
  // 实际分布: Easy 20题, Medium 68题, Hard 12题
  const EASY_RATIO = 0.2;
  const MEDIUM_RATIO = 0.68;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const HARD_RATIO = 0.12; // 保留用于文档说明，hardCount通过减法计算
  
  // 100万经验值对应100题（满级）
  // 按比例计算当前经验值对应的题目数量
  const totalProblems = Math.round((totalExp / expConfig.totalExperience) * 100);
  
  // 按 Hot 100 实际比例分配
  const easyCount = Math.round(totalProblems * EASY_RATIO);
  const mediumCount = Math.round(totalProblems * MEDIUM_RATIO);
  const hardCount = totalProblems - easyCount - mediumCount;
  
  return {
    easyCount,
    mediumCount,
    hardCount
  };
};

const RealmHelpTooltip: React.FC<RealmHelpTooltipProps> = ({
  currentLang,
  totalExp,
  isVisible,
  anchorRect
}) => {
  const { t } = useTranslation();
  
  if (!isVisible) return null;

  // 使用 experienceAdapter 计算当前境界索引
  const currentRealmIndex = experienceAdapter.getCurrentRealm(totalExp);
  const expConfig = getExpConfig();

  // 格式化经验值显示（使用千位分隔符）
  const formatExp = (exp: number): string => {
    return exp.toLocaleString();
  };

  // 计算弹窗位置
  const tooltipStyle: React.CSSProperties = anchorRect ? {
    position: 'fixed',
    top: anchorRect.bottom + 12,
    left: anchorRect.left + anchorRect.width / 2,
    transform: 'translateX(-50%)',
  } : {};

  const tooltipContent = (
    <div className="realm-help-tooltip" style={tooltipStyle}>
      <div className="tooltip-header">
        <h3 className="tooltip-title">{t('realms.systemTitle')}</h3>
      </div>
      
      {/* 经验值规则说明 */}
      <div className="exp-rules">
        <div className="exp-rule-title">{t('realms.expRules')}</div>
        <div className="exp-rule-items">
          <span className="exp-rule-item easy">
            {t('realms.easy')}: {formatExp(expConfig.easy)} {t('experience.exp')}
          </span>
          <span className="exp-rule-item medium">
            {t('realms.medium')}: {formatExp(expConfig.medium)} {t('experience.exp')}
          </span>
          <span className="exp-rule-item hard">
            {t('realms.hard')}: {formatExp(expConfig.hard)} {t('experience.exp')}
          </span>
          <span className="exp-rule-item treasure">
            {t('realms.treasure')}: {formatExp(expConfig.treasure)} {t('experience.exp')}
          </span>
        </div>
      </div>

      {/* 境界列表 */}
      <div className="realm-list">
        {REALMS.map((realm, index) => {
          const expRequired = calculateExpForRealm(realm);
          const estimate = calculateProblemEstimate(expRequired);
          const isCurrent = index === currentRealmIndex;
          const realmName = t(`realms.${realm.translationKey}`);
          
          return (
            <div 
              key={index} 
              className={`realm-item ${isCurrent ? 'current' : ''}`}
              style={{ borderLeftColor: realm.color }}
            >
              <div className="realm-item-left">
                <span className="realm-item-icon">{realm.icon}</span>
                <div className="realm-item-info">
                  <span className="realm-item-name">{realmName}</span>
                  {isCurrent && <span className="current-badge">{t('realms.current')}</span>}
                </div>
              </div>
              <div className="realm-item-right">
                <div className="realm-item-exp">
                  {expRequired === 0 ? t('realms.start') : `${formatExp(expRequired)} ${t('experience.exp')}`}
                </div>
                {expRequired > 0 && (
                  <div className="realm-item-estimate">
                    ~{estimate.easyCount + estimate.mediumCount + estimate.hardCount}{t('realms.problems')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body
  return ReactDOM.createPortal(tooltipContent, document.body);
};

export default RealmHelpTooltip;
