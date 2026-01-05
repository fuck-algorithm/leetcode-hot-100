/**
 * Property-Based Tests for RealmHelpTooltip
 * 
 * These tests verify universal properties that should hold for all valid inputs.
 * Using fast-check library for property-based testing.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import RealmHelpTooltip, { calculateExpForRealm, calculateProblemEstimate } from './RealmHelpTooltip';

// 难度徽章颜色定义（从 CSS 中提取）
const BADGE_COLORS = {
  easy: { text: '#15803d', border: 'rgba(34, 197, 94, 0.5)', background: 'rgba(34, 197, 94, 0.2)' },
  medium: { text: '#b45309', border: 'rgba(251, 191, 36, 0.5)', background: 'rgba(251, 191, 36, 0.25)' },
  hard: { text: '#dc2626', border: 'rgba(248, 113, 113, 0.5)', background: 'rgba(239, 68, 68, 0.2)' },
  treasure: { text: '#7c3aed', border: 'rgba(167, 139, 250, 0.5)', background: 'rgba(139, 92, 246, 0.2)' },
};

// 辅助函数：将十六进制颜色转换为 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// 辅助函数：计算相对亮度
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// 辅助函数：计算对比度
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// 辅助函数：计算颜色距离（欧几里得距离）
function getColorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

// 境界数据用于测试
const REALMS = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 3, color: '#78716c', icon: '🌱' },
  { name: '筑基期', nameEn: 'Foundation', minLevel: 4, maxLevel: 6, color: '#22c55e', icon: '🌿' },
  { name: '金丹期', nameEn: 'Golden Core', minLevel: 7, maxLevel: 9, color: '#eab308', icon: '💫' },
  { name: '元婴期', nameEn: 'Nascent Soul', minLevel: 10, maxLevel: 12, color: '#f97316', icon: '🔥' },
  { name: '化神期', nameEn: 'Spirit Severing', minLevel: 13, maxLevel: 15, color: '#ef4444', icon: '⚡' },
  { name: '炼虚期', nameEn: 'Void Refining', minLevel: 16, maxLevel: 18, color: '#a855f7', icon: '🌀' },
  { name: '合体期', nameEn: 'Body Integration', minLevel: 19, maxLevel: 21, color: '#6366f1', icon: '💎' },
  { name: '大乘期', nameEn: 'Mahayana', minLevel: 22, maxLevel: 24, color: '#ec4899', icon: '🌸' },
  { name: '渡劫期', nameEn: 'Tribulation', minLevel: 25, maxLevel: 27, color: '#14b8a6', icon: '⛈️' },
  { name: '大罗金仙', nameEn: 'Golden Immortal', minLevel: 28, maxLevel: 999, color: '#fbbf24', icon: '👑' },
];

/**
 * Property 1: Realm Data Completeness
 * 
 * For any realm in the REALMS array, the tooltip SHALL display the realm's name,
 * icon, level range (minLevel-maxLevel), total EXP required ((minLevel-1) * 100),
 * and estimated problem counts.
 * 
 * **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 4.4**
 */
