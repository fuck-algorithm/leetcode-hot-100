import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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

describe('calculateExpForRealm', () => {
  test('returns 0 for first realm (练气期)', () => {
    const realm = REALMS[0];
    expect(calculateExpForRealm(realm)).toBe(0);
  });

  test('returns 300 for second realm (筑基期)', () => {
    const realm = REALMS[1];
    expect(calculateExpForRealm(realm)).toBe(300);
  });

  test('returns correct EXP for all realms', () => {
    REALMS.forEach((realm) => {
      const expectedExp = (realm.minLevel - 1) * 100;
      expect(calculateExpForRealm(realm)).toBe(expectedExp);
    });
  });
});

describe('calculateProblemEstimate', () => {
  test('returns zeros for 0 EXP', () => {
    const estimate = calculateProblemEstimate(0);
    expect(estimate.easyCount).toBe(0);
    expect(estimate.mediumCount).toBe(0);
    expect(estimate.hardCount).toBe(0);
  });

  test('returns positive values for positive EXP', () => {
    const estimate = calculateProblemEstimate(300);
    expect(estimate.easyCount).toBeGreaterThan(0);
    expect(estimate.mediumCount).toBeGreaterThan(0);
    expect(estimate.hardCount).toBeGreaterThan(0);
  });

  test('returns reasonable estimates (total problems increases with EXP)', () => {
    const estimate300 = calculateProblemEstimate(300);
    const estimate600 = calculateProblemEstimate(600);
    
    const total300 = estimate300.easyCount + estimate300.mediumCount + estimate300.hardCount;
    const total600 = estimate600.easyCount + estimate600.mediumCount + estimate600.hardCount;
    
    expect(total600).toBeGreaterThan(total300);
  });
});

describe('RealmHelpTooltip', () => {
  test('renders nothing when not visible', () => {
    const { container } = render(
      <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders tooltip when visible', () => {
    render(
      <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
    );
    expect(screen.getByText('修仙境界系统')).toBeInTheDocument();
  });

  test('displays Chinese content when lang is zh', () => {
    render(
      <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
    );
    expect(screen.getByText('修仙境界系统')).toBeInTheDocument();
    expect(screen.getByText('经验值规则')).toBeInTheDocument();
    expect(screen.getByText('练气期')).toBeInTheDocument();
  });

  test('displays English content when lang is en', () => {
    render(
      <RealmHelpTooltip currentLang="en" currentLevel={1} isVisible={true} />
    );
    expect(screen.getByText('Cultivation Realm System')).toBeInTheDocument();
    expect(screen.getByText('EXP Rules')).toBeInTheDocument();
    expect(screen.getByText('Qi Refining')).toBeInTheDocument();
  });

  test('highlights current realm', () => {
    render(
      <RealmHelpTooltip currentLang="zh" currentLevel={5} isVisible={true} />
    );
    // Level 5 is in 筑基期 (minLevel: 4, maxLevel: 6)
    const currentBadge = screen.getByText('当前');
    expect(currentBadge).toBeInTheDocument();
  });

  test('displays all 10 realms', () => {
    render(
      <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
    );
    
    REALMS.forEach((realm) => {
      expect(screen.getByText(realm.name)).toBeInTheDocument();
    });
  });

  test('displays EXP rules', () => {
    render(
      <RealmHelpTooltip currentLang="zh" currentLevel={1} isVisible={true} />
    );
    
    expect(screen.getByText(/简单.*10 EXP/)).toBeInTheDocument();
    expect(screen.getByText(/中等.*20 EXP/)).toBeInTheDocument();
    expect(screen.getByText(/困难.*30 EXP/)).toBeInTheDocument();
    expect(screen.getByText(/宝箱.*50 EXP/)).toBeInTheDocument();
  });
});
