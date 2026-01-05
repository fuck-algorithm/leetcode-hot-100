# Requirements Document

## Introduction

修复修仙境界帮助提示框（RealmHelpTooltip）的显示问题。当前的 tooltip 存在两个主要问题：被其他元素遮挡导致无法正常查看，以及深色玄幻风格与页面金色浅色主题不协调。需要重新设计 tooltip 的定位和样式，使其能够正确显示且与页面整体风格一致。

## Glossary

- **RealmHelpTooltip**: 修仙境界帮助提示框组件，用于解释修仙等级系统
- **ExperienceBar**: 经验条组件，包含境界徽章和帮助图标
- **Tooltip**: 鼠标悬停时显示的信息提示框
- **Golden_Theme**: 页面当前使用的金色浅色主题风格

## Requirements

### Requirement 1: Tooltip 定位修复

**User Story:** As a user, I want the realm help tooltip to be fully visible without being obscured by other elements, so that I can read the cultivation realm information clearly.

#### Acceptance Criteria

1. WHEN the user hovers over the help icon, THE RealmHelpTooltip SHALL display completely without being clipped or obscured by any other page elements
2. THE RealmHelpTooltip SHALL have a z-index value high enough to appear above all other page content
3. WHEN the tooltip would overflow the viewport boundaries, THE RealmHelpTooltip SHALL adjust its position to remain fully visible within the viewport
4. THE RealmHelpTooltip SHALL position itself below the help icon with appropriate spacing to avoid overlapping the experience bar content

### Requirement 2: Tooltip 配色与页面风格统一

**User Story:** As a user, I want the realm help tooltip to match the golden theme of the experience bar, so that the visual experience is consistent and harmonious.

#### Acceptance Criteria

1. THE RealmHelpTooltip SHALL use a light golden background color scheme consistent with the ExperienceBar golden theme
2. THE RealmHelpTooltip SHALL use amber/brown text colors (#b45309, #92400e) for primary text to match the experience bar typography
3. THE RealmHelpTooltip border and shadow styles SHALL use golden/amber tones (rgba(245, 158, 11, x)) consistent with the page theme
4. THE RealmHelpTooltip difficulty badges (easy, medium, hard, treasure) SHALL maintain their distinct colors while harmonizing with the golden theme background
5. THE RealmHelpTooltip current realm highlight SHALL use golden accent colors instead of green

### Requirement 3: Tooltip 可读性保持

**User Story:** As a user, I want the tooltip content to remain readable and well-organized after the style changes, so that I can easily understand the realm system.

#### Acceptance Criteria

1. THE RealmHelpTooltip text content SHALL maintain sufficient contrast ratio against the new background for readability
2. THE RealmHelpTooltip realm list items SHALL remain visually distinguishable from each other
3. THE RealmHelpTooltip scrollbar (if visible) SHALL be styled to match the golden theme
4. WHEN viewing on mobile devices, THE RealmHelpTooltip SHALL remain readable and properly positioned
