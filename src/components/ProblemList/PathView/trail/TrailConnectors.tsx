import React from 'react';

export interface TrailConnection {
  key: string;
  /** SVG path 的 d 属性 */
  d: string;
  completed: boolean;
}

interface TrailConnectorsProps {
  className: string;
  width: number;
  height: number;
  connections: TrailConnection[];
  /**
   * simple: 详情页使用的单层路径（保持既有的视觉契约）
   * raised: 概览页使用的双层路径，模拟多邻国路径的厚度与立体底边
   */
  variant?: 'simple' | 'raised';
}

const SIMPLE_COMPLETED = '#ffd700';
const SIMPLE_PENDING = '#d0d0d0';

const TrailConnectors: React.FC<TrailConnectorsProps> = ({
  className,
  width,
  height,
  connections,
  variant = 'simple',
}) => {
  return (
    <svg
      className={className}
      style={{ height }}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'raised'
        ? connections.map(connection => (
            <g key={connection.key} className="trail-link-group">
              <path
                className={`trail-link-base ${connection.completed ? 'is-completed' : ''}`}
                d={connection.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={14}
                transform="translate(0 5)"
              />
              <path
                className={`trail-link-top ${connection.completed ? 'is-completed' : ''}`}
                d={connection.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={10}
              />
            </g>
          ))
        : connections.map(connection => (
            <path
              key={connection.key}
              className={`trail-link ${connection.completed ? 'is-completed' : ''}`}
              d={connection.d}
              stroke={connection.completed ? SIMPLE_COMPLETED : SIMPLE_PENDING}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          ))}
    </svg>
  );
};

export default TrailConnectors;
