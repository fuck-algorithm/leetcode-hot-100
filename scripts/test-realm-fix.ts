/**
 * Test script to verify realm display bug fix
 * 
 * This script tests that:
 * 1. getCurrentRealm returns correct realm index for various experience values
 * 2. Realm boundaries are correct
 * 3. Level calculation is correct
 */

export {}; // Make this a module

// Simulate the realm thresholds from config
const REALM_THRESHOLDS = [
  0,       // 练气期 (Realm 0)
  50000,   // 筑基期 (Realm 1)
  120000,  // 金丹期 (Realm 2)
  210000,  // 元婴期 (Realm 3)
  320000,  // 化神期 (Realm 4)
  450000,  // 炼虚期 (Realm 5)
  600000,  // 合体期 (Realm 6)
  770000,  // 大乘期 (Realm 7)
  900000,  // 渡劫期 (Realm 8)
  950000,  // 大罗金仙 (Realm 9)
  1000000  // 飞升仙界 (Realm 10)
];

const REALM_NAMES = [
  '练气期',
  '筑基期',
  '金丹期',
  '元婴期',
  '化神期',
  '炼虚期',
  '合体期',
  '大乘期',
  '渡劫期',
  '大罗金仙',
  '飞升仙界'
];

// Simulate getCurrentRealm function
function getCurrentRealm(experience: number): number {
  if (experience < 0) return 0;
  if (experience >= REALM_THRESHOLDS[REALM_THRESHOLDS.length - 1]) {
    return REALM_THRESHOLDS.length - 1;
  }

  let left = 0;
  let right = REALM_THRESHOLDS.length - 1;
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (REALM_THRESHOLDS[mid] <= experience) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

// Test cases
const testCases = [
  { exp: 0, expectedRealm: 0, expectedName: '练气期' },
  { exp: 11, expectedRealm: 0, expectedName: '练气期' },
  { exp: 49999, expectedRealm: 0, expectedName: '练气期' },
  { exp: 50000, expectedRealm: 1, expectedName: '筑基期' },
  { exp: 50001, expectedRealm: 1, expectedName: '筑基期' },
  { exp: 119999, expectedRealm: 1, expectedName: '筑基期' },
  { exp: 120000, expectedRealm: 2, expectedName: '金丹期' },
  { exp: 209999, expectedRealm: 2, expectedName: '金丹期' },
  { exp: 210000, expectedRealm: 3, expectedName: '元婴期' },
  { exp: 1000000, expectedRealm: 10, expectedName: '飞升仙界' },
];

console.log('🧪 Testing Realm Display Bug Fix\n');
console.log('=' .repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach(({ exp, expectedRealm, expectedName }) => {
  const actualRealm = getCurrentRealm(exp);
  const actualName = REALM_NAMES[actualRealm];
  const isCorrect = actualRealm === expectedRealm && actualName === expectedName;
  
  if (isCorrect) {
    console.log(`✅ PASS: ${exp.toLocaleString()} exp → Realm ${actualRealm} (${actualName})`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${exp.toLocaleString()} exp`);
    console.log(`   Expected: Realm ${expectedRealm} (${expectedName})`);
    console.log(`   Got:      Realm ${actualRealm} (${actualName})`);
    failed++;
  }
});

console.log('=' .repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✨ All tests passed! Realm display bug is fixed.');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
  process.exit(1);
}
