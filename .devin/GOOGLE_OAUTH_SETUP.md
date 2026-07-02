# Google OAuth Production Setup Guide

## Overview

Perlink.to chỉ sử dụng **Google OAuth** cho authentication - không cần email/password register. User đăng nhập bằng Google account, hệ thống tự động tạo profile.

## Prerequisites

- Google Cloud Console account (free)
- Domain đã deploy (ví dụ: `https://perlink.to`)

---

## Step 1: Tạo Google Cloud Project

1. Truy cập: https://console.cloud.google.com/
2. Click **Select a project** → **New Project**
3. Đặt tên: `perlink-to` hoặc tùy ý
4. Click **Create**

---

## Step 2: Kích hoạt Google+ API

1. Vào **APIs & Services** → **Library**
2. Search **"Google+ API"** hoặc **"Google People API"**
3. Click **Enable**

---

## Step 3: Cấu hình OAuth Consent Screen

1. Vào **APIs & Services** → **OAuth consent screen**
2. Chọn **External** (cho public users) hoặc **Internal** (nếu dùng Google Workspace)
3. Click **Create**
4. Điền thông tin:
   - **App name**: Perlink.to
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
5. Click **Save and Continue**
6. **Scopes** → Click **Add or Remove Scopes**
   - Chọn: `openid`, `userinfo.email`, `userinfo.profile`
7. Click **Save and Continue**
8. **Test users** → Add email của bạn để test
9. Click **Save and Continue**

---

## Step 4: Tạo OAuth Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: Perlink Web Client
5. **Authorized JavaScript origins**:
   ```
   https://perlink.to
   http://localhost:3000          # For local dev
   ```
6. **Authorized redirect URIs**:
   ```
   https://perlink.to/api/auth/google
   http://localhost:3000/api/auth/google    # For local dev
   ```
   ⚠️ **QUAN TRỌNG**: URI phải khớp chính xác, có `/api/auth/google`
7. Click **Create**
8. Copy **Client ID** và **Client Secret**

---

## Step 5: Cấu hình Perlink App

### Local Development

Tạo file `.env` trong root:
```env
NUXT_OAUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Cloudflare)

#### Option A: Wrangler Secrets (Recommended)
```bash
# Set secrets
wrangler secret put NUXT_OAUTH_GOOGLE_CLIENT_ID
# Paste your Client ID

wrangler secret put NUXT_OAUTH_GOOGLE_CLIENT_SECRET
# Paste your Client Secret
```

#### Option B: Wrangler Dashboard
1. Vào https://dash.cloudflare.com
2. Chọn Workers & Pages → perlink-app
3. Tab **Settings** → **Variables and Secrets**
4. Add secrets:
   - `NUXT_OAUTH_GOOGLE_CLIENT_ID`
   - `NUXT_OAUTH_GOOGLE_CLIENT_SECRET`

---

## Step 6: Publish Application (Production)

Nếu dùng **External** users, cần verify app:

1. Vào **OAuth consent screen**
2. Click **Publish App**
3. Hoàn thành verification (Google sẽ review)

**Trong thời gian chờ**: App ở "Testing mode" - chỉ test users mới đăng nhập được.

---

## Step 7: Deploy & Test

```bash
# Deploy to production
pnpm run deploy

# Or with wrangler
wrangler pages deploy
```

Test flow:
1. Truy cập `https://perlink.to/login`
2. Click "Continue with Google"
3. Chọn Google account
4. Redirect về `/admin` (dashboard)

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Kiểm tra URI trong Google Console khớp với `https://your-domain.com/api/auth/google`
- Phải có `https` không phải `http` (production)

### Error: "access_denied"
- User chưa được add vào Test users
- Hoặc app chưa publish (nếu dùng External)

### Error: "invalid_client"
- Client ID hoặc Secret sai
- Kiểm tra lại env vars

### Login loop (redirect về login)
- Session cookie không set
- Kiểm tra domain trong `setUserSession`
- Xem log trong Cloudflare Dashboard

---

## Security Best Practices

✅ **Đã implement:**
- Email verification check (Google `email_verified`)
- Secure session cookies (httpOnly, secure)
- 7-day session expiry
- Structured error logging
- No password storage

✅ **Nên thêm:**
- Rate limiting cho `/api/auth/google`
- IP-based throttling
- Audit log (lưu login history)

---

## Files liên quan

| File | Mô tả |
|------|-------|
| `server/api/auth/google.get.ts` | OAuth handler |
| `app/pages/login.vue` | Login UI (Google only) |
| `server/middleware/auth.ts` | Session middleware |
| `nuxt.config.ts` | Runtime config |
| `wrangler.jsonc` | Deployment config |

---

## Migration từ Email/Password

Nếu app cũ có email/password users:

1. **Option 1**: Force all users re-login with Google (đơn giản nhất)
2. **Option 2**: Migrate existing users:
   ```sql
   -- Add google_email column
   ALTER TABLE profiles ADD COLUMN google_email TEXT;
   
   -- Users login with Google → match by email → merge accounts
   ```

---

**Done!** 🎉 App đã có Google OAuth production-ready.
