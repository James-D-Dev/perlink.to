# QRCodeVue3 Plugin Specification

## Architecture Overview

```
app/plugins/QRCodeVue3/
├── index.vue              # Main entry - wraps QRCodeVue3Async with Suspense
├── QRCodeVue3Async.vue    # Async component - creates QR code instance
├── core/                  # Core rendering logic
│   ├── QRCodeStyling.ts   # Main class orchestrating QR generation
│   ├── QRCanvas.ts        # Canvas rendering logic
│   ├── QRDot.ts          # Dot pattern rendering (6 styles)
│   ├── QRCornerSquare.ts  # Corner square rendering (3 styles)
│   ├── QRCornerDot.ts     # Corner dot rendering (2 styles)
│   └── QROptions.ts       # Type definitions & default options
├── constants/             # Style type constants
│   ├── dotTypes.ts        # 6 dot styles
│   ├── cornerSquareTypes.ts # 3 corner square styles
│   ├── cornerDotTypes.ts  # 2 corner dot styles
│   └── ...
├── types/                 # TypeScript type definitions
│   └── index.ts
└── tools/                 # Utility functions
```

## Style Types Reference

| Element | File | Available Types | Count |
|---------|------|-----------------|-------|
| **Dots** | `constants/dotTypes.ts` | `dots`, `rounded`, `classy`, `classy-rounded`, `square`, `extra-rounded` | 6 |
| **Corner Square** | `constants/cornerSquareTypes.ts` | `dot`, `square`, `extra-rounded` | 3 |
| **Corner Dot** | `constants/cornerDotTypes.ts` | `dot`, `square` | 2 |

## How QR Code Rendering Works

1. **QRCodeStyling** creates QR code data using `qrcode-generator`
2. **QRCanvas** renders to HTML5 Canvas
3. Each module type (Dot/CornerSquare/CornerDot) has its own renderer class

---

## Creating a New Dots Style

### Step 1: Add Type to Constants

**File:** `constants/dotTypes.ts`

```typescript
export default {
  dots: "dots",
  rounded: "rounded",
  classy: "classy",
  classyRounded: "classy-rounded",
  square: "square",
  extraRounded: "extra-rounded",
  myCustom: "my-custom"  // <-- Add new style
} as DotTypes;
```

### Step 2: Update Type Definition

**File:** `types/index.ts`

```typescript
export type DotType = "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded" | "my-custom";
```

### Step 3: Implement Drawing Logic

**File:** `core/QRDot.ts`

Add case in `draw()` method:
```typescript
switch (type) {
  case dotTypes.dots:
    drawFunction = this._drawDot;
    break;
  // ... existing cases
  case dotTypes.myCustom:
    drawFunction = this._drawMyCustom;
    break;
  case dotTypes.square:
  default:
    drawFunction = this._drawSquare;
}
```

Implement drawing method:
```typescript
_drawMyCustom({ x, y, size, context, getNeighbor }: DrawArgs): void {
  // Check neighbors for connected styling
  const leftNeighbor = +getNeighbor(-1, 0);
  const topNeighbor = +getNeighbor(0, -1);
  
  // Example: Diamond shape
  this._rotateFigure({
    x, y, size, context,
    rotation: 0,
    draw: () => {
      context.moveTo(0, -size / 2);
      context.lineTo(size / 2, 0);
      context.lineTo(0, size / 2);
      context.lineTo(-size / 2, 0);
      context.closePath();
    }
  });
}
```

### Available Helper Methods in QRDot

| Method | Description |
|--------|-------------|
| `_basicDot(args)` | Draw circle |
| `_basicSquare(args)` | Draw square |
| `_basicSideRounded(args)` | Rounded on one side |
| `_basicCornerRounded(args)` | Rounded corner |
| `_basicCornerExtraRounded(args)` | Extra rounded corner |
| `_basicCornersRounded(args)` | Both corners rounded |
| `_basicCornersExtraRounded(args)` | Both corners extra rounded |
| `_rotateFigure(args)` | Rotate before drawing |

---

## Creating a New Corners Square Style

### Step 1: Add Type to Constants

**File:** `constants/cornerSquareTypes.ts`

