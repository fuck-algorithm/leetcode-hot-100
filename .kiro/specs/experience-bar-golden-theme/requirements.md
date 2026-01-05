# Requirements Document

## Introduction

将经验条（ExperienceBar）组件的颜色主题从绿色改为金色，以更好地契合修仙/玄幻风格。金色在中国传统文化中象征着尊贵、仙气和突破，更符合"修仙"的主题意境。

## Glossary

- **Experience_Bar**: 显示用户当前经验值和境界等级的UI组件
- **Golden_Theme**: 金色主题配色方案，包括金色、琥珀色、暖黄色等色调
- **Cultivation_Style**: 修仙风格，强调仙气、灵力、古风元素

## Requirements

### Requirement 1: 经验条容器金色主题

**User Story:** As a user, I want the experience bar to have a golden theme, so that it feels more aligned with the cultivation/immortal cultivation aesthetic.

#### Acceptance Criteria

1. THE Experience_Bar container border SHALL use golden color tones (amber/gold shades) instead of green
2. THE Experience_Bar container glow effects SHALL use golden/amber colors for the outer glow and shadows
3. THE Experience_Bar container inner decorative gradients SHALL use golden color variations
4. WHEN the shimmer animation plays, THE Experience_Bar SHALL display golden light flow effects

### Requirement 2: 境界徽章金色主题

**User Story:** As a user, I want the realm badge to use golden colors, so that it represents the prestigious nature of cultivation realms.

#### Acceptance Criteria

1. THE Realm_Badge background gradient SHALL use golden/amber tones
2. THE Realm_Badge border SHALL use golden color with appropriate opacity
3. THE Realm_Badge glow animation SHALL use golden light effects
4. THE Realm_Name text SHALL use golden color with golden text shadow effects
5. THE Realm_Icon filter SHALL use golden drop-shadow instead of green

### Requirement 3: 经验进度条金色主题

**User Story:** As a user, I want the progress bar fill to be golden, so that my progress feels like accumulating golden spiritual energy.

#### Acceptance Criteria

1. THE Progress_Bar fill gradient SHALL transition through golden shades (dark gold to bright gold to light gold)
2. THE Progress_Bar fill glow effects SHALL use golden/amber colors
3. THE Progress_Bar track border SHALL use golden color with appropriate opacity
4. WHEN the fill glow animation plays, THE Progress_Bar SHALL pulse with golden light

### Requirement 4: 文字和辅助元素金色主题

**User Story:** As a user, I want all text and helper elements to match the golden theme, so that the design is cohesive.

#### Acceptance Criteria

1. THE EXP_Current text SHALL use golden color with golden text shadow
2. THE Help_Icon SHALL use golden border and golden text color
3. WHEN hovering over Help_Icon, THE Help_Icon SHALL show golden glow effect
4. THE EXP_Gain_Popup SHALL use golden colors for background, border, and text

### Requirement 5: 保持视觉层次和可读性

**User Story:** As a user, I want the golden theme to maintain good contrast and readability, so that I can easily see my progress.

#### Acceptance Criteria

1. THE golden colors SHALL maintain sufficient contrast against the dark background
2. THE text elements SHALL remain clearly readable with the new color scheme
3. THE progress bar fill SHALL be clearly distinguishable from the track background
4. THE animations SHALL not be too bright or distracting

