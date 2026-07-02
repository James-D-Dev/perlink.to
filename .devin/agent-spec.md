# Perlink.to - Agent Specification

## Project Overview

**Perlink.to** là SaaS platform cho phép người dùng tạo bio link pages, short URLs, và QR codes. Tối ưu chi phí vận hành trên Cloudflare Workers + R2 + D1.

---

## Core Features (Implemented)

### 1. Landing Page
- **Location**: `app/pages/index.vue`
- **Tech**: Nuxt 4, Nuxt UI, TailwindCSS v4
- **Highlights**:
  - Animated hero section với UCarousel testimonials
  - SEO-optimized H1 structure (sr-only + visual)
  - Gradient effects, glassmorphism UI
  - Responsive design

### 2. Google Authentication
- **API**: `server/api/auth/google.get.ts`
- **Flow**: OAuth Google → ProfileRepository → Session
- **Middleware**: `server/middleware/auth.ts`
- **Session**: `nuxt-auth-utils` + encrypted cookies

### 3. Bio Page Builder
- **Admin UI**: `app/pages/admin/bio.vue` - Professional template selection & editor
- **Public Page**: `app/pages/[username].vue` - Published bio page display
- **Components**:
  - `TemplateSelector`: Grid of professional templates (Modern, Minimal, Creative, Professional)
  - `BioEditorForm`: Multi-section form for bio info, links, social media
  - `BioPreview`: Live preview with device mockup
  - `BioLinkItem`: Draggable link item with icon, title, URL
- **Repository**: `server/repositories/bioRepository.ts`
- **Schema** (`bio_pages` table):
  - `id`, `user_id`, `username` (unique slug)
  - `title`, `bio`, `avatar_url`
  - `template_id`, `theme_config` (JSON: colors, fonts)
  - `links` (JSON array: title, url, icon, order)
  - `social_links` (JSON: facebook, twitter, instagram, etc.)
  - `is_published`, `view_count`
  - `created_at`, `updated_at`
- **Features**:
  - 4 Professional Templates: Modern Gradient, Minimal Clean, Creative Cards, Professional Dark
  - Drag-drop link reordering
  - Custom theme colors & fonts
  - Social media icons (Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok)
  - Live preview before publish
  - SEO meta tags for bio pages

### 4. Short Link System
- **Create**: `app/pages/admin/create.vue`
- **API**: 
  - POST `server/api/links/index.post.ts`
  - GET `server/api/links/[short_code].get.ts`
- **Validation**: Short code uniqueness, URL format
- **Repository**: `server/repositories/linkRepository.ts`

### 5. Click Analytics
- **Tracking**: Increment counters on each visit
- **Stats**: Views, clicks by link
- **Dashboard**: Admin links list with metrics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4.4.4 |
| UI Library | @nuxt/ui ^4.7.0 |
| Styling | TailwindCSS 4 |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 (for images) |
| Hosting | Cloudflare Pages |
| Auth | nuxt-auth-utils |
| Icons | @nuxt/icon (Iconify) |

---

## SEO Strategy

### Target Keywords
1. **"link bio"** - Primary keyword
2. **"bio link"** - Secondary keyword  
3. **"short link"** - Feature keyword
4. **"qr code link"** - Feature keyword

### On-Page SEO Implementation
- [x] Semantic HTML (proper H1, H2 structure)
- [x] Meta tags via `useHead()` / `useSeoMeta()`
- [x] SSR rendering (Nuxt SSG/SSR)
- [x] Alt text cho images
- [x] Canonical URLs

### Content Strategy
- Blog posts về "best bio link tools"
- Comparison pages: "Linktree vs Perlink"
- Landing pages for each keyword

---

## Business Model

### Cost Structure (Cloudflare)
- **Workers**: Free tier (100k req/day)
- **D1 Database**: Free tier (5M rows read/day)
- **R2 Storage**: Free tier (10GB)
- **Total monthly**: ~$0-5

### Revenue Potential
- **Free tier**: Basic bio page + 10 short links
- **Pro tier**: $5/month - Unlimited links, custom domain, analytics
- **Team tier**: $15/month - Multiple users, admin panel

### Break-even Analysis
- 200 paid users × $5 = $1,000/month revenue
- Cloudflare costs: <$20/month
- **Profit margin**: ~98%

---

## Agent Skills Required

### Frontend
- Nuxt 4 + Vue 3 Composition API
- Nuxt UI components (UButton, UCarousel, UAvatar, etc.)
- TailwindCSS v4 with custom colors
- Responsive design patterns

### Backend
- Nitro server routes
- D1 Database queries
- Authentication flows (OAuth)
- Validation with Zod

### DevOps
- Cloudflare Workers/Pages deployment
- Wrangler CLI configuration
- D1 migrations
- Environment variables management

### SEO
- Meta tag optimization
- Keyword research & implementation
- Structured data (JSON-LD)
- Performance optimization (Core Web Vitals)

---

## Project Structure

```
perlink-app/
├── app/
│   ├── components/       # Vue components
│   ├── layouts/          # Nuxt layouts
│   ├── pages/           # Route pages
│   │   ├── index.vue    # Landing page
│   │   ├── login.vue    # Auth page
│   │   └── admin/       # Dashboard pages
│   └── assets/          # Static assets
├── server/
│   ├── api/            # API routes
│   ├── middleware/     # Auth middleware
│   └── repositories/   # Database layer
├── server/migrations/  # D1 migrations
└── wrangler.jsonc      # Cloudflare config
```

---

## Next Development Priorities

1. **Custom Domain Support** - CNAME routing
2. **Advanced Analytics** - Click tracking, referrers
3. **QR Code Generation** - Built-in QR for each link
4. **Template System** - Pre-designed bio page themes
5. **API Access** - REST API for power users

---

## Keywords Implementation Status

| Keyword | Location | Status |
|---------|----------|--------|
| link bio | Landing H1, Meta | ✅ |
| bio link | Content sections | ✅ |
| short link | Feature cards | ✅ |
| qr code link | Feature description | 🔄 |

---

*Document created for Windsurf Agent context*
