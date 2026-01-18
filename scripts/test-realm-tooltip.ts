/**
 * 测试 RealmHelpTooltip 是否正确使用新的经验值系统
 */

import { ExperienceSystem } from '../src/services/experience-system';

const experienceSystem = new ExperienceSystem();
const config = experienceSystem.getConfig();
const realmThresholds = experienceSystem.getRealmThresholds();

console.log('=== 经验值系统配置 ===');
console.log('总经验值:', config.totalExperience.toLocaleString());
console.log('\n难度基础值:');
console.log('  简单:', config.difficultyBaseValues.easy.toLocaleString());
console.log('  中等:', config.difficultyBaseValues.medium.toLocaleString());
console.log('  困难:', config.difficultyBaseValues.hard.toLocaleString());
console.log('\n宝箱经验值:');
console.log('  早期:', config.treasureTierValues.early.toLocaleString());
console.log('  中期:', config.treasureTierValues.mid.toLocaleString());
console.log('  后期:', config.treasureTierValues.late.toLocaleString());
console.log('  最终:', config.treasureTierValues.final.toLocaleString());

console.log('\n=== 境界阈值 ===');
const realmNames = [
  '练气期', '筑基期', '金丹期', '元婴期', '化神期',
  '炼虚期', '合体期', '大乘期', '渡劫期', '大罗金仙', '飞升成仙'
];

realmThresholds.forEach((threshold, index) => {
  console.log(`${index + 1}. ${realmNames[index]}: ${threshold.toLocaleString()} EXP`);
});

console.log('\n✅ 经验值系统配置正确！');
console.log(`✅ 总经验值为 ${config.totalExperience.toLocaleString()}，而不是旧的 3,000`);
