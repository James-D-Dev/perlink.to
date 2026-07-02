---
description: Perlink Pricing Tiers Specification (Free, Starter, Plus, Pro)
---

# Perlink Pricing Tiers Specification

## Overview

Perlink offers 4 pricing tiers: **Free**, **Starter** ($5), **Plus** ($9), and **Pro** ($29). Each tier has different limits and features.

## Database Schema

### profiles table

Add `plan` field to track user's subscription tier:

```sql
-- Add plan column to profiles table
ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';

-- Create index for plan queries
CREATE INDEX idx_profiles_plan ON profiles(plan);
```

**Plan values:** `free`, `starter`, `plus`, `pro`

## Feature Matrix

| Feature | Free | Starter | Plus | Pro |
|---------|------|---------|------|-----|
| **Bio Profiles** | 1 | 2 | 10 | Unlimited |
| **Branding** | Perlink branding | Perlink branding | Remove branding | Remove branding |
| **QR Codes** | Basic | Custom | Customizable | Advanced (API, bulk) |
| **Analytics** | 30 days | 90 days | Full history | Advanced analytics |
| **Short Links** | 10 | 100 | 500 | Unlimited |
| **Themes** | 1 custom | 5 custom | Premium themes | Custom CSS |
| **Custom Domain** | - | - | ✓ | ✓ |
| **Team Features** | - | - | - | ✓ (5 members) |
| **Priority Support** | - | - | Email | Priority + Slack |
| **API Access** | - | - | Read-only | Full access |

## Implementation Guide

### 1. Check User Plan

```typescript
// server/utils/plans.ts
export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PLUS: 'plus',
  PRO: 'pro'
} as const;

export type Plan = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    maxProfiles: 1,
    maxShortLinks: 10,
    analyticsDays: 30,
    customThemes: 1,
    branding: true,
    customDomain: false
  },
  [PLANS.STARTER]: {
    maxProfiles: 2,
    maxShortLinks: 100,
    analyticsDays: 90,
    customThemes: 5,
    branding: true,
    customDomain: false
  },
  [PLANS.PLUS]: {
    maxProfiles: 10,
    maxShortLinks: 500,
    analyticsDays: null, // unlimited
    customThemes: Infinity,
    branding: false,
    customDomain: true
  },
  [PLANS.PRO]: {
    maxProfiles: Infinity,
    maxShortLinks: Infinity,
    analyticsDays: null,
    customThemes: Infinity,
    branding: false,
    customDomain: true,
    teamMembers: 5
  }
};

// Check if user can create more profiles
export function canCreateProfile(plan: Plan, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].maxProfiles;
  return limit === Infinity || currentCount < limit;
}

// Check if user can create more short links
export function canCreateShortLink(plan: Plan, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].maxShortLinks;
  return limit === Infinity || currentCount < limit;
}
```

### 2. API Middleware

```typescript
// server/middleware/plan-check.ts
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const plan = user.plan || 'free';
  
  // Attach plan to context for use in handlers
  event.context.plan = plan;
  event.context.planLimits = PLAN_LIMITS[plan];
});
```

### 3. Check Limits in API Routes

```typescript
// Example: Creating a new bio page
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const plan = event.context.plan;
  
  // Count existing profiles
  const db = getDB();
  const profileCount = await db
    .prepare('SELECT COUNT(*) as count FROM links WHERE user_id = ? AND type = ?')
    .bind(user.id, 'profile')
    .first<{ count: number }>();
  
  // Check limit
  if (!canCreateProfile(plan, profileCount?.count || 0)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Free plan limited to 1 profile. Upgrade to Pro for 10 profiles or Business for unlimited.`
    });
  }
  
  // ... create profile
});
```

### 4. Frontend Plan Badge

```vue
<!-- components/PlanBadge.vue -->
<template>
  <UBadge 
    :color="planColor" 
    :variant="plan === 'free' ? 'soft' : 'solid'"
    size="sm"
  >
    {{ planLabel }}
  </UBadge>
</template>

<script setup>
const props = defineProps<{
  plan: 'free' | 'pro' | 'business'
}>();

const planLabel = computed(() => ({
  free: 'Free',
  pro: 'Pro',
  business: 'Business'
}[props.plan]));

const planColor = computed(() => ({
  free: 'neutral',
  pro: 'primary',
  business: 'success'
}[props.plan]));
</script>
```

### 5. Upgrade Prompts

Show upgrade prompts when users hit limits:

```vue
<!-- components/UpgradePrompt.vue -->
<template>
  <UAlert
    v-if="showUpgrade"
    color="primary"
    variant="soft"
    title="Upgrade to unlock more features"
    :description="message"
  >
    <template #actions>
      <UButton to="/admin/upgrade" color="primary">
        Upgrade Now
      </UButton>
    </template>
  </UAlert>
</template>
```

## Migration Steps

1. **Add plan column** - Run migration `0015_add_plan_column.sql`
2. **Set default plans** - Update existing users: `UPDATE profiles SET plan = 'free'`
3. **Update API routes** - Add plan checks to profile/link creation
4. **Update frontend** - Show plan badges and upgrade prompts
5. **Create pricing page** - `/admin/upgrade` for plan selection

## Future Enhancements

- Trial period for Pro/Business
- Team member invites
- Usage analytics dashboard
- Automatic plan downgrade on expiry
- Webhook for plan changes
