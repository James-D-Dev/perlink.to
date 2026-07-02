---
description: How to create a new bio block widget
---

# How to Create a New Bio Block Widget

This guide explains how to add a new block type to the bio page system.

## Overview

To create a new block widget, you need to modify 5 files:

1. `app/types/bio.ts` - Add block type definition
2. `app/components/bio/BioBlock[Name].vue` - Create the editor component
3. `app/components/bio/BioEditor.vue` - Add to block list in editor
4. `app/components/modals/BlockSelectionModal.vue` - Add to selection modal
5. `app/components/BioPageView.vue` - Add display rendering

---

## Step 1: Define Block Type

**File:** `app/types/bio.ts`

Add your block to the `BioBlock` union type around line 286:

```typescript
export type BioBlock =
  | { name: 'header'; index: number; hidden: boolean; data: HeaderData }
  | { name: 'links'; index: number; hidden: boolean; data: LinksData }
  | { name: 'social'; index: number; hidden: boolean; data: SocialData }
  | { name: 'image-album'; index: number; hidden: boolean; data: ImageAlbumData }
  | { name: 'vietqr'; index: number; hidden: boolean; data: VietQRData }
  | { name: 'your-block'; index: number; hidden: boolean; data: YourBlockData }; // <-- Add here
```

Define your block's data interface:

```typescript
export interface YourBlockData {
  // Required fields
  title: string;
  
  // Optional fields
  description?: string;
  url?: string;
  enabled?: boolean;
  
  // Array fields
  items?: YourBlockItem[];
}

export interface YourBlockItem {
  id: string;
  label: string;
  value: string;
}
```

---

## Step 2: Create Editor Component

**File:** `app/components/bio/BioBlock[YourBlock].vue`

Template structure (follow BioBlockSocial.vue pattern):

```vue
<template>
  <div id="your-block" :class="cardAppearClasses">
    <!-- Header -->
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="linksBlock?.hidden"
      title="Your Block Title"
      icon="i-lucide-icon-name"
      @toggle="$emit('toggle')"
      @toggleHidden="toggleBlockHidden('your-block')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="$emit('remove')"
        />
      </template>
    </BioBlockItemHeader>

    <!-- Content (shown when active) -->
    <div v-show="isActive" :class="contentAppearClasses">
      <div class="space-y-3">
        <!-- Your form fields here -->
        <UFormField label="Title">
          <UInput
            :model-value="data.title"
            @update:model-value="updateField('title', $event)"
          />
        </UFormField>
        
        <!-- Add more fields as needed -->
      </div>
    </div>
  </div>
</template>
```

Script setup:

```vue
<script setup lang="ts">
import type { YourBlockData } from '~/types/bio';

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

const emit = defineEmits<{
  toggle: [];
  remove: [];
  update: [data: YourBlockData];
}>();

// Use composable
const { 
  data, 
  block: yourBlock, 
  updateField,
  toggleBlockHidden 
} = useBioBlockData<YourBlockData>({
  blocks: toRef(props, 'blocks'),
  blockName: 'your-block',
  defaultData: {
    title: '',
    description: '',
    enabled: true
  }
});

// Animation classes
const { cardAppearClasses, contentAppearClasses } = useBlockAnimation(
  () => props.isActive
);
</script>
```

---

## Step 3: Add to BioEditor

**File:** `app/components/bio/BioEditor.vue`

Around line 77 (after other blocks), add:

```vue
<!-- Your Block -->
<BioBlockYourBlock
  v-if="block.name === 'your-block'"
  :is-active="activeBlock === 'your-block'"
  :blocks="blocksRef"
  @toggle="$emit('toggleBlock', 'your-block')"
  @remove="onRemoveBlock('your-block')"
  @update="onUpdateYourBlock"
/>
```

Add import and handler:

```typescript
import BioBlockYourBlock from './BioBlockYourBlock.vue';

// Handler
function onUpdateYourBlock(data: YourBlockData) {
  const index = localBlocks.value.findIndex(b => b.name === 'your-block');
  if (index !== -1) {
    localBlocks.value[index].data = data;
    emit('updateBlocks', [...localBlocks.value]);
  }
}
```

Add to `enabledBlocks` default if needed:

```typescript
enabledBlocks: () => ["header", "links", "social", "your-block"],
```

---

## Step 4: Add to Block Selection Modal

**File:** `app/components/modals/BlockSelectionModal.vue`

Around line 84, add to `availableBlocks` array:

```typescript
const availableBlocks = [
  // ... existing blocks
  {
    id: 'your-block',
    name: 'Your Block',
    description: 'Description of what this block does',
    icon: 'i-lucide-icon-name',
    colorClass: 'bg-blue-100 text-blue-600'
  },
]
```

---

## Step 5: Add Display Rendering

**File:** `app/components/BioPageView.vue`

Around line 271 (after other blocks), add:

```vue
<!-- Your Block -->
<YourBlockDisplay
  v-if="block.name === 'your-block'"
  id="your-block-block"
  :data="block.data"
  :class="getBlockSpacing(block.name)"
/>
```

Add import:

```typescript
import YourBlockDisplay from './bio/YourBlockDisplay.vue';
```

---

## Step 6: Create Display Component (Optional)

