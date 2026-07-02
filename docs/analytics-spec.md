# Perlink Analytics — Technical Specification

> Analytics áp dụng cho cả **Shortlink** và **Bio Page**.

---

## 1. Kiến trúc tổng quan

```
User click → Cloudflare Worker → Redirect ngay (<100ms)
                                       ↓
                              ctx.waitUntil(...)
                                       ↓
                              Ghi click_events (D1)
                                       ↓ (Cron mỗi 5 phút)
                              Aggregate → link_daily_stats
```

### Nguyên tắc

- Redirect **không bị block** bởi analytics — dùng `ctx.waitUntil()` hoặc ghi async.
- Raw events giữ **30–90 ngày**, aggregate stats giữ **vĩnh viễn**.
- Bot traffic được ghi nhận nhưng **tách riêng**, mặc định dashboard chỉ hiển thị Human.
- Không lưu IP thô lâu dài — chỉ lưu `ip_hash` (SHA-256 truncated).

---

## 2. Database Schema

### 2.1 `click_events` — Raw click log

```sql
CREATE TABLE click_events (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'shortlink', -- 'shortlink' | 'bio'
  timestamp TEXT NOT NULL, -- ISO 8601

  -- Geo
  country TEXT, -- ISO 3166-1 alpha-2 (VN, US, SG...)
  city TEXT,

  -- Device
  device TEXT, -- 'Mobile' | 'Desktop' | 'Tablet'
  os TEXT, -- 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux'
  browser TEXT, -- 'Chrome' | 'Safari' | 'Edge' | 'Samsung' | 'Firefox' | 'Other'

  -- Source
  referrer TEXT, -- domain only: 'tiktok.com', 'facebook.com', 'direct'
  referrer_full TEXT, -- full referrer URL (optional, for debugging)

  -- UTM
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Identity
  ip_hash TEXT, -- SHA-256(ip + daily_salt), truncated 16 chars
  user_agent TEXT,

  -- Classification
  is_bot INTEGER NOT NULL DEFAULT 0, -- 0 = human, 1 = bot
  is_unique INTEGER NOT NULL DEFAULT 0, -- 0 = repeat, 1 = unique (within 24h window)

  -- QR tracking
  source_type TEXT DEFAULT 'direct', -- 'direct' | 'qr' | 'bio' | 'social'

  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_click_events_link_id ON click_events(link_id);
CREATE INDEX idx_click_events_timestamp ON click_events(timestamp);
CREATE INDEX idx_click_events_link_timestamp ON click_events(link_id, timestamp);
CREATE INDEX idx_click_events_ip_hash ON click_events(link_id, ip_hash, timestamp);
```

### 2.2 `link_daily_stats` — Aggregated daily stats

```sql
CREATE TABLE link_daily_stats (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'shortlink',
  date TEXT NOT NULL, -- 'YYYY-MM-DD'

  -- Counts
  total_clicks INTEGER NOT NULL DEFAULT 0,
  unique_clicks INTEGER NOT NULL DEFAULT 0,
  bot_clicks INTEGER NOT NULL DEFAULT 0,

  -- Device breakdown
  mobile_clicks INTEGER NOT NULL DEFAULT 0,
  desktop_clicks INTEGER NOT NULL DEFAULT 0,
  tablet_clicks INTEGER NOT NULL DEFAULT 0,

  -- Top OS (JSON)
  os_breakdown TEXT, -- {"iOS": 120, "Android": 200, ...}

  -- Top browsers (JSON)
  browser_breakdown TEXT, -- {"Chrome": 150, "Safari": 80, ...}

  -- Top countries (JSON)
  country_breakdown TEXT, -- {"VN": 300, "US": 50, ...}

  -- Top cities (JSON)
  city_breakdown TEXT, -- {"Ho Chi Minh City": 150, "Ha Noi": 80, ...}

  -- Top referrers (JSON)
  referrer_breakdown TEXT, -- {"tiktok.com": 200, "facebook.com": 100, "direct": 50}

  -- UTM breakdown (JSON)
  utm_source_breakdown TEXT, -- {"tiktok": 200, "facebook": 100}

  -- Source type breakdown (JSON)
  source_type_breakdown TEXT, -- {"qr": 85, "direct": 200, "bio": 30}

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE(link_id, date)
);

CREATE INDEX idx_link_daily_stats_link_date ON link_daily_stats(link_id, date);
```

---

## 3. Click Tracking Logic

### 3.1 Data Collection (tại thời điểm redirect)

```typescript
interface ClickEvent {
  link_id: string
  link_type: 'shortlink' | 'bio'
  timestamp: string

  country: string | null    // Từ cf.country (Cloudflare header)
  city: string | null       // Từ cf.city

  device: string            // Parse từ User-Agent
  os: string
  browser: string

  referrer: string          // Parse domain từ Referer header
  referrer_full: string

  utm_source: string | null // Parse từ query params của incoming URL
  utm_medium: string | null
  utm_campaign: string | null

  ip_hash: string           // SHA-256(ip + daily_salt).slice(0, 16)
  user_agent: string

  is_bot: boolean           // Detect từ UA list
  is_unique: boolean        // Check ip_hash chưa có trong 24h gần nhất

  source_type: string       // 'qr' nếu có ?ref=qr, 'bio' nếu từ bio page, else 'direct'
}
```