```typescript
export default {
  dot: "dot",
  square: "square",
  extraRounded: "extra-rounded",
  myCustom: "my-custom"  // <-- Add new style
} as CornerSquareTypes;
```

### Step 2: Update Type Definition

**File:** `types/index.ts`

```typescript
export type CornerSquareType = "dot" | "square" | "extra-rounded" | "my-custom";
```

### Step 3: Implement Drawing Logic

**File:** `core/QRCornerSquare.ts`

Add case in `draw()`:
```typescript
switch (type) {
  case cornerSquareTypes.square:
    drawFunction = this._drawSquare;
    break;
  case cornerSquareTypes.extraRounded:
    drawFunction = this._drawExtraRounded;
    break;
  case cornerSquareTypes.myCustom:
    drawFunction = this._drawMyCustom;
    break;
  case cornerSquareTypes.dot:
  default:
    drawFunction = this._drawDot;
}
```

Implement drawing:
```typescript
_drawMyCustom({ x, y, size, context, rotation }: DrawArgs): void {
  const dotSize = size / 7;
  
  this._rotateFigure({
    x, y, size, context, rotation,
    draw: () => {
      // Outer rounded rect
      context.roundRect(-size / 2, -size / 2, size, size, dotSize);
      // Inner cutout
      context.roundRect(
        -size / 2 + dotSize, 
        -size / 2 + dotSize, 
        size - 2 * dotSize, 
        size - 2 * dotSize, 
        dotSize / 2
      );
    }
  });
}
```

---

## Creating a New Corners Dot Style

### Step 1: Add Type to Constants

**File:** `constants/cornerDotTypes.ts`

```typescript
export default {
  dot: "dot",
  square: "square",
  star: "star"  // <-- Add new style
} as CornerDotTypes;
```

### Step 2: Update Type Definition

**File:** `types/index.ts`

```typescript
export type CornerDotType = "dot" | "square" | "star";
```

### Step 3: Implement Drawing Logic

**File:** `core/QRCornerDot.ts`

Add case:
```typescript
switch (type) {
  case cornerDotTypes.square:
    this._drawSquare({ x, y, size, context, rotation });
    break;
  case cornerDotTypes.star:
    this._drawStar({ x, y, size, context, rotation });
    break;
  case cornerDotTypes.dot:
  default:
    this._drawDot({ x, y, size, context, rotation });
}
```

Implement:
```typescript
_drawStar(args: DrawArgs): void {
  const { size, context } = args;
  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius / 2;
  
  this._rotateFigure({
    ...args,
    draw: () => {
      let rot = Math.PI / 2 * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;
      
      context.moveTo(0, 0 - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = 0 + Math.cos(rot) * outerRadius;
        y = 0 + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;
        
        x = 0 + Math.cos(rot) * innerRadius;
        y = 0 + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(0, 0 - outerRadius);
      context.closePath();
    }
  });
}
```

---

## Canvas Drawing Reference

### Rotation System
All shapes use `_rotateFigure()` which:
1. Translates to center point (x + size/2, y + size/2)
2. Applies rotation (in radians)
3. Executes draw callback
4. Restores context state

### Neighbor Detection (Dots only)
```typescript
const leftNeighbor = +getNeighbor(-1, 0);   // Left cell
const rightNeighbor = +getNeighbor(1, 0);    // Right cell
const topNeighbor = +getNeighbor(0, -1);    // Top cell
const bottomNeighbor = +getNeighbor(0, 1);    // Bottom cell
```

Used for connected styling (e.g., `rounded` style checks neighbors to determine which sides to round).

---

## Usage Example in Components

```vue
<template>
  <QRCodeRender
    :value="url"
    :dots-type="'my-custom'"
    :corners-square-type="'my-custom'"
    :corners-dot-type="'star'"
    foreground="#000"
    background="#fff"
  />
</template>
```

Or programmatically:
```typescript
const qrCode = new QRCodeStyling({
  data: "https://example.com",
  dotsOptions: {
    type: "my-custom",
    color: "#000"
  },
  cornersSquareOptions: {
    type: "my-custom",
    color: "#000"
  },
  cornersDotOptions: {
    type: "star",
    color: "#000"
  }
});
```
