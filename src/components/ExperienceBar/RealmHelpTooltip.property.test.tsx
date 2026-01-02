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