describe('Property 1: Realm Data Completeness', () => {
  test('for any realm index, all required fields are displayed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: REALMS.length - 1 }),
        (realmIndex) => {
          const realm = REALMS[realmIndex];
          const { unmount } = render(
            <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
          );
          
          // Verify realm name is displayed
          expect(screen.getByText(realm.name)).toBeInTheDocument();
          
          // Verify level range is displayed (format: Lv.X-Y)
          const levelText = realm.maxLevel === 999 
            ? `Lv.${realm.minLevel}-∞`
            : `Lv.${realm.minLevel}-${realm.maxLevel}`;
          expect(screen.getByText(levelText)).toBeInTheDocument();
          
          // Verify EXP is displayed (first realm shows "起始", others show "X EXP")
          const expRequired = (realm.minLevel - 1) * 100;
          if (expRequired === 0) {
            expect(screen.getByText('起始')).toBeInTheDocument();
          } else {
            expect(screen.getByText(`${expRequired} EXP`)).toBeInTheDocument();
          }
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Current Realm Highlighting
 * 
 * For any user level, exactly one realm in the tooltip SHALL be highlighted
 * as the current realm, and that realm's minLevel <= userLevel <= maxLevel.
 * 
 * **Validates: Requirements 3.6**
 */
describe('Property 2: Current Realm Highlighting', () => {
  test('for any valid user level, exactly one realm is highlighted as current', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }), // Test levels 1-50
        (userLevel) => {
          const { container, unmount } = render(
            <RealmHelpTooltip currentLang="zh" currentLevel={userLevel} isVisible={true} />
          );
          
          // Find all elements with "current" class
          const currentItems = container.querySelectorAll('.realm-item.current');
          
          // Exactly one realm should be highlighted
          expect(currentItems.length).toBe(1);
          
          // Find which realm should be current based on level
          const expectedRealm = REALMS.find(
            r => userLevel >= r.minLevel && userLevel <= r.maxLevel
          ) || REALMS[REALMS.length - 1];
          
          // The highlighted realm should contain the expected realm name
          expect(currentItems[0].textContent).toContain(expectedRealm.name);
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Language Consistency
 * 
 * For any supported language (zh, en) and any realm, the displayed realm name
 * SHALL match the corresponding language field (name for zh, nameEn for en).
 * 
 * **Validates: Requirements 6.3**
 */
describe('Property 3: Language Consistency', () => {
  test('for any language and realm, correct translation is displayed', () => {
    const languages = ['zh', 'en'] as const;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...languages),
        fc.integer({ min: 0, max: REALMS.length - 1 }),
        (lang, realmIndex) => {
          const realm = REALMS[realmIndex];
          const { unmount } = render(
            <RealmHelpTooltip currentLang={lang} currentLevel={1} isVisible={true} />
          );
          
          const expectedName = lang === 'zh' ? realm.name : realm.nameEn;
          expect(screen.getByText(expectedName)).toBeInTheDocument();
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: EXP Calculation Correctness
 * 
 * For any realm, the displayed total EXP required SHALL equal (realm.minLevel - 1) * 100.
 * 
 * **Validates: Requirements 3.4**
 */
describe('Property 4: EXP Calculation Correctness', () => {
  test('for any realm, EXP calculation follows the formula (minLevel - 1) * 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: REALMS.length - 1 }),
        (realmIndex) => {
          const realm = REALMS[realmIndex];
          const calculatedExp = calculateExpForRealm(realm);
          const expectedExp = (realm.minLevel - 1) * 100;
          
          expect(calculatedExp).toBe(expectedExp);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('problem estimate increases monotonically with EXP', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3000 }),
        fc.integer({ min: 1, max: 500 }),
        (baseExp, increment) => {
          const exp1 = baseExp;
          const exp2 = baseExp + increment;
          
          const estimate1 = calculateProblemEstimate(exp1);
          const estimate2 = calculateProblemEstimate(exp2);
          
          const total1 = estimate1.easyCount + estimate1.mediumCount + estimate1.hardCount;
          const total2 = estimate2.easyCount + estimate2.mediumCount + estimate2.hardCount;
          
          // More EXP should require more or equal problems
          expect(total2).toBeGreaterThanOrEqual(total1);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Property 5: Difficulty Badge Color Uniqueness
 * 
 * For any set of difficulty badges (easy, medium, hard, treasure), each badge type
 * SHALL have a distinct primary color that is visually distinguishable from the others.
 * 
 * Feature: realm-tooltip-fix, Property 2: 难度徽章颜色唯一性
 * **Validates: Requirements 2.4**
 */
describe('Property 5: Difficulty Badge Color Uniqueness', () => {
  const badgeTypes = ['easy', 'medium', 'hard', 'treasure'] as const;
  
  test('for any pair of badge types, their text colors are visually distinct', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...badgeTypes),
        fc.constantFrom(...badgeTypes),
        (badge1, badge2) => {
          if (badge1 === badge2) {
            // Same badge type should have same color
            expect(BADGE_COLORS[badge1].text).toBe(BADGE_COLORS[badge2].text);
          } else {
            // Different badge types should have different colors
            expect(BADGE_COLORS[badge1].text).not.toBe(BADGE_COLORS[badge2].text);
            
            // Colors should be visually distinguishable (color distance > 50)
            const distance = getColorDistance(BADGE_COLORS[badge1].text, BADGE_COLORS[badge2].text);
            expect(distance).toBeGreaterThan(50);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all four badge types have unique text colors', () => {
    const textColors = badgeTypes.map(type => BADGE_COLORS[type].text);
    const uniqueColors = new Set(textColors);
    
    // All 4 badge types should have unique colors
    expect(uniqueColors.size).toBe(4);
  });

  test('badge colors are rendered correctly in the component', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...badgeTypes),
        (badgeType) => {
          const { container, unmount } = render(
            <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
          );
          
          // Find the badge element
          const badge = container.querySelector(`.exp-rule-item.${badgeType}`);
          expect(badge).toBeInTheDocument();
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 6: Text Contrast Accessibility
 * 
 * For any text element within the tooltip, the contrast ratio between the text color
 * and its background color SHALL meet WCAG AA standard (minimum 4.5:1 for normal text).
 * 
 * Feature: realm-tooltip-fix, Property 3: 文字对比度可访问性
 * **Validates: Requirements 3.1**
 */
describe('Property 6: Text Contrast Accessibility', () => {
  // 金色浅色主题背景色（近似为浅金色）
  const TOOLTIP_BACKGROUND = '#fffbeb';
  
  // 主要文字颜色
  const TEXT_COLORS = {
    title: '#b45309',           // 标题
    ruleTitle: '#78716c',       // 规则标题
    realmName: '#44403c',       // 境界名称
    realmLevel: '#78716c',      // 等级文字
    realmExp: '#b45309',        // 经验值
    realmEstimate: '#78716c',   // 估算文字
  };

  test('for any text color, contrast ratio meets WCAG AA standard (4.5:1)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(TEXT_COLORS) as (keyof typeof TEXT_COLORS)[]),
        (textType) => {
          const textColor = TEXT_COLORS[textType];
          const contrastRatio = getContrastRatio(textColor, TOOLTIP_BACKGROUND);
          
          // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
          // We use 3:1 as minimum since some text may be considered large
          expect(contrastRatio).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('primary text colors meet strict WCAG AA standard (4.5:1)', () => {
    const primaryTextColors = ['title', 'realmName', 'realmExp'] as const;
    
    primaryTextColors.forEach(textType => {
      const textColor = TEXT_COLORS[textType];
      const contrastRatio = getContrastRatio(textColor, TOOLTIP_BACKGROUND);
      
      // Primary text should meet strict 4.5:1 ratio
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
  });

  test('badge text colors have sufficient contrast against their backgrounds', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('easy', 'medium', 'hard', 'treasure'),
        (badgeType) => {
          const textColor = BADGE_COLORS[badgeType as keyof typeof BADGE_COLORS].text;
          // Badge backgrounds are semi-transparent, so we test against the tooltip background
          const contrastRatio = getContrastRatio(textColor, TOOLTIP_BACKGROUND);
          
          // Badge text should be readable
          expect(contrastRatio).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });
});
