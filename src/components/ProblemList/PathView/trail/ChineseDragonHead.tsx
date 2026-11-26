import React from 'react';

/**
 * 中国龙头（矢量插画 · 骨相版）
 *
 * 前几版的通病：脸是光滑亮色蛋、眼睛像贴了两个鸡蛋、角像树枝、须像面条。
 * 根因是**缺少骨点与细节密度**。这一版：
 *   - 脸由**骨点连成的多边形**：额顶起棱、眶上突、颧骨外扩、下颌收窄
 *   - 额头与鼻梁之间做**凹陷**（中国龙额头是凹的）
 *   - 眼睛缩小、嵌进眼眶，眼白改暗琥珀，内眼角尖
 *   - 鳞片用半圆手工铺满额/颊/鼻端，够多才有质感
 *   - 角用**分段锥体**拼，每段带关节球与受光边
 *   - 龙须左右两根，粗细渐变、末端带卷
 *   - 鬃毛是**成片的火焰**贴在头轮廓外沿
 */

interface Props {
  width: number;
  height: number;
  completed: boolean;
}

export const ChineseDragonHead: React.FC<Props> = ({ width, height, completed }) => {
  const C = completed
    ? { s0:'#e8ffc8', s1:'#b6f07a', s2:'#74d92c', s3:'#47a80e', s4:'#2c6b05', sd:'#1f4c03' }
    : { s0:'#fff8d8', s1:'#f2d68e', s2:'#e0b040', s3:'#b98320', s4:'#8a5c11', sd:'#5e3d08' };
  const HO = { l:'#fffbee', m:'#e8dcba', d:'#b8a67c' };

  const W = 440, H = 440;

  const scales = (cx: number, cy: number, cols: number, rows: number,
                  dx: number, dy: number, r: number, key: string, op = 0.35) =>
    Array.from({ length: rows }).map((_, ri) =>
      Array.from({ length: cols }).map((_, ci) => (
        <path key={`${key}-${ri}-${ci}`}
          d={`M ${cx + ci * dx + (ri % 2) * (dx / 2) - r} ${cy + ri * dy} a ${r} ${r * 0.75} 0 0 1 ${r * 2} 0`}
          fill="none" stroke={C.s4} strokeWidth={1.4} opacity={op} strokeLinecap="round" />
      ))
    );

  return (
    <svg className="cn-dragon-head" viewBox={`0 0 ${W} ${H}`} width={width} height={height}
         preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cnf" x1="0.25" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={C.s0} /><stop offset="26%" stopColor={C.s1} />
          <stop offset="58%" stopColor={C.s2} /><stop offset="86%" stopColor={C.s3} />
          <stop offset="100%" stopColor={C.s4} />
        </linearGradient>
        <linearGradient id="cns" x1="0.2" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={C.s1} /><stop offset="50%" stopColor={C.s2} />
          <stop offset="100%" stopColor={C.s3} />
        </linearGradient>
        <linearGradient id="cnj" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.s2} /><stop offset="100%" stopColor={C.sd} />
        </linearGradient>
        <linearGradient id="cnh" x1="0" y1="1" x2="0.8" y2="0">
          <stop offset="0%" stopColor={HO.d} /><stop offset="35%" stopColor={HO.m} />
          <stop offset="70%" stopColor={HO.l} /><stop offset="100%" stopColor={HO.m} />
        </linearGradient>
        <radialGradient id="cne" cx="36%" cy="30%" r="70%">
          <stop offset="0%" stopColor={completed ? '#dfffb0' : '#ffde86'} />
          <stop offset="55%" stopColor={completed ? '#7ad320' : '#d99a16'} />
          <stop offset="100%" stopColor={completed ? '#2a6604' : '#8a5606'} />
        </radialGradient>
        <filter id="cnsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="cnsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>

      <ellipse cx="220" cy="352" rx="112" ry="26" fill={C.s4} opacity="0.14" filter="url(#cnsh)" />

      {/* 鬃毛 */}
      {[-1, 1].map(s => (
        <g key={`m-${s}`} transform={`translate(220 210) scale(${s} 1.5)`}>
          <path d="M 44 -40 C 66 -62, 82 -84, 84 -104 C 94 -76, 94 -52, 92 -30
                     C 106 -48, 114 -66, 116 -86 C 118 -56, 112 -30, 100 -4 Z" fill="url(#cnh)" opacity="0.95" />
          <path d="M 40 -10 C 62 -20, 84 -30, 102 -46 C 92 -26, 78 -12, 58 0
                     C 78 4, 94 10, 104 20 C 86 20, 66 16, 46 8 Z" fill="url(#cnh)" opacity="0.9" />
          <path d="M 40 16 C 62 18, 84 28, 102 46 C 88 38, 70 32, 52 30
                     C 70 42, 82 56, 86 70 C 70 62, 50 48, 34 30 Z" fill="url(#cnh)" opacity="0.85" />
          {[0, 1, 2, 3].map(i => (
            <path key={`ms-${i}`} d={`M ${62 + i * 8} ${-24 + i * 16} q ${10 + i * 3} ${-12 - i * 2} ${16 + i * 5} ${-22 - i * 3}`}
              stroke={HO.l} strokeWidth="1.2" fill="none" opacity="0.4" />
          ))}
        </g>
      ))}

      {/* 鹿角 */}
      {[-1, 1].map(s => {
        const seg = (x1:number,y1:number,x2:number,y2:number,w1:number,w2:number,k:string) => {
          const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), nx=-dy/L, ny=dx/L;
          return (
            <g key={k}>
              <path d={`M ${x1+nx*w1} ${y1+ny*w1} L ${x2+nx*w2} ${y2+ny*w2}
                        L ${x2-nx*w2} ${y2-ny*w2} L ${x1-nx*w1} ${y1-ny*w1} Z`} fill="url(#cnh)" />
              <circle cx={x2} cy={y2} r={w2*1.05} fill={HO.m} />
              <path d={`M ${x1+nx*w1*0.4} ${y1+ny*w1*0.4} L ${x2+nx*w2*0.4} ${y2+ny*w2*0.4}`}
                stroke={HO.l} strokeWidth={w1*0.5} opacity="0.55" strokeLinecap="round" />
            </g>
          );
        };
        const A={x:220+s*54,y:152}, B={x:220+s*84,y:104}, Cc={x:220+s*104,y:62}, Dd={x:220+s*122,y:26};
        return (
          <g key={`a-${s}`}>
            {seg(A.x,A.y,B.x,B.y,11,9,'h1')}
            {seg(B.x,B.y,Cc.x,Cc.y,9,7,'h2')}
            {seg(Cc.x,Cc.y,Dd.x,Dd.y,7,4,'h3')}
            {seg(B.x,B.y,B.x+s*36,B.y-28,7,5,'h4')}
            {seg(B.x+s*36,B.y-28,B.x+s*56,B.y-50,5,3,'h5')}
            {seg(Cc.x,Cc.y,Cc.x+s*30,Cc.y-46,5.5,3,'h6')}
            {seg(A.x,A.y,A.x+s*10,A.y-52,6,3.5,'h7')}
            <ellipse cx={A.x} cy={A.y} rx={13} ry={10} fill={C.s4} opacity="0.65" />
          </g>
        );
      })}

      {/* 头骨（骨点多边形） */}
      <path d="M 220 84 L 168 88 L 132 100 L 112 122 L 106 150 L 108 178
                L 118 204 L 136 224 L 160 238 L 186 246 L 220 248
                L 254 246 L 280 238 L 304 224 L 322 204 L 332 178
                L 334 150 L 328 122 L 308 100 L 272 88 Z" fill="url(#cnf)" />
      <ellipse cx="220" cy="112" rx="54" ry="20" fill={C.s3} opacity="0.28" filter="url(#cnsoft)" />
      <path d="M 220 92 L 150 108 L 118 136" stroke={C.s0} strokeWidth="3" fill="none" opacity="0.5" strokeLinejoin="round" />
      <path d="M 220 92 L 290 108 L 322 136" stroke={C.s0} strokeWidth="3" fill="none" opacity="0.5" strokeLinejoin="round" />
      <path d="M 118 136 Q 152 128 186 140" stroke={C.s4} strokeWidth="2.4" fill="none" opacity="0.4" />
      <path d="M 322 136 Q 288 128 254 140" stroke={C.s4} strokeWidth="2.4" fill="none" opacity="0.4" />
      <ellipse cx="140" cy="196" rx="30" ry="20" fill={C.sd} opacity="0.2" filter="url(#cnsoft)" />
      <ellipse cx="300" cy="196" rx="30" ry="20" fill={C.sd} opacity="0.2" filter="url(#cnsoft)" />

      {scales(160,100,8,3,16,14,7,'sca',0.4)}
      {scales(122,186,3,3,15,14,6.5,'scb',0.35)}
      {scales(266,186,3,3,15,14,6.5,'scc',0.35)}

      {/* 方吻 */}
      <path d="M 128 200 C 124 218, 128 234, 142 244 L 152 236 C 142 224, 138 210, 140 198 Z" fill={C.sd} opacity="0.45" />
      <path d="M 312 200 C 316 218, 312 234, 298 244 L 288 236 C 298 224, 302 210, 300 198 Z" fill={C.sd} opacity="0.45" />
      <path d="M 138 194 L 146 174 C 174 166, 266 166, 294 174 L 302 194
                C 306 212, 296 228, 278 236 C 250 246, 190 246, 162 236
                C 144 228, 134 212, 138 194 Z" fill="url(#cns)" />
      <path d="M 146 174 C 174 166, 266 166, 294 174 L 291 184 C 264 177, 176 177, 149 184 Z" fill={C.s0} opacity="0.62" />
      <path d="M 220 128 C 224 150, 226 170, 222 192 C 216 170, 214 150, 220 128 Z" fill={C.s0} opacity="0.5" />
      <path d="M 170 188 L 176 176 C 200 170, 240 170, 258 176 L 264 188
                C 266 198, 256 206, 238 209 C 216 213, 194 213, 178 209
                C 166 206, 160 198, 170 188 Z" fill={C.s1} />
      <path d="M 170 188 L 176 176 C 200 170, 240 170, 258 176 L 264 188 C 260 182, 180 182, 170 188 Z" fill={C.s0} opacity="0.55" />
      {scales(186,180,4,2,16,12,6,'scn',0.4)}

      {[-1, 1].map(s => (
        <g key={`n-${s}`}>
          <ellipse cx={220+s*28} cy={196} rx={12} ry={8} fill={C.s4} opacity="0.72" transform={`rotate(${s*-16} ${220+s*28} 196)`} />
          <ellipse cx={220+s*28} cy={195} rx={7.5} ry={4.5} fill="#2a1a06" opacity="0.9" transform={`rotate(${s*-16} ${220+s*28} 195)`} />
          <path d={`M ${220+s*28-9} 190 q 9 -4 18 0`} stroke={C.s0} strokeWidth="1.6" fill="none" opacity="0.5" />
        </g>
      ))}
      <path d="M 172 214 C 198 224, 242 224, 268 214" stroke={C.s4} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* 脸颊 / 下颌鳞甲：整脸都要有鳞，不能只有额头 */}
      {scales(140, 214, 4, 2, 14, 13, 6, 'scd', 0.3)}
      {scales(252, 214, 4, 2, 14, 13, 6, 'sce', 0.3)}
      {scales(176, 240, 3, 1, 15, 12, 5.5, 'scf', 0.26)}
      {scales(210, 240, 3, 1, 15, 12, 5.5, 'scg', 0.26)}

      {/* 嘴 */}
      <path d="M 156 230 C 182 242, 258 242, 284 230 C 280 252, 248 264, 220 264 C 192 264, 160 252, 156 230 Z" fill="url(#cnj)" />
      <path d="M 164 232 C 188 242, 252 242, 276 232 C 268 250, 232 258, 220 258 C 208 258, 172 250, 164 232 Z" fill="#74201c" />
      <path d="M 192 246 C 206 252, 234 252, 248 246 C 240 258, 200 258, 192 246 Z" fill="#b0544a" />
      <path d="M 164 232 C 188 242, 252 242, 276 232 L 274 236 C 250 246, 190 246, 166 236 Z" fill="#4e120f" opacity="0.7" />
      {[-1, 1].map(s => (
        <g key={`f-${s}`}>
          <path d={`M ${188+s*12} 236 L ${192+s*12} 258 L ${197+s*12} 236 Z`} fill="#fffeb8" opacity="0.97" />
          <path d={`M ${188+s*12} 236 L ${191+s*12} 252 L ${192+s*12} 236 Z`} fill="#cdc09c" opacity="0.6" />
          <path d={`M ${206+s*14} 255 L ${210+s*14} 238 L ${215+s*14} 255 Z`} fill="#fffeb8" opacity="0.9" />
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={`sm-${i}`}>
          <path d={`M ${168+i*9} 237 L ${171+i*9} 247 L ${175+i*9} 237 Z`} fill="#f2ecd6" opacity="0.85" />
          <path d={`M ${272-i*9} 237 L ${269-i*9} 247 L ${265-i*9} 237 Z`} fill="#f2ecd6" opacity="0.85" />
        </g>
      ))}

      {/* 嗔目 */}
      {[-1, 1].map(s => (
        <g key={`e-${s}`} transform={`translate(${220+s*62} 174)`}>
          <ellipse rx="29" ry="22" fill={C.s4} opacity="0.55" />
          <ellipse rx="26" ry="19" fill={C.s3} opacity="0.5" />
          <ellipse rx="21" ry="14" fill="url(#cne)" />
          <ellipse rx="4.5" ry="12" fill="#0d0a05" />
          <ellipse rx="1.8" ry="7" fill={completed ? '#9ef05c' : '#ffc23a'} opacity="0.8" />
          <ellipse cx="-8" cy="-6" rx="5" ry="3.6" fill="#ffffff" opacity="0.88" transform="rotate(-18 -8 -6)" />
          <circle cx="7" cy="5" r="2" fill="#ffffff" opacity="0.4" />
          <path d="M -28 -8 C -16 -20, 16 -20, 26 -9 L 26 -4 C 12 -15, -12 -15, -28 -3 Z" fill={C.s4} />
          <path d={`M ${s>0?-28:28} -8 L ${s>0?-34:34} -2 L ${s>0?-27:27} 2 Z`} fill={C.s4} opacity="0.9" />
          <path d="M -24 11 C -12 17, 12 17, 24 11 L 24 14 C 12 20, -12 20, -24 14 Z" fill={C.s4} opacity="0.6" />
        </g>
      ))}

      {/* 眉弓 */}
      {[-1, 1].map(s => (
        <g key={`b-${s}`}>
          <path d={`M ${220+s*28} 152 C ${220+s*46} 136, ${220+s*78} 130, ${220+s*100} 142
                    L ${220+s*98} 158 C ${220+s*76} 146, ${220+s*48} 152, ${220+s*32} 166 Z`} fill={C.sd} />
          <path d={`M ${220+s*32} 150 C ${220+s*48} 138, ${220+s*76} 134, ${220+s*96} 144`}
            stroke={C.s0} strokeWidth="2" fill="none" opacity="0.45" />
          {[0, 1, 2].map(i => (
            <path key={`bf-${i}`}
              d={`M ${220+s*96} ${146-i*3} C ${220+s*112} ${130-i*10}, ${220+s*122} ${114-i*12}, ${220+s*126} ${96-i*12}
                 C ${220+s*110} ${116-i*10}, ${220+s*100} ${130-i*6}, ${220+s*92} ${142-i*4} Z`}
              fill={C.s4} opacity={0.9-i*0.2} />
          ))}
        </g>
      ))}

      {/* 颊鳞 */}
      {[-1, 1].map(s => [0,1,2,3].map(i => (
        <g key={`cs-${s}-${i}`}>
          <path d={`M ${220+s*92} ${196+i*17} a 9 7 0 0 1 ${s*18} 0`} fill="none" stroke={C.s4} strokeWidth="1.8" opacity={0.42-i*0.07} strokeLinecap="round" />
          <path d={`M ${220+s*95} ${194+i*17} a 7 5 0 0 1 ${s*13} 0`} fill="none" stroke={C.s1} strokeWidth="1.2" opacity={0.4-i*0.07} strokeLinecap="round" />
        </g>
      )))}

      {/* 龙须 */}
      {[-1, 1].map(s => (
        <g key={`w-${s}`}>
          {/* 须根：从吻侧肌肉里长出来的一段粗根 */}
          <ellipse cx={220 + s * 78} cy={210} rx={11} ry={8} fill={C.s3} opacity="0.85" />
          <ellipse cx={220 + s * 74} cy={208} rx={6} ry={4} fill={C.s1} opacity="0.6" />
          <path d={`M ${220+s*76} 208 C ${220+s*122} 196, ${220+s*168} 204, ${220+s*196} 232
                    C ${220+s*168} 214, ${220+s*122} 208, ${220+s*80} 216 Z`} fill="url(#cnh)" />
          <path d={`M ${220+s*80} 210 C ${220+s*122} 200, ${220+s*164} 208, ${220+s*190} 228`}
            stroke={HO.l} strokeWidth="1.4" fill="none" opacity="0.55" />
          <path d={`M ${220+s*66} 250 C ${220+s*100} 268, ${220+s*118} 292, ${220+s*120} 316
                    C ${220+s*126} 298, ${220+s*118} 280, ${220+s*100} 264
                    C ${220+s*88} 256, ${220+s*72} 254, ${220+s*68} 252 Z`} fill="url(#cnh)" opacity="0.92" />
        </g>
      ))}
    </svg>
  );
};

export default ChineseDragonHead;
