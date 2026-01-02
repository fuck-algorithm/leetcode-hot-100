# Requirements Document

## Introduction

重新设计经验条（ExperienceBar）组件的视觉样式和交互体验。主要目标是移除大圆角设计，采用更现代简洁的风格，并增加一个帮助图标（问号），当用户悬停时显示完整的称号系统说明，包括所有境界等级、所需经验值以及对应的刷题数量参考。

## Glossary

- **Experience_Bar**: 显示用户当前经验值和境界等级的UI组件
- **Realm_System**: 修仙境界称号系统，共10个境界，每个境界3层
- **Help_Tooltip**: 问号帮助图标及其悬停时显示的详细说明弹窗
- **Level**: 用户等级，每100经验升一级
- **EXP**: 经验值单位

## Requirements

### Requirement 1: 移除大圆角设计

**User Story:** As a user, I want a cleaner visual design without large rounded corners, so that the interface looks more modern and professional.

#### Acceptance Criteria

1. THE Experience_Bar SHALL use small border-radius (4px or less) instead of large rounded corners (18px)
2. THE Realm_Badge SHALL use small border-radius (4px or less) instead of large rounded corners (16px)
3. THE Progress_Track SHALL use small border-radius (4px or less) instead of large rounded corners (12px)
4. WHEN the component renders, THE Experience_Bar SHALL maintain visual consistency with a flat, modern design aesthetic

### Requirement 2: 添加帮助图标

**User Story:** As a user, I want to see a help icon that explains the realm system, so that I can understand how the leveling system works.

#### Acceptance Criteria

1. THE Experience_Bar SHALL display a help icon (question mark) near the realm badge
2. THE Help_Icon SHALL be visually subtle but clearly visible
3. THE Help_Icon SHALL use a circular border with small radius to match the new design style
4. WHEN the help icon is rendered, THE Help_Icon SHALL be positioned appropriately without disrupting the layout

### Requirement 3: 帮助提示框内容

**User Story:** As a user, I want to see detailed information about all realms when hovering over the help icon, so that I can understand my progression path.

#### Acceptance Criteria

1. WHEN user hovers over the help icon, THE Help_Tooltip SHALL display a detailed popup
2. THE Help_Tooltip SHALL show all 10 realm names with their corresponding icons
3. THE Help_Tooltip SHALL show the level range for each realm (e.g., Level 1-3 for 练气期)
4. THE Help_Tooltip SHALL show the total EXP required to reach each realm
5. THE Help_Tooltip SHALL show estimated problem counts needed (Easy/Medium/Hard breakdown)
6. THE Help_Tooltip SHALL highlight the user's current realm in the list
7. WHEN user moves mouse away from help icon, THE Help_Tooltip SHALL hide smoothly

### Requirement 4: 经验值计算说明

**User Story:** As a user, I want to understand how experience points are calculated, so that I can plan my learning path.

#### Acceptance Criteria

1. THE Help_Tooltip SHALL explain the EXP values for each difficulty level (Easy: 10, Medium: 20, Hard: 30)
2. THE Help_Tooltip SHALL explain treasure chest rewards (50 EXP each)
3. THE Help_Tooltip SHALL provide example calculations for reaching each realm
4. FOR each realm, THE Help_Tooltip SHALL show approximate problem counts: X Easy + Y Medium + Z Hard

### Requirement 5: 响应式设计

**User Story:** As a user on different devices, I want the experience bar to adapt properly, so that I can use it on mobile and desktop.

#### Acceptance Criteria

1. WHEN viewport width is less than 768px, THE Help_Tooltip SHALL adjust its position to remain visible
2. WHEN viewport width is less than 480px, THE Help_Icon SHALL remain accessible and functional
3. THE Help_Tooltip SHALL not overflow the viewport boundaries on any screen size

### Requirement 6: 国际化支持

**User Story:** As a user who speaks different languages, I want the help content to be displayed in my preferred language.

#### Acceptance Criteria

1. WHEN currentLang is 'zh', THE Help_Tooltip SHALL display content in Chinese
2. WHEN currentLang is 'en', THE Help_Tooltip SHALL display content in English
3. THE realm names SHALL be displayed in the appropriate language based on currentLang
4. THE explanatory text SHALL be fully translated for both supported languages
