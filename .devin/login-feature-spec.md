# Perlink.to - Login/Auth Feature Specification

## Overview

Authentication system cho Perlink.to sử dụng **nuxt-auth-utils** module với 3 phương thức đăng nhập:
1. **Email/Password** (dev placeholder - no password verification)
2. **Google OAuth** (fully implemented)
3. **GitHub OAuth** (UI only - chưa implement)

---

## File Structure

```
app/
├── pages/login.vue              # Login UI page
├── composables/useAuth.ts       # Auth composable
├── layouts/blank.vue            # No-layout for login
└── components/AppHeader.vue     # Show user status

server/
├── api/auth/
│   ├── login.post.ts            # Email/password login
│   ├── register.post.ts         # Email/password register
│   ├── logout.post.ts           # Clear session
│   ├── google.get.ts            # Google OAuth handler
│   └── me.get.ts                # Get current user
└── middleware/auth.ts           # Set user in context
```

---

## Authentication Flow

### 1. Email/Password Login

**Client → Server:**
```
POST /api/auth/login
{ email: string, password: string }
```

**Server Process:**
1. Validate email & password tồn tại
2. Tìm profile theo email (ProfileRepository)
3. **⚠️ Auto-create nếu chưa có (DEV MODE)**
4. Set session via `setUserSession()`
5. Return user object

**⚠️ Security Issues:**
- Không hash password
- Không verify password
- Auto-create user → anyone can login với bất kỳ email

**After Login:**
```ts
// useAuth.ts
await fetchSession()  // Refresh client session
navigateTo('/admin')   // Or redirect path from query
```

### 2. Google OAuth

**Flow:**
```
1. User click "Continue with Google"
2. window.location.href = '/api/auth/google'
3. Nuxt OAuth handler redirect to Google
4. Google callback → /api/auth/google?code=xxx
5. Server tạo/update profile, set session
6. Redirect to /admin
```

**Handler:** `server/api/auth/google.get.ts`
- Dùng `defineOAuthGoogleEventHandler`
- Scope: `['profile', 'email', 'openid']`
- Auto-create profile nếu chưa có

### 3. Session Management

**nuxt-auth-utils cung cấp:**
```ts
// Client-side
const { user, loggedIn, fetch, clear } = useUserSession()

// Server-side  
await setUserSession(event, { user })
await getUserSession(event)
await clearUserSession(event)
```

**Session được lưu:** Encrypted cookie (httpOnly, secure)

---

## UI Components

### Login Page (`app/pages/login.vue`)

**Features:**
- Toggle Login ↔ Register mode
- Email input field
- Loading state với spinner
- Error/Success alerts
- Social login buttons (Google, GitHub)
- Terms & conditions text

**Auto-redirect:**
```ts
watchEffect(() => {
  if (loggedIn.value) {
    navigateTo('/admin')  // Auto redirect if already logged in
  }
})
```

**Redirect sau login:**
- Default: `/admin`
- Query param: `?redirect=/custom/path`
- With saved input: `?redirect=/create&input=xxx`

---

## useAuth Composable

```ts
const { 
  user,           // Current user or null
  loggedIn,       // Boolean
  loading,        // Auth operation in progress
  login,          // (email, password) => Promise
  register,       // (email, password, username?) => Promise
  logout,         // () => Promise (calls /api/auth/logout)
  clear,          // Clear client session
  fetch           // Refresh session from server
} = useAuth()
```

---

## API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | /api/auth/login | Email/password login | ⚠️ Insecure |
| POST | /api/auth/register | Create new account | ⚠️ No password storage |
| POST | /api/auth/logout | Clear session | ✅ OK |
| GET | /api/auth/google | Google OAuth | ✅ OK |
| GET | /api/auth/me | Get current user | ✅ OK |

---

## Security Analysis

### ✅ Strengths
- Session encryption via nuxt-auth-utils
- HttpOnly cookies
- CSRF protection (OAuth flow)
- Input validation (email format, username regex)

### ❌ Weaknesses (Need Fix)
1. **No password hashing** - Store plaintext or not at all
2. **No password verification** - Login accepts any password
3. **Auto-create user** - Security risk for email/password
4. **No rate limiting** - Brute force attack possible
5. **No email verification** - Anyone can register với fake email

---

## Recommended Improvements

### 1. Add Password Security
```ts
// server/utils/password.ts
import bcrypt from 'bcryptjs'

export const hashPassword = (password: string) => 
  bcrypt.hash(password, 10)

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash)
```

### 2. Add Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- Store hashed password
  email_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Add Rate Limiting
```ts
// server/utils/rateLimit.ts
import { RateLimiter } from 'limiter'

const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'minute' })
```

### 4. Email Verification Flow
- Send email with verification link
- Token expires after 24h
- User can't login until verified

### 5. Password Reset
- "Forgot password" link
- Send reset token via email
- Allow set new password

---

## Current State: DEV vs PROD

| Feature | Dev Status | Prod Ready |
|---------|------------|------------|
| Email/Password | ⚠️ Placeholder | ❌ No |
| Google OAuth | ✅ Working | ✅ Yes |
| GitHub OAuth | ❌ UI Only | ❌ No |
| Session Mgmt | ✅ Working | ✅ Yes |
| Logout | ✅ Working | ✅ Yes |

---

## Testing Checklist

- [ ] Login với email hợp lệ → success
- [ ] Login với email sai → error message
- [ ] Google OAuth flow → redirect to /admin
- [ ] Logout → redirect to /login, không tự nhảy về
- [ ] Truy cập /admin khi chưa login → redirect /login
- [ ] Truy cập /login khi đã login → redirect /admin
- [ ] Session persist sau refresh page

---

## Related Files

- `app/pages/login.vue` - UI implementation
- `app/composables/useAuth.ts` - Auth logic
- `app/layouts/admin.vue` - Logout handler
- `server/api/auth/*.ts` - API endpoints
- `server/repositories/profileRepository.ts` - User data

---

*Spec version: 1.0*
*Last updated: June 2026*
