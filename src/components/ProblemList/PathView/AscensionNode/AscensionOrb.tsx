import React from 'react';
import ProgressRing from './ProgressRing';
import { CompanyLogo } from './CompanyLogos';
import { AscensionGoal, DisplayInfo } from './types';

interface AscensionOrbProps {
  goal: AscensionGoal;
  displayInfo: DisplayInfo;
  completionPercentage: number;
  isComplete: boolean;
  onActivate: () => void;
}

/**
 * 飞升节点主体：进度环 + 目标公司 Logo + 光效。
 */
const AscensionOrb: React.FC<AscensionOrbProps> = ({
  goal,
  displayInfo,
  completionPercentage,
  isComplete,
  onActivate,
}) => {
  return (
    <div
      className={`ascension-main ${isComplete ? 'is-complete' : ''}`}
      style={{ '--ascension-color': displayInfo.color } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={displayInfo.name}
      onClick={onActivate}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate();
        }
      }}
    >
      <div className="ascension-aura" aria-hidden="true" />
      <ProgressRing percentage={completionPercentage} color={displayInfo.color} />

      <div className="ascension-content">
        <span className="ascension-logo">
          {goal.companyId ? (
            <CompanyLogo companyId={goal.companyId} size={64} />
          ) : displayInfo.logoImage ? (
            <img
              src={displayInfo.logoImage}
              alt={displayInfo.name}
              style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 10 }}
            />
          ) : (
            displayInfo.logo
          )}
        </span>
      </div>

      {isComplete && <div className="ascension-glow" aria-hidden="true" />}
      <span className="ascension-spark ascension-spark-1" aria-hidden="true">✨</span>
      <span className="ascension-spark ascension-spark-2" aria-hidden="true">⭐</span>
      <span className="ascension-spark ascension-spark-3" aria-hidden="true">✨</span>
    </div>
  );
};

export default AscensionOrb;