### 3.2 Unique Click Detection

```
unique = không tồn tại record trong click_events với:
  - cùng link_id
  - cùng ip_hash
  - timestamp trong 24h gần nhất
```

### 3.3 Bot Detection

Danh sách bot User-Agent:

```typescript
const BOT_USER_AGENTS = [
  'facebookexternalhit', 'Facebot', 'Twitterbot',
  'LinkedInBot', 'Slackbot', 'TelegramBot',
  'WhatsApp', 'Discordbot', 'Googlebot',
  'bingbot', 'PinterestBot', 'TikTok',
  'Bytespider', 'AhrefsBot', 'SemrushBot',
  'DotBot', 'PetalBot', 'YandexBot',
]
```

### 3.4 QR Source Detection

Khi generate QR Code, append `?ref=qr` vào URL:

```
https://perlink.to/sale?ref=qr
```

Server route detect `ref=qr` → set `source_type = 'qr'`.

---

## 4. Aggregation (Cron Job)

Chạy mỗi **5 phút** (hoặc Cloudflare Cron Trigger):

```sql
-- Aggregate cho ngày hiện tại
INSERT OR REPLACE INTO link_daily_stats (id, link_id, link_type, date, total_clicks, unique_clicks, ...)
SELECT
  link_id || '_' || DATE(timestamp) as id,
  link_id,
  link_type,
  DATE(timestamp) as date,
  COUNT(*) as total_clicks,
  SUM(CASE WHEN is_unique = 1 THEN 1 ELSE 0 END) as unique_clicks,
  SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END) as bot_clicks,
  SUM(CASE WHEN device = 'Mobile' THEN 1 ELSE 0 END) as mobile_clicks,
  SUM(CASE WHEN device = 'Desktop' THEN 1 ELSE 0 END) as desktop_clicks,
  SUM(CASE WHEN device = 'Tablet' THEN 1 ELSE 0 END) as tablet_clicks,
  ...
FROM click_events
WHERE DATE(timestamp) = DATE('now')
  AND is_bot = 0
GROUP BY link_id, DATE(timestamp);
```

---

## 5. API Endpoints

### 5.1 Analytics Overview

```
GET /api/analytics/:link_id/overview?period=7d
```

Response:

```json
{
  "total_clicks": 12456,
  "unique_clicks": 8912,
  "today_clicks": 432,
  "qr_clicks": 850,
  "bot_clicks": 240
}
```

### 5.2 Time Series

```
GET /api/analytics/:link_id/timeseries?period=7d&granularity=day
```

Response:

```json
{
  "data": [
    { "date": "2026-06-14", "clicks": 450, "unique": 320 },
    { "date": "2026-06-13", "clicks": 320, "unique": 210 },
    ...
  ]
}
```

Periods: `24h`, `7d`, `30d`, `90d`, `custom`
Granularity: `hour` (for 24h), `day` (for 7d/30d), `week` (for 90d)

### 5.3 Referrer Breakdown

```
GET /api/analytics/:link_id/referrers?period=7d
```

Response:

```json
{
  "data": [
    { "referrer": "tiktok.com", "clicks": 6500, "percentage": 65 },
    { "referrer": "facebook.com", "clicks": 2100, "percentage": 21 },
    { "referrer": "direct", "clicks": 600, "percentage": 6 }
  ]
}
```

### 5.4 Device Breakdown

```
GET /api/analytics/:link_id/devices?period=7d
```

Response:

```json
{
  "devices": [
    { "device": "Mobile", "clicks": 8900, "percentage": 89 }
  ],
  "os": [
    { "os": "Android", "clicks": 6000, "percentage": 60 }
  ],
  "browsers": [
    { "browser": "Chrome", "clicks": 5500, "percentage": 55 }
  ]
}
```

### 5.5 Geo Breakdown

```
GET /api/analytics/:link_id/geo?period=7d
```

Response:

```json
{
  "countries": [
    { "country": "VN", "clicks": 8000, "percentage": 80 }
  ],
  "cities": [
    { "city": "Ho Chi Minh City", "country": "VN", "clicks": 4500, "percentage": 45 }
  ]
}
```

### 5.6 UTM Breakdown

```
GET /api/analytics/:link_id/utm?period=7d
```

Response:

```json
{
  "sources": [
    { "utm_source": "tiktok", "clicks": 1250 }
  ],
  "mediums": [
    { "utm_medium": "bio", "clicks": 800 }
  ],
  "campaigns": [
    { "utm_campaign": "summer_sale", "clicks": 500 }
  ]
}
```

### 5.7 Top Links (User-level)

```
GET /api/analytics/top-links?period=7d&limit=10
```

