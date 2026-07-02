// Google One Tap Sign-in Component
// Only runs on client after hydration (no SSR)
// https://developers.google.com/identity/gsi/web

<template>
  <!-- Container for Google One Tap -->
  <div id="google-one-tap"></div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { loggedIn, user } = useUserSession()

// Define function first (hoisting-safe)
function loadOneTapScript() {
  useHead({
    script: [
      {
        src: 'https://accounts.google.com/gsi/client',
        async: true,
        defer: true,
        onload: () => {
          console.log('[One Tap] Script loaded, initializing...')
          initOneTap()
        }
      }
    ]
  })
}

// Only run if clientId exists and user is not logged in
const shouldLoad = computed(() => {
  if (!config.public.oauthGoogleClientId) return false
  if (user.value === undefined) return false // still loading
  if (loggedIn.value) return false
  return true
})

// Load Google script when shouldLoad becomes true
watch(shouldLoad, (canLoad) => {
  if (canLoad) {
    console.log('[One Tap] Loading script...')
    loadOneTapScript()
  }
}, { immediate: true })

function initOneTap() {
  if (!window.google?.accounts?.id) return
  
  const clientId = config.public.oauthGoogleClientId
  if (!clientId) {
    console.warn('[One Tap] Missing NUXT_OAUTH_GOOGLE_CLIENT_ID')
    return
  }
  
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
    prompt_parent_id: 'google-one-tap',
    itp_support: true
  })
  
  window.google.accounts.id.prompt((notification: any) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      const reason = notification.getNotDisplayedReason()
      console.log('[One Tap] Not displayed:', reason)
      
      if (reason === 'suppressed_by_user' || reason === 'user_opt_out') {
        console.warn('[One Tap] User disabled FedCM')
        showFallbackButton()
      }
    }
    
    if (notification.isDismissedMoment()) {
      console.log('[One Tap] Dismissed:', notification.getDismissedReason())
    }
  })
}

function showFallbackButton() {
  const container = document.getElementById('google-one-tap')
  if (!container || container.querySelector('.google-fallback-btn')) return
  
  const btn = document.createElement('button')
  btn.className = 'google-fallback-btn'
  btn.textContent = 'Continue with Google'
  btn.style.cssText = 'padding:10px 20px;background:#4285f4;color:#fff;border:none;border-radius:4px;cursor:pointer;'
  btn.onclick = () => window.location.href = '/api/auth/google'
  
  const msg = document.createElement('div')
  msg.textContent = 'Sign-in popup blocked? Click button above or allow third-party sign-in in site settings.'
  msg.style.cssText = 'font-size:12px;color:#666;margin-top:8px;'
  
  container.appendChild(btn)
  container.appendChild(msg)
}

async function handleCredentialResponse(response: any) {
  try {
    await $fetch('/api/auth/google-one-tap', {
      method: 'POST',
      body: { credential: response.credential }
    })
    window.location.reload()
  } catch (error) {
    console.error('[One Tap] Auth failed:', error)
  }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
        }
      }
    }
  }
}
</script>
