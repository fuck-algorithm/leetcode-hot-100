import React from 'react';

/**
 * 中国龙头（矢量插画 · 精细版）
 *
 * 上一版的问题：脸是一块纯色像贴纸、眼睛太大像卡通青蛙、
 * 鬃毛细碎散乱、鹿角与龙须太淡、吻部无立体感。
 *
 * 这一版让每一处都有体积：
 *   - 脸用径向渐变，颧骨/额骨/下颌各受不同方向的光
 *   - 眼睛压成杏仁形嗔目，配厚眼睑、竖瞳、角膜高光
 *   - 鬃毛连成火焰块面，根部宽、尖端分叉
 *   - 鹿角加粗、双色渐变、带节瘤
 *   - 龙须加粗、带渐变与描边
 *   - 吻部三层：侧壁阴影 / 吻顶面 / 凸起的鼻端，鼻孔是内凹深洞
 *   - 獠牙加大、减少数量，配牙龈阴影
 */

interface Props {
  width: number;
  height: number;
  completed: boolean;
}

export const ChineseDragonHead: React.FC<Props> = ({
  width,
  height,
  completed,
}) => {
  const C = completed
    ? { hi:'#d8ffb0', lit:'#a8f06a', mid:'#6ad82a', dark:'#3f9a00', deep:'#266000', mane:'#2f7000' }
    : { hi:'#fff3c4', lit:'#f7d268', mid:'#e0a92e', dark:'#b0761b', deep:'#7d4f0d', mane:'#8c5a10' };

  const W = 420;
  const H = 420;

  return (
    <svg
      className="cn-dragon-head"
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="cn-face-g" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor={C.hi} />
          <stop offset="38%" stopColor={C.lit} />
          <stop offset="72%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.dark} />
        </radialGradient>
        <linearGradient id="cn-snout-g" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={C.lit} />
          <stop offset="45%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.dark} />
        </linearGradient>
        <linearGradient id="cn-jaw-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.deep} />
        </linearGradient>
        <linearGradient id="cn-horn-g" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#fffdf0" />
          <stop offset="42%" stopColor="#ece0bd" />
          <stop offset="100%" stopColor="#b9a67a" />
        </linearGradient>
        <linearGradient id="cn-whisker-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9b68c" />
          <stop offset="60%" stopColor="#efe3c4" />
          <stop offset="100%" stopColor="#fffaea" />
        </linearGradient>
        <radialGradient id="cn-eye-g" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="45%" stopColor={completed ? '#c8ff70' : '#ffd947'} />
          <stop offset="100%" stopColor={completed ? '#3fa300' : '#b0740a'} />
        </radialGradient>
        <linearGradient id="cn-mane-g" x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0%" stopColor={C.lit} />
          <stop offset="55%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.mane} />
        </linearGradient>
        <filter id="cn-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* 投影 */}
      <ellipse cx="210" cy="332" rx="118" ry="34" fill={C.deep} opacity="0.16" filter="url(#cn-shadow)" />

      {/* 鬃毛（头后，连成块面） */}
      {[-1, 1].map(s => (
        <g key={`mane-${s}`} transform={`translate(210 176) scale(${s} 1)`}>
          {/* 三簇短而圆的火焰鬃，贴着颊部向后垂。
              不要长条尖刺：长度控制在 40px 内，末端收成弧。 */}
          {[0, 1, 2].map(i => {
            const y0 = 8 + i * 22;
            const x0 = 84 + i * 3;
            const len = 34 + i * 3;
            return (
              <g key={`m${i}`}>
                <path
                  d={`M ${x0} ${y0}
                      C ${x0 + 10} ${y0 - 6}, ${x0 + len - 8} ${y0 + 2}, ${x0 + len} ${y0 + 14}
                      C ${x0 + len - 6} ${y0 + 20}, ${x0 + 14} ${y0 + 22}, ${x0} ${y0 + 16} Z`}
                  fill="url(#cn-mane-g)"
                />
                <path
                  d={`M ${x0 + 3} ${y0 + 4} C ${x0 + 12} ${y0}, ${x0 + len - 10} ${y0 + 6}, ${x0 + len - 3} ${y0 + 14}`}
                  stroke={C.hi}
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.4"
                />
              </g>
            );
          })}
        </g>
      ))}

      {/* 鹿角 */}
      {[-1, 1].map(s => (
        <g key={`antler-${s}`} transform={`translate(${210 + s * 58} 150) scale(${s} 1)`}>
          <path d="M 0 8 C 12 -20, 26 -44, 36 -70" stroke="url(#cn-horn-g)" strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d="M 15 -30 C 30 -36, 46 -42, 62 -46" stroke="url(#cn-horn-g)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M 28 -56 C 38 -70, 46 -84, 50 -100" stroke="url(#cn-horn-g)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M 46 -86 C 54 -90, 60 -96, 64 -104" stroke="url(#cn-horn-g)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 8 -14 C 4 -30, -2 -42, -8 -54" stroke="url(#cn-horn-g)" strokeWidth="8" strokeLinecap="round" fill="none" />
          {[[6,-12,7],[16,-32,6.5],[27,-54,6],[37,-72,5],[46,-42,5],[49,-96,4]].map(([x,y,r],i)=>(
            <circle key={`k-${i}`} cx={x} cy={y} r={r} fill="#f5ebd2" opacity="0.5" />
          ))}
        </g>
      ))}

      {/* 头骨主体 */}
      <path
        d="M 96 152 L 106 112 C 128 96, 166 88, 210 88 C 254 88, 292 96, 314 112
           L 324 152 C 324 186, 314 214, 296 234 C 278 252, 246 262, 210 264
           C 174 262, 142 252, 124 234 C 106 214, 96 186, 96 152 Z"
        fill="url(#cn-face-g)"
      />
      <path d="M 118 120 C 150 104, 270 104, 302 120" stroke={C.hi} strokeWidth="4" fill="none" opacity="0.5" />
      <path d="M 210 96 L 210 130" stroke={C.dark} strokeWidth="2.5" opacity="0.26" />
      <ellipse cx="140" cy="198" rx="34" ry="22" fill={C.dark} opacity="0.16" />
      <ellipse cx="280" cy="198" rx="34" ry="22" fill={C.dark} opacity="0.16" />

      {/* 方吻：侧壁阴影 */}
      <path d="M 118 196 C 116 212, 120 226, 132 236 L 142 230 C 132 218, 130 206, 132 196 Z" fill={C.deep} opacity="0.45" />
      <path d="M 302 196 C 304 212, 300 226, 288 236 L 278 230 C 288 218, 290 206, 288 196 Z" fill={C.deep} opacity="0.45" />
      {/* 吻部主体 */}
      <path
        d="M 126 190 L 134 172 C 160 164, 260 164, 286 172 L 294 190
           C 297 208, 288 222, 272 230 C 248 238, 172 238, 148 230
           C 132 222, 123 208, 126 190 Z"
        fill="url(#cn-snout-g)"
      />
      <path d="M 210 132 C 214 150, 216 168, 212 190 C 208 168, 206 150, 210 132 Z" fill={C.hi} opacity="0.5" />
      <path d="M 134 172 C 160 164, 260 164, 286 172 L 283 182 C 258 175, 162 175, 137 182 Z" fill={C.hi} opacity="0.65" />
      {/* 鼻端凸起 */}
      <path
        d="M 160 186 L 166 175 C 188 170, 232 170, 250 175 L 256 186
           C 258 195, 248 202, 232 205 C 212 209, 192 209, 176 205
           C 164 202, 158 195, 160 186 Z"
        fill={C.lit}
      />
      <path d="M 160 186 L 166 175 C 188 170, 232 170, 250 175 L 256 186 C 252 180, 168 180, 160 186 Z" fill={C.hi} opacity="0.55" />
      {/* 鼻孔 */}
      {[-1, 1].map(s => (
        <g key={`nos-${s}`}>
          <ellipse cx={210 + s * 26} cy={192} rx={11} ry={7} fill={C.deep} opacity="0.8" transform={`rotate(${s * -14} ${210 + s * 26} 192)`} />
          <ellipse cx={210 + s * 26} cy={191} rx={7} ry={4} fill="#3a2408" opacity="0.9" transform={`rotate(${s * -14} ${210 + s * 26} 191)`} />
        </g>
      ))}
      <path d="M 168 208 C 190 216, 230 216, 252 208" stroke={C.dark} strokeWidth="2.5" fill="none" opacity="0.42" />

      {/* 嘴 */}
      <path d="M 148 224 C 172 236, 248 236, 272 224 C 268 246, 240 258, 210 258 C 180 258, 152 246, 148 224 Z" fill="url(#cn-jaw-g)" />
      <path d="M 156 226 C 178 236, 242 236, 264 226 C 256 244, 222 250, 210 250 C 198 250, 164 244, 156 226 Z" fill="#7a1f1c" />
      <path d="M 186 238 C 200 244, 220 244, 234 238 C 226 250, 194 250, 186 238 Z" fill="#b8534a" />
      <path d="M 156 226 C 178 236, 242 236, 264 226 L 262 230 C 240 240, 180 240, 158 230 Z" fill="#5c1512" opacity="0.65" />
      {[-1, 1].map(s => (
        <g key={`fang-${s}`}>
          <path d={`M ${182 + s * 10} 230 L ${186 + s * 10} 250 L ${191 + s * 10} 230 Z`} fill="#fffdf5" />
          <path d={`M ${182 + s * 10} 230 L ${185 + s * 10} 244 L ${186 + s * 10} 230 Z`} fill="#d9cfae" opacity="0.6" />
          <path d={`M ${196 + s * 12} 248 L ${200 + s * 12} 234 L ${204 + s * 12} 248 Z`} fill="#fffdf5" opacity="0.9" />
        </g>
      ))}
      {[0, 1].map(i => (
        <g key={`sm-${i}`}>
          <path d={`M ${168 + i * 8} 231 L ${171 + i * 8} 240 L ${174 + i * 8} 231 Z`} fill="#f5efdc" opacity="0.85" />
          <path d={`M ${244 - i * 8} 231 L ${247 - i * 8} 240 L ${250 - i * 8} 231 Z`} fill="#f5efdc" opacity="0.85" />
        </g>
      ))}

      {/* 嗔目 */}
      {[-1, 1].map(s => (
        <g key={`eye-${s}`} transform={`translate(${210 + s * 62} 168)`}>
          <ellipse rx="34" ry="27" fill={C.dark} opacity="0.3" />
          <ellipse rx="31" ry="24" fill={C.deep} opacity="0.22" />
          <ellipse rx="27" ry="19" fill="url(#cn-eye-g)" />
          <ellipse rx="7" ry="15" fill="#100b05" />
          <ellipse rx="3" ry="9" fill={completed ? '#8fe05a' : '#ffb32b'} opacity="0.75" />
          <ellipse cx="-9" cy="-8" rx="6.5" ry="5" fill="#fff" opacity="0.9" />
          <circle cx="10" cy="7" r="3" fill="#fff" opacity="0.4" />
          <path d="M -34 -12 C -20 -26, 20 -26, 34 -12 L 34 -6 C 16 -20, -16 -20, -34 -6 Z" fill={C.dark} opacity="0.88" />
          <path d="M -30 14 C -14 22, 14 22, 30 14 L 30 17 C 14 25, -14 25, -30 17 Z" fill={C.dark} opacity="0.5" />
        </g>
      ))}

      {/* 眉弓 */}
      {[-1, 1].map(s => (
        <g key={`brow-${s}`}>
          <path
            d={`M ${210 + s * 30} 144 C ${210 + s * 48} 128, ${210 + s * 76} 124, ${210 + s * 96} 136
               L ${210 + s * 94} 150 C ${210 + s * 74} 140, ${210 + s * 50} 144, ${210 + s * 34} 158 Z`}
            fill={C.deep}
          />
          <path
            d={`M ${210 + s * 94} 138 C ${210 + s * 108} 120, ${210 + s * 118} 104, ${210 + s * 122} 88
               C ${210 + s * 106} 108, ${210 + s * 98} 124, ${210 + s * 90} 134 Z`}
            fill={C.dark}
          />
        </g>
      ))}

      {/* 颊侧鳞甲 */}
      {[-1, 1].map(s => [0,1,2].map(i => {
        const x = 210 + s * (96 + i * 7);
        const y = 202 + i * 20;
        return (
          <g key={`sc-${s}-${i}`}>
            <path d={`M ${x} ${y} q ${s * 12} ${-9} ${s * 19} ${4} q ${-s * 9} ${9} ${-s * 19} ${-4} Z`} fill={C.dark} opacity={0.45 - i * 0.09} />
            <path d={`M ${x + s * 2} ${y + 1} q ${s * 9} ${-5} ${s * 13} ${3}`} stroke={C.hi} strokeWidth="1.6" fill="none" opacity={0.45 - i * 0.09} />
          </g>
        );
      }))}

      {/* 龙须 */}
      {[-1, 1].map(s => (
        <g key={`wh-${s}`}>
          <path
            d={`M ${210 + s * 60} 206 C ${210 + s * 108} 196, ${210 + s * 150} 208, ${210 + s * 178} 236
               C ${210 + s * 150} 218, ${210 + s * 116} 210, ${210 + s * 64} 214 Z`}
            fill="url(#cn-whisker-g)"
          />
          <path
            d={`M ${210 + s * 60} 206 C ${210 + s * 108} 196, ${210 + s * 150} 208, ${210 + s * 178} 236`}
            stroke="#a8916a" strokeWidth="1.4" fill="none" opacity="0.45"
          />
          <path
            d={`M ${210 + s * 54} 236 C ${210 + s * 86} 250, ${210 + s * 104} 272, ${210 + s * 108} 296
               C ${210 + s * 96} 276, ${210 + s * 78} 258, ${210 + s * 56} 244 Z`}
            fill="url(#cn-whisker-g)" opacity="0.9"
          />
        </g>
      ))}
    </svg>
  );
};

export default ChineseDragonHead;