Response:

```json
{
  "data": [
    { "short_code": "sale", "title": "Shopee Sale", "clicks": 5200 },
    { "short_code": "tt", "title": "TikTok", "clicks": 3800 }
  ]
}
```

### 5.8 Export

```
GET /api/analytics/:link_id/export?period=30d&format=csv
```

Formats: `csv`, `json`, `xlsx`

### 5.9 Real-time (last 60 minutes)

```
GET /api/analytics/:link_id/realtime
```

Response:

```json
{
  "last_60_minutes": [
    { "minute": "10:00", "clicks": 2 },
    { "minute": "10:01", "clicks": 18 },
    { "minute": "10:02", "clicks": 55 }
  ],
  "active_now": 12
}
```

---

## 6. Dashboard UI Components

### 6.1 Overview Cards

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total Click │ │ Unique Click│ │  QR Scans   │ │ Today Click │
│   12,456    │ │    8,912    │ │     850     │ │     432     │
│   +18.5%    │ │   +12.3%    │ │   +25.0%    │ │   +8.2%     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 6.2 Time Series Chart

- Line/bar chart (dùng Chart.js hoặc lightweight lib)
- Period selector: 24h | 7d | 30d | 90d | Custom
- Show total + unique lines

### 6.3 Referrer Panel

- Horizontal bar chart hoặc list với progress bars
- Show percentage + absolute count

### 6.4 Device/OS/Browser Panel

- Donut chart + list
- Tab: Device | OS | Browser

### 6.5 Geo Panel

- Country list với flags
- Expandable để xem cities

### 6.6 UTM Panel

- Table: Source | Medium | Campaign | Clicks

---

## 7. MVP Scope (Phase 1)

Ưu tiên 5 analytics quan trọng nhất:

| # | Feature | Complexity |
|---|---------|-----------|
| 1 | Total clicks & Unique clicks | Low |
| 2 | Time series chart (theo ngày) | Medium |
| 3 | Referrer breakdown | Low |
| 4 | Device breakdown | Low |
| 5 | Country breakdown | Low |

### Phase 1 Deliverables

1. **Migration**: Tạo `click_events` table
2. **Click tracking**: Ghi event trong `server/routes/s/[slug].get.ts` via `ctx.waitUntil()`
3. **Aggregation**: Cron job aggregate daily stats
4. **API**: 5 endpoints (overview, timeseries, referrers, devices, geo)
5. **UI**: Analytics tab trong admin link detail page

### Phase 2 (sau MVP)

- UTM analytics
- QR source tracking
- Real-time dashboard
- Export CSV/JSON
- Top links ranking
- Bot filtering toggle
- Conversion tracking (Pro)

---

## 8. Cloudflare-specific Implementation Notes

### Geo Data

```typescript
// Trong Cloudflare Worker, geo data có sẵn:
const country = event.context.cloudflare?.cf?.country // 'VN'
const city = event.context.cloudflare?.cf?.city // 'Ho Chi Minh City'
```

### Async Tracking (không block redirect)

```typescript
// Trong server route
const { waitUntil } = event.context.cloudflare

waitUntil(trackClick({
  linkId: link.id,
  event,
}))

return sendRedirect(event, targetUrl, 302)
```

### IP Hashing

```typescript
import { subtle } from 'crypto'

async function hashIP(ip: string, date: string): Promise<string> {
  const data = new TextEncoder().encode(ip + date)
  const hash = await subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
```

### User-Agent Parsing

Dùng lightweight UA parser (không cần full library):

```typescript
function parseDevice(ua: string): { device: string; os: string; browser: string } {
  // Device
  const device = /Mobile|Android|iPhone/.test(ua) ? 'Mobile'
    : /iPad|Tablet/.test(ua) ? 'Tablet'
    : 'Desktop'

  // OS
  const os = /iPhone|iPad|Mac/.test(ua) ? (/iPhone|iPad/.test(ua) ? 'iOS' : 'macOS')
    : /Android/.test(ua) ? 'Android'
    : /Windows/.test(ua) ? 'Windows'
    : 'Linux'

  // Browser
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /SamsungBrowser/.test(ua) ? 'Samsung'
    : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari'
    : 'Other'

  return { device, os, browser }
}
```

---

## 9. Data Retention Policy

| Data | Retention |
|------|-----------|
| `click_events` (raw) | 30 ngày (Free), 90 ngày (Pro) |
| `link_daily_stats` (aggregate) | Vĩnh viễn |
| Export data | On-demand generation |

Cron job cleanup:

```sql
DELETE FROM click_events WHERE timestamp < datetime('now', '-30 days');
```

---

## 10. Rate Limits & Quotas

| Plan | Monthly clicks tracked | Real-time | Export |
|------|----------------------|-----------|--------|
| Free | 10,000 | ❌ | ❌ |
| Pro | 500,000 | ✅ | ✅ CSV/JSON |
| Business | Unlimited | ✅ | ✅ All formats |
