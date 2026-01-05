import React from 'react';

interface ProgressRingProps {
  percentage: number;
  color: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, color }) => {
  return (
    <svg className="ascension-progress-ring" viewBox="0 0 120 120">
      <circle
        className="progress-bg"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        strokeWidth="8"
      />
      <circle
        className="progress-fill"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        strokeWidth="8"
        strokeDasharray={`${percentage * 3.39} 339`}
        strokeLinecap="round"
        style={{ stroke: color }}
      />
    </svg>
  );
};

export default ProgressRing;
