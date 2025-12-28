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
  }, [canOpen, isOpened, isOpening, treasureId, onOpen]);

  // 确定宝箱状态类名
  const getStatusClass = () => {
    if (isOpened) return 'opened';
    if (isOpening) return 'opening';
    if (canOpen) return 'ready';
    return 'locked';
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
        {/* 宝箱图标 */}
        <div className="treasure-icon">
          {isOpened ? '📦' : isOpening ? '✨' : canOpen ? '🎁' : '🔐'}
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
            <span className="sparkle">✨</span>
          </div>
        )}
      </div>
      
      {/* 阶段标签 */}
      <div className="treasure-label">
        <span className="treasure-stage">
          {currentLang === 'zh' 
            ? `第 ${stageNumber} 阶段`
            : `Stage ${stageNumber}`
          }
        </span>
        <span className="treasure-reward">
          {isOpened 
            ? (currentLang === 'zh' ? '已领取' : 'Claimed')
            : `+${TREASURE_EXP} EXP`
          }
        </span>
      </div>
      
      {/* 奖励弹出 */}
      {showReward && (
        <div className="treasure-reward-popup">
          <span className="reward-icon">🎉</span>
          <span className="reward-text">+{TREASURE_EXP} EXP</span>
        </div>
      )}
      
      {/* 锁定提示 */}
      {!canOpen && !isOpened && (
        <div className="treasure-lock-hint">
          {currentLang === 'zh' 
            ? '完成前面的题目解锁'
            : 'Complete previous problems'
          }
        </div>
      )}
    </div>
  );
};

export default TreasureNode;
