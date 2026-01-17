import React from 'react';
import ReactDOM from 'react-dom';
import './RealmHelpTooltip.css';

// 修仙境界称号系统
interface RealmInfo {
  name: string;
  nameEn: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  icon: string;
}

// 境界数据
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 3, color: '#78716c', icon: '🌱' },
  { name: '筑基期', nameEn: 'Foundation', minLevel: 4, maxLevel: 6, color: '#22c55e', icon: '🌿' },
  { name: '金丹期', nameEn: 'Golden Core', minLevel: 7, maxLevel: 9, color: '#eab308', icon: '💫' },
  { name: '元婴期', nameEn: 'Nascent Soul', minLevel: 10, maxLevel: 12, color: '#f97316', icon: '🔥' },
  { name: '化神期', nameEn: 'Spirit Severing', minLevel: 13, maxLevel: 15, color: '#ef4444', icon: '⚡' },
  { name: '炼虚期', nameEn: 'Void Refining', minLevel: 16, maxLevel: 18, color: '#a855f7', icon: '🌀' },
  { name: '合体期', nameEn: 'Body Integration', minLevel: 19, maxLevel: 21, color: '#6366f1', icon: '💎' },
  { name: '大乘期', nameEn: 'Mahayana', minLevel: 22, maxLevel: 24, color: '#ec4899', icon: '🌸' },
  { name: '渡劫期', nameEn: 'Tribulation', minLevel: 25, maxLevel: 27, color: '#14b8a6', icon: '⛈️' },
  { name: '大罗金仙', nameEn: 'Golden Immortal', minLevel: 28, maxLevel: 30, color: '#fbbf24', icon: '👑' },
  { name: '飞升成仙', nameEn: 'Ascension', minLevel: 31, maxLevel: 999, color: '#ff6b9d', icon: '🚀' },
];

interface RealmHelpTooltipProps {
  currentLang: string;
  currentLevel: number;
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}

// 计算达到某个境界所需的总经验值
export const calculateExpForRealm = (realm: RealmInfo): number => {
  return (realm.minLevel - 1) * 100;
};

// 计算达到某个境界的推荐刷题数量
export const calculateProblemEstimate = (totalExp: number): {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
} => {
  if (totalExp <= 0) {
    return { easyCount: 0, mediumCount: 0, hardCount: 0 };
  }
  
  // 基于 LeetCode Hot 100 的题目分布和经验值
  // Easy: 10 EXP, Medium: 20 EXP, Hard: 30 EXP
  // 实际分布: Easy 20题, Medium 68题, Hard 12题
  // 题目总经验: 1920 EXP
  // 宝箱总经验: ~1150 EXP (23个宝箱 * 50 EXP)
  // 总经验: 3070 EXP
  
  // 计算题目经验占比
  const TOTAL_PROBLEM_EXP = 1920; // 100题的总经验
  const TOTAL_TREASURE_EXP = 1150; // 宝箱总经验
  const TOTAL_EXP = TOTAL_PROBLEM_EXP + TOTAL_TREASURE_EXP; // 3070
  
  // 根据总经验值按比例计算题目数量
  const problemRatio = totalExp / TOTAL_EXP;
  let totalProblems = Math.round(100 * problemRatio); // 使用四舍五入而不是向上取整
  
  // 确保最高境界显示100题
  if (totalExp >= 3000 && totalProblems < 100) {
    totalProblems = 100;
  }
  
  // 按 Hot 100 实际比例分配: Easy 20%, Medium 68%, Hard 12%
  // 使用四舍五入确保总数正确
  const easyCount = Math.round(totalProblems * 0.2);
  const mediumCount = Math.round(totalProblems * 0.68);
  const hardCount = totalProblems - easyCount - mediumCount; // 用减法确保总数准确
  
  return {
    easyCount,
    mediumCount,
    hardCount
  };
};

// 根据等级获取当前境界
const getRealmByLevel = (level: number): RealmInfo => {
  for (const realm of REALMS) {
    if (level >= realm.minLevel && level <= realm.maxLevel) {
      return realm;
    }
  }
  return REALMS[REALMS.length - 1];
};

const RealmHelpTooltip: React.FC<RealmHelpTooltipProps> = ({
  currentLang,
  currentLevel,
  isVisible,
  anchorRect
}) => {
  if (!isVisible) return null;

  const isZh = currentLang === 'zh';
  const currentRealm = getRealmByLevel(currentLevel);

  const texts = {
    title: isZh ? '修仙境界系统' : 'Cultivation Realm System',
    expRule: isZh ? '经验值规则' : 'EXP Rules',
    easy: isZh ? '简单' : 'Easy',
    medium: isZh ? '中等' : 'Medium',
    hard: isZh ? '困难' : 'Hard',
    treasure: isZh ? '宝箱' : 'Treasure',
    expPerProblem: isZh ? '每题经验' : 'EXP per problem',
    levelRange: isZh ? '等级' : 'Level',
    requiredExp: isZh ? '所需EXP' : 'Required EXP',
    estimatedProblems: isZh ? '预估刷题' : 'Est. Problems',
    current: isZh ? '当前' : 'Current',
    start: isZh ? '起始' : 'Start',
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
        <h3 className="tooltip-title">{texts.title}</h3>
      </div>
      
      {/* 经验值规则说明 */}
      <div className="exp-rules">
        <div className="exp-rule-title">{texts.expRule}</div>
        <div className="exp-rule-items">
          <span className="exp-rule-item easy">
            {texts.easy}: 10 EXP
          </span>
          <span className="exp-rule-item medium">
            {texts.medium}: 20 EXP
          </span>
          <span className="exp-rule-item hard">
            {texts.hard}: 30 EXP
          </span>
          <span className="exp-rule-item treasure">
            {texts.treasure}: 50 EXP
          </span>
        </div>
      </div>

      {/* 境界列表 */}
      <div className="realm-list">
        {REALMS.map((realm, index) => {
          const expRequired = calculateExpForRealm(realm);
          const estimate = calculateProblemEstimate(expRequired);
          const isCurrent = realm.name === currentRealm.name;
          const realmName = isZh ? realm.name : realm.nameEn;
          
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
                  {isCurrent && <span className="current-badge">{texts.current}</span>}
                </div>
              </div>
              <div className="realm-item-right">
                <div className="realm-item-level">
                  Lv.{realm.minLevel}-{realm.maxLevel === 999 ? '∞' : realm.maxLevel}
                </div>
                <div className="realm-item-exp">
                  {expRequired === 0 ? texts.start : `${expRequired} EXP`}
                </div>
                {expRequired > 0 && (
                  <div className="realm-item-estimate">
                    ~{estimate.easyCount + estimate.mediumCount + estimate.hardCount}{isZh ? '题' : ' problems'}
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
