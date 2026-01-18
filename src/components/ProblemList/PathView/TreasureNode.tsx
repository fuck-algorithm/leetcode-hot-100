import React, { useState, useEffect, useCallback } from 'react';
import { experienceAdapter } from '../../../services/experience-adapter';
import './TreasureNode.css';

interface TreasureNodeProps {
  treasureId: string;
  stageNumber: number;
  canOpen: boolean; // 是否可以开启（前面的题目都完成了）
  currentLang: string;
  onOpen?: (treasureId: string, expAwarded: number) => void;
  isEndpoint?: boolean; // 是否为终点宝箱
}

// 宝箱名称 - 神兵利器/仙家法宝风格（按等级递进）
const TREASURE_NAMES_ZH = [
  '碧水剑',        // 入门级法剑，清灵之气
  '赤霄刀',        // 初阶神兵，火焰之力
  '紫电锤',        // 雷属性兵器
  '玄铁重盾',      // 防御型神兵
  '破军枪',        // 攻击型长兵
  '七星龙渊',      // 名剑，星辰之力
  '天罡剑阵',      // 剑阵法宝
  '乾坤圈',        // 束缚型法宝
  '风火轮',        // 移动型法宝
  '混天绫',        // 防御型法宝
  '定海神针',      // 如意金箍棒
  '诛仙剑',        // 上古神剑
  '太极图',        // 先天至宝
  '山河社稷图',    // 洪荒至宝
  '造化玉碟'       // 天道至宝
];

const TREASURE_NAMES_EN = [
  'Azure Water Sword',
  'Crimson Sky Blade',
  'Purple Thunder Hammer',
  'Dark Iron Shield',
  'Army Breaker Spear',
  'Seven Star Dragon Abyss',
  'Heavenly Sword Formation',
  'Universe Ring',
  'Wind Fire Wheels',
  'Sky Silk',
  'Sea Calming Needle',
  'Immortal Slaying Sword',
  'Taiji Diagram',
  'Land & River Map',
  'Creation Jade Disc'
];

// 宝箱开启后的祝福语 - 神兵利器风格
const BLESSING_ZH = [
  '神兵入手！',
  '法宝认主！',
  '剑意通灵！',
  '天赐神兵！',
  '得此利器！'
];

const BLESSING_EN = [
  'Divine weapon acquired!',
  'Artifact bound!',
  'Sword spirit awakened!',
  'Heaven-sent treasure!',
  'Legendary gear obtained!'
];

// 终点宝箱特殊名称
const ENDPOINT_NAME_ZH = '通关宝箱';
const ENDPOINT_NAME_EN = 'Completion Chest';