**File:** `app/components/bio/YourBlockDisplay.vue`

For complex blocks, create a separate display component:

### Tailwind CSS Best Practices

**Use inline Tailwind classes directly on elements** instead of `@apply` in scoped styles. This improves:
- **Performance** - No CSS processing overhead
- **Maintainability** - Classes are visible in template
- **Consistency** - Follows project conventions

**Don't do this (bad):**
```vue
<template>
  <div class="your-block-display">
    <!-- ... -->
  </div>
</template>

<style scoped>
.your-block-display {
  @apply p-4 rounded-lg bg-white;  // Avoid @apply
}
</style>
```

**Do this (good):**
```vue
<template>
  <div class="p-4 rounded-lg bg-white">
    <!-- ... -->
  </div>
</template>
```

**Dynamic theme example:**
```vue
<template>
  <div 
    class="p-6 rounded-2xl text-center"
    :class="themeClasses"
  >
    <h3 class="text-xl font-bold">{{ data.title }}</h3>
  </div>
</template>

<script setup>
const themeClasses = computed(() => {
  const themes = {
    'classic': 'bg-pink-400 text-white',
    'modern': 'bg-blue-400 text-white',
    'minimal': 'bg-gray-100 text-gray-800',
  };
  return themes[props.data.theme] || themes.classic;
});
</script>
```

**File:** `app/components/bio/YourBlockDisplay.vue`

```vue
<template>
  <div class="p-4 rounded-lg bg-white">
    <!-- Render your block content -->
    <h3 v-if="data.title" class="text-lg font-semibold">{{ data.title }}</h3>
    <p v-if="data.description" class="text-sm text-gray-600">{{ data.description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { YourBlockData } from '~/types/bio';

defineProps<{
  data: YourBlockData;
}>();
</script>
```

---

## Block ID Reference

For scroll-to-block functionality, use these IDs:

| Block Name | ID Attribute |
|------------|-------------|
| header | `id="header-block"` |
| links | `id="links-block"` |
| social | `id="social-block"` |
| image-album | `id="image-album-block"` |
| vietqr | `id="vietqr-block"` |
| your-block | `id="your-block-block"` |

---

## Example: Complete Block Implementation

### Type Definition

```typescript
// app/types/bio.ts
export interface CountdownData {
  title: string;
  targetDate: string;
  description?: string;
  showSeconds: boolean;
}
```

### Editor Component

```vue
<!-- app/components/bio/BioBlockCountdown.vue -->
<template>
  <div id="countdown" :class="cardAppearClasses">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="countdownBlock?.hidden"
      title="Countdown"
      icon="i-lucide-timer"
      @toggle="$emit('toggle')"
      @toggleHidden="toggleBlockHidden('countdown')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="$emit('remove')"
        />
      </template>
    </BioBlockItemHeader>

    <div v-show="isActive" :class="contentAppearClasses">
      <div class="space-y-3">
        <UFormField label="Title">
          <UInput
            :model-value="data.title"
            placeholder="Event name"
            @update:model-value="updateField('title', $event)"
          />
        </UFormField>
        
        <UFormField label="Target Date">
          <UInput
            type="datetime-local"
            :model-value="data.targetDate"
            @update:model-value="updateField('targetDate', $event)"
          />
        </UFormField>
        
        <UCheckbox
          :model-value="data.showSeconds"
          label="Show seconds"
          @update:model-value="updateField('showSeconds', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountdownData } from '~/types/bio';

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

const emit = defineEmits<{
  toggle: [];
  remove: [];
  update: [data: CountdownData];
}>();

const { data, block: countdownBlock, updateField, toggleBlockHidden } = 
  useBioBlockData<CountdownData>({
    blocks: toRef(props, 'blocks'),
    blockName: 'countdown',
    defaultData: {
      title: '',
      targetDate: '',
      showSeconds: true
    }
  });

const { cardAppearClasses, contentAppearClasses } = useBlockAnimation(
  () => props.isActive
);
</script>
```

---

## Common Patterns

### Using Composables

Most blocks use these composables:

```typescript
// Block data management
const { data, block, updateField, toggleBlockHidden } = useBioBlockData<T>({
  blocks: toRef(props, 'blocks'),
  blockName: 'your-block',
  defaultData: { ... }
});

// Animation
const { cardAppearClasses, contentAppearClasses } = useBlockAnimation(
  () => props.isActive
);
```

### Updating Block Data

Always emit a new array reference when updating:

```typescript
function onUpdateBlock(data: BlockData) {
  const index = localBlocks.value.findIndex(b => b.name === 'your-block');
  if (index !== -1) {
    localBlocks.value[index].data = data;
    emit('updateBlocks', [...localBlocks.value]); // New array reference
  }
}
```

---

## Testing Checklist

- [ ] Block appears in BlockSelectionModal
- [ ] Can add block to bio page
- [ ] Block renders in editor with header
- [ ] Block can be toggled open/closed
- [ ] Block can be hidden/shown
- [ ] Block can be removed
- [ ] Block data saves correctly
- [ ] Block displays correctly in preview
- [ ] Scroll-to-block works (if applicable)
- [ ] Tailwind classes are inline (no @apply in styles)
- [ ] Theme classes work correctly
