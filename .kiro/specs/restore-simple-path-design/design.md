# Design Document: Restore Simple Path Design

## Overview

This design document outlines the restoration of a cleaner, simpler path visualization for LeetCode problems. The current DuolingoPath component has become overly complex with excessive visual effects that detract from usability. This design will create a clean, readable path similar to the existing PathOverview component but adapted for individual problem display.

## Architecture

The simplified path design will maintain the existing component structure but with streamlined styling and reduced complexity:

```
DuolingoPath (Simplified)
├── Container (clean background)
├── SVG Path Layer (simple connections)
├── Nodes Container
│   ├── Node (circular, clean design)
│   ├── Progress Indicator (optional ring)
│   └── Problem Info (minimal overlay)
└── Milestone Markers (start/end)
```

## Components and Interfaces

### Core Component Structure

```typescript
interface SimplifiedPathProps {
  problems: Problem[];
  currentLang: string;
  t: (key: string) => string;
  handleAnimationClick: (event: React.MouseEvent, questionId: string, hasAnimation: boolean, title?: string, t?: (key: string) => string, pagesUrl?: string | null) => void;
  isCompleted: (problemId: string) => boolean;
  onToggleCompletion: (problemId: string) => Promise<void>;
}

interface NodePosition {
  xPercent: number;
  xPixel: number;
  yPosition: number;
  index: number;
}

interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}
```

### Simplified Node Design

The node design will be dramatically simplified:

- **Shape**: Perfect circle with clean border
- **Size**: 70px diameter (consistent across all states)
- **Content**: Problem number or checkmark only
- **Colors**: Single solid color based on difficulty
- **Effects**: Simple hover scale (1.05x) only

### Clean Connection Lines

Connection lines will use simple SVG paths:

- **Style**: Single stroke, no patterns
- **Width**: 8px consistent width
- **Color**: Gray for incomplete, green for completed paths
- **Animation**: None (static)

## Data Models

### Node State Model

```typescript
interface NodeState {
  id: string;
  position: NodePosition;
  isCompleted: boolean;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  hasAnimation: boolean;
  isCurrentProgress: boolean;
}
```

### Path Configuration

```typescript
interface PathConfig {
  nodeSize: number;           // 70px
  nodeSpacing: number;        // 120px vertical
  pathWidth: number;          // 8px
  containerPadding: number;   // 40px
  animationDuration: number;  // 200ms
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Node Visual Simplicity
*For any* rendered node, the element should have circular shape with clean borders and single solid background color without complex 3D effects or multiple gradient layers
**Validates: Requirements 1.1, 1.4, 1.5**

### Property 2: Node Content Based on Completion State
*For any* problem node, if the problem is completed then the node displays a checkmark icon, otherwise it displays the problem number
**Validates: Requirements 1.2, 1.3**

### Property 3: Connection Line Simplicity
*For any* connection line between nodes, the element should be a simple SVG path with single solid color or simple gradient, consistent stroke width, and no dotted patterns or animations
**Validates: Requirements 2.1, 2.2, 2.3, 2.5, 3.4**

### Property 4: Connection Color Based on Completion
*For any* connection line between two nodes, if both connected nodes are completed then the line shows completion color, otherwise it shows default color
**Validates: Requirements 2.4**

### Property 5: Animation Constraints
*For any* interactive element, hover effects should only apply simple scale transforms, animation durations should be ≤200ms, and no pulsing rings or complex animations should be present
**Validates: Requirements 3.1, 3.2, 3.5**

### Property 6: Smooth State Transitions
*For any* node state change, the transition should use CSS transition properties for smooth visual updates
**Validates: Requirements 3.3**

### Property 7: Visual Accessibility
*For any* node state, there should be clear contrast between completed and incomplete states, difficulty colors should be distinct and accessible, and node sizes should meet minimum touch target requirements
**Validates: Requirements 4.1, 4.3, 4.4**

### Property 8: Content Readability
*For any* text element, the styling should prioritize readability without excessive decorations and follow consistent design system principles
**Validates: Requirements 4.2, 4.5**

### Property 9: Responsive Adaptation
*For any* screen size, the path view should adapt appropriately with proper node scaling, connection line proportions, and no horizontal scrolling on mobile devices
**Validates: Requirements 5.1, 5.2, 5.3, 5.5**

### Property 10: Performance Optimization
*For any* interaction or rendering scenario, the component should render smoothly with large datasets, use optimized SVG elements, avoid unnecessary re-renders, and maintain stable memory usage
**Validates: Requirements 6.1, 6.2, 6.3, 6.5**

### Property 11: Hardware-Accelerated Animations
*For any* animation effect, CSS transforms should be used instead of layout-affecting properties to ensure hardware acceleration
**Validates: Requirements 6.4**

## Error Handling

### Invalid Problem Data
- **Scenario**: Missing or malformed problem data
- **Handling**: Display placeholder node with error indicator
- **Recovery**: Skip invalid problems, continue rendering valid ones

### SVG Rendering Failures
- **Scenario**: SVG path calculation errors
- **Handling**: Fall back to straight line connections
- **Recovery**: Log error, maintain basic functionality

### Performance Degradation
- **Scenario**: Large number of problems (>200)
- **Handling**: Implement virtualization or pagination
- **Recovery**: Warn user, offer alternative view modes

## Testing Strategy

### Unit Testing Approach
- **Node Rendering**: Test individual node states and styling
- **Path Calculations**: Verify position calculations for different layouts
- **Event Handling**: Test click, hover, and completion toggle interactions
- **Responsive Behavior**: Test component at different viewport sizes

### Property-Based Testing Configuration
- **Framework**: Use React Testing Library with Jest
- **Iterations**: Minimum 100 iterations per property test
- **Test Data**: Generate random problem arrays, completion states, and viewport sizes
- **Coverage**: Each correctness property implemented as separate test

### Integration Testing
- **Component Integration**: Test with parent PathView component
- **State Management**: Verify completion state persistence
- **Performance Testing**: Measure rendering time with large datasets
- **Accessibility Testing**: Verify keyboard navigation and screen reader support

### Visual Regression Testing
- **Snapshot Testing**: Capture component renders for different states
- **Cross-Browser**: Test rendering consistency across browsers
- **Mobile Testing**: Verify appearance on various mobile devices