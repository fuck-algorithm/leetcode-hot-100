import React, { useState, useEffect, useCallback } from 'react';
import { experienceStorage, TREASURE_EXP } from '../../../services/experienceStorage';
import './TreasureNode.css';

interface TreasureNodeProps {
  treasureId: string;
  stageNumber: number;
  canOpen: boolean; // 是否可以开启（前面的题目都完成了）
  currentLang: string;
  onOpen?: (treasureId: string, expAwarded: number) => void;
}

// 有趣的宝箱名称 - 江湖/休闲风格
const TREASURE_NAMES_ZH = [
  '新手礼包',
  '江湖秘宝',
  '武林宝箱',
  '藏经阁宝',
  '掌门赏赐',
  '神秘宝藏',
  '绝世秘籍',
  '天外飞仙',
  '至尊宝箱',
  '传说宝藏',
  '仙界馈赠',
  '鸿蒙秘宝',
  '混沌宝箱',
  '创世神藏',
  '终极宝藏'
];

const TREASURE_NAMES_EN = [
  'Starter Pack',
  'Martial Treasure',
  'Warrior\'s Chest',
  'Secret Archive',
  'Master\'s Gift',
  'Mystery Treasure',
  'Legendary Scroll',
  'Celestial Box',
  'Supreme Chest',
  'Epic Treasure',
  'Divine Gift',
  'Primordial Box',
  'Chaos Treasure',
  'Genesis Vault',
  'Ultimate Treasure'
];

// 宝箱开启后的祝福语
const BLESSING_ZH = [
  '恭喜少侠！',
  '功德圆满！',
  '修为大进！',
  '福缘深厚！',
  '天道酬勤！'
];

const BLESSING_EN = [
  'Congratulations!',
  'Well done!',
  'Great progress!',
  'Fortune favors you!',
  'Hard work pays off!'
];

const TreasureNode: React.FC<TreasureNodeProps> = ({
  treasureId,
  stageNumber,
  canOpen,
  currentLang,
  onOpen
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [blessing, setBlessing] = useState('');

  // 获取宝箱名称
  const getTreasureName = () => {
    const names = currentLang === 'zh' ? TREASURE_NAMES_ZH : TREASURE_NAMES_EN;
    const index = Math.min(stageNumber - 1, names.length - 1);
    return names[index];
  };

  // 获取随机祝福语
  const getRandomBlessing = () => {
    const blessings = currentLang === 'zh' ? BLESSING_ZH : BLESSING_EN;
    return blessings[Math.floor(Math.random() * blessings.length)];
  };

  // 加载宝箱状态
  useEffect(() => {
    const loadTreasureState = async () => {
      try {
        const opened = await experienceStorage.isTreasureOpened(treasureId);
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
      const { treasure, newExp } = await experienceStorage.openTreasure(treasureId);
      
      // 播放开启动画
      setTimeout(() => {
        setIsOpened(true);
        setIsOpening(false);
        setShowReward(true);
        
        // 触发经验值变化事件
        window.dispatchEvent(new CustomEvent('expChange', {
          detail: { amount: TREASURE_EXP, newExp }
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
  }, [canOpen, isOpened, isOpening, treasureId, onOpen, currentLang]);

  // 确定宝箱状态类名
  const getStatusClass = () => {
    if (isOpened) return 'opened';
    if (isOpening) return 'opening';
    if (canOpen) return 'ready';
    return 'locked';
  };

  // 获取宝箱图标 - 始终显示宝箱
  const getTreasureIcon = () => {
    if (isOpened) return '📭'; // 已开启的空宝箱
    if (isOpening) return '✨'; // 开启中的特效
    return '🎁'; // 未开启的宝箱（无论是否可开启）
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
        
        {/* 宝箱图标 */}
        <div className="treasure-icon">
          {getTreasureIcon()}
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
            : `+${TREASURE_EXP} EXP`
          }
        </span>
      </div>
      
      {/* 奖励弹出 */}
      {showReward && (
        <div className="treasure-reward-popup">
          <span className="reward-blessing">{blessing}</span>
          <span className="reward-text">+{TREASURE_EXP} EXP</span>
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