const TreasureNode: React.FC<TreasureNodeProps> = ({
  treasureId,
  stageNumber,
  canOpen,
  currentLang,
  onOpen,
  isEndpoint = false
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [blessing, setBlessing] = useState('');
  const [treasureExp, setTreasureExp] = useState(0);

  // 获取宝箱经验值
  useEffect(() => {
    const exp = experienceAdapter.getTreasureExperience(treasureId);
    setTreasureExp(exp);
  }, [treasureId]);

  // 获取宝箱名称
  const getTreasureName = () => {
    // 终点宝箱使用特殊名称
    if (isEndpoint) {
      return currentLang === 'zh' ? ENDPOINT_NAME_ZH : ENDPOINT_NAME_EN;
    }
    const names = currentLang === 'zh' ? TREASURE_NAMES_ZH : TREASURE_NAMES_EN;
    const index = Math.min(stageNumber - 1, names.length - 1);
    return names[index];
  };

  // 获取随机祝福语
  const getRandomBlessing = useCallback(() => {
    const blessings = currentLang === 'zh' ? BLESSING_ZH : BLESSING_EN;
    return blessings[Math.floor(Math.random() * blessings.length)];
  }, [currentLang]);

  // 加载宝箱状态
  useEffect(() => {
    const loadTreasureState = async () => {
      try {
        const opened = await experienceAdapter.isTreasureOpened(treasureId);
        setIsOpened(opened);
      } catch (error) {
        console.error('加载宝箱状态失败:', error);
      }
    };
    loadTreasureState();
  }, [treasureId]);

  // 开启宝箱
  const handleOpenTreasure = useCallback(async () => {
    if (!canOpen || isOpened || isOpening) return;
    
    setIsOpening(true);
    setBlessing(getRandomBlessing());
    
    try {
      const { treasure, newExp } = await experienceAdapter.openTreasure(treasureId);
      
      // 播放开启动画
      setTimeout(() => {
        setIsOpened(true);
        setIsOpening(false);
        setShowReward(true);
        
        // 触发经验值变化事件
        window.dispatchEvent(new CustomEvent('expChange', {
          detail: { amount: treasure.expAwarded, newExp }
        }));
        
        // 回调
        if (onOpen) {
          onOpen(treasureId, treasure.expAwarded);
        }
        
        // 隐藏奖励提示
        setTimeout(() => setShowReward(false), 2500);
      }, 800);
    } catch (error) {
      console.error('开启宝箱失败:', error);
      setIsOpening(false);
    }
  }, [canOpen, isOpened, isOpening, treasureId, onOpen, getRandomBlessing]);

  // 确定宝箱状态类名
  const getStatusClass = () => {
    if (isOpened) return 'opened';
    if (isOpening) return 'opening';
    if (canOpen) return 'ready';
    return 'locked';
  };

  // 获取宝箱状态类名
  const getTreasureIconClass = () => {
    if (isOpened) return 'treasure-icon opened';
    if (isOpening) return 'treasure-icon opening';
    return 'treasure-icon';
  };

  return (
    <div className={`treasure-node ${getStatusClass()}`}>
      {/* 宝箱主体 */}
      <div 
        className="treasure-box"
        onClick={handleOpenTreasure}
        role="button"
        tabIndex={canOpen && !isOpened ? 0 : -1}
        aria-label={
          isOpened 
            ? (currentLang === 'zh' ? '已开启的宝箱' : 'Opened treasure')
            : canOpen 
              ? (currentLang === 'zh' ? '点击开启宝箱' : 'Click to open treasure')
              : (currentLang === 'zh' ? '完成前面的题目解锁' : 'Complete previous problems to unlock')
        }
      >
        {/* 锁定遮罩 - 仅在锁定状态显示 */}
        {!canOpen && !isOpened && (
          <div className="treasure-lock-overlay">
            <span className="lock-icon">🔒</span>
          </div>
        )}
        
        {/* 宝箱图标 - CSS绘制的精美宝箱 */}
        <div className={getTreasureIconClass()}>
          {/* 宝箱盖子 */}
          <div className="treasure-chest-lid"></div>
          {/* 宝箱主体 */}
          <div className="treasure-chest-body"></div>
          {/* 金属锁扣 */}
          <div className="treasure-icon-lock"></div>
          {/* 角落装饰 */}
          <div className="treasure-corner top-left"></div>
          <div className="treasure-corner top-right"></div>
          {/* 开启中的闪光 */}
          {isOpening && <span className="opening-sparkle">✨</span>}
        </div>
        
        {/* 宝箱光效 */}
        {canOpen && !isOpened && !isOpening && (
          <div className="treasure-glow"></div>
        )}
        
        {/* 开启动画 */}
        {isOpening && (
          <div className="treasure-opening-effect">
            <span className="sparkle">✨</span>
            <span className="sparkle">⭐</span>
            <span className="sparkle">💫</span>
            <span className="sparkle">🌟</span>
          </div>
        )}
      </div>
      
      {/* 宝箱名称标签 */}
      <div className="treasure-label">
        <span className="treasure-name">
          {getTreasureName()}
        </span>
        <span className="treasure-reward">
          {isOpened 
            ? (currentLang === 'zh' ? '✓ 已领取' : '✓ Claimed')
            : `+${treasureExp.toLocaleString()} EXP`
          }
        </span>
      </div>
      
      {/* 奖励弹出 */}
      {showReward && (
        <div className="treasure-reward-popup">
          <span className="reward-blessing">{blessing}</span>
          <span className="reward-text">+{treasureExp.toLocaleString()} EXP</span>
        </div>
      )}
      
      {/* 锁定提示 */}
      {!canOpen && !isOpened && (
        <div className="treasure-lock-hint">
          {currentLang === 'zh' 
            ? '🗡️ 继续修炼解锁'
            : '🗡️ Keep practicing to unlock'
          }
        </div>
      )}
    </div>
  );
};

export default TreasureNode;
