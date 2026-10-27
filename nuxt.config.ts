// https://nuxt.com/docs/api/configuration/nuxt-config
const isProd = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  ssr: true,
  modules: [
    "nitro-cloudflare-dev",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxt/icon",
    "@nuxtjs/i18n",
  ],

  // Dashboard language. URLs stay the same; the first visit follows the
  // browser and the choice is remembered in a cookie. Published sites have
  // their own language (themeConfig.language, see app/utils/siteI18n.ts).
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-US", name: "English", files: ["en/common.json", "en/dashboard.json", "en/blocks.json", "en/theme.json", "en/room.json"] },
      { code: "vi", language: "vi-VN", name: "Tiếng Việt", files: ["vi/common.json", "vi/dashboard.json", "vi/blocks.json", "vi/theme.json", "vi/room.json"] },
    ],
    // English unless the visitor picked another language (Settings, the
    // header switch); the browser's language isn't used. The choice is kept
    // in the perlink_lang cookie by plugins/language.ts, and signing in
    // brings the account's language with it.
    detectBrowserLanguage: false,
  },

  // Public runtime config only (private secrets handled by nuxt-auth-utils)
  runtimeConfig: {
    // Login session: without maxAge the cookie has no expiry, so browsers drop
    // it when they close (on phones that happens within hours)
    session: {
      maxAge: 60 * 60 * 24 * 30,
      cookie: {
        sameSite: "lax",
        secure: isProd,
      },
    },
    // Email through Cloudflare Email Sending (REST API). Empty token = emails
    // are skipped. Set NUXT_CF_EMAIL_API_TOKEN (and optionally NUXT_EMAIL_FROM)
    // as Cloudflare Pages secrets; the sending domain must be onboarded.
    cfEmailApiToken: "",
    cfAccountId: "e12f511fe723c064e1b971cc094a95fd",
    // Custom domains through Cloudflare for SaaS (see docs/custom-domains.md).
    // Empty token = the feature shows as not available yet.
    cfSaasZoneId: "",
    cfSaasApiToken: "",
    // Shared with the domain-router Worker so only it can say which domain a request came from
    domainProxySecret: "",
    // Where owners point their domain (CNAME target)
    domainCnameTarget: "sites.perlink.to",
    emailFrom: "Perlink <notification@perlink.to>",
    // Plan payments by bank transfer (VietQR), confirmed by SePay's webhook
    // (see docs/billing.md). Empty account = checkout shows as not available.
    billing: {
      bankBin: "",
      accountNumber: "",
      accountName: "",
      sepayApiKey: "",
      // EVM wallet that receives USDT / USDC (NUXT_BILLING_CRYPTO_ADDRESS)
      cryptoAddress: "",
    },
    // Lemon Squeezy (card / PayPal subscriptions, Merchant of Record):
    // NUXT_LEMON_API_KEY and NUXT_LEMON_WEBHOOK_SECRET. The store and the
    // plan variants are looked up through the API; NUXT_LEMON_STORE_ID can pin
    // the store. Empty key = the card option is hidden.
    lemon: {
      apiKey: "",
      webhookSecret: "",
      storeId: "",
    },
    // Order and request alerts on Telegram (see docs/telegram-notifications.md).
    // Empty token = the "Connect Telegram" option is hidden.
    telegram: {
      botToken: "",
      botUsername: "",
      webhookSecret: "",
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      oauthGoogleClientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || "",
    },
  },

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css", "animate.css/animate.min.css"],
  app: {
    head: {
      title: "Perlink — Personal websites and 3D worlds",
      meta: [
        {
          name: "description",
          content:
            "Build a personal website for your work, restaurant, hotel or shop, and turn it into a 3D world people can explore.",
        },
        { name: "apple-mobile-web-app-title", content: "Perlink" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@300;400;500&family=Geist:wght@600&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },

  routeRules: {
    // "/" is rendered per request: on a site's own domain it shows that site
    "/vi": { prerender: true },
    "/dashboard/site/**": { ssr: false },
    // Sites used to live under /dashboard/bio
    "/dashboard/bio": { redirect: { to: "/dashboard/site", statusCode: 301 } },
    "/dashboard/bio/**": { redirect: { to: "/dashboard/site/**", statusCode: 301 } },
    // Old user dashboard URLs
    "/admin": { redirect: { to: "/dashboard", statusCode: 301 } },
    // Short links and QR codes are no longer offered (existing ones still resolve)
    "/dashboard/links": { redirect: { to: "/dashboard", statusCode: 302 } },
    "/dashboard/links/**": { redirect: { to: "/dashboard", statusCode: 302 } },
    "/dashboard/qr": { redirect: { to: "/dashboard", statusCode: 302 } },
    "/dashboard/qr/**": { redirect: { to: "/dashboard", statusCode: 302 } },
    "/dashboard/qr-codes": { redirect: { to: "/dashboard", statusCode: 302 } },
    // Help now opens as a popup from anywhere
    "/dashboard/help": { redirect: { to: "/dashboard", statusCode: 302 } },
    "/admin/**": { redirect: { to: "/dashboard/**", statusCode: 301 } },
    "/**": {
      ...(isProd
        ? {
            headers: {
              "Cache-Control": "public,max-age=10",
              "Strict-Transport-Security":
                "max-age=15552000; includeSubDomains; preload",
              "X-Content-Type-Options": "nosniff",
              "X-Frame-Options": "SAMEORIGIN",
              "X-XSS-Protection": "1; mode=block",
              "Referrer-Policy": "strict-origin-when-cross-origin",
              "Permissions-Policy":
                "accelerometer=(), autoplay=(), bluetooth=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), hid=(), microphone=(), payment=(), serial=(), usb=()",
              "Content-Security-Policy":
                "default-src 'self'; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; media-src 'self' https: blob:; frame-src https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://www.tiktok.com;",
            },
          }
        : {}),
    },
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  },

  compatibilityDate: "2025-01-15",

  nitro: {
    preset: "cloudflare-pages",
    // Prerender /vi as vi.html: Pages serves it at /vi, while vi/index.html
    // would redirect to /vi/ and disagree with the canonical URL
    prerender: { autoSubfolderIndex: false },
    compressPublicAssets: true,
    minify: true,
    timing: true,
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  ui: {},
  colorMode: {
    preference: "light", // Sets the default fallback to light
    fallback: "light", // Ensures light mode if system preference is unreadable
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "", // Removes any default '-mode' suffixes
    storageKey: "nuxt-color-mode",
  },
  icon: {
    mode: "svg",
    serverBundle: "remote",
    provider: "iconify",
  },
  vite: {
    optimizeDeps: {
      include: ["date-fns", "lodash-es", "chart.js", "chartjs-chart-geo"],
    },
  },
  hooks: {
    close: () => {
      console.log("[nitro] Build complete, exiting...");
      process.exit(0);
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        typeRoots: ["./types", "./node_modules/@types"],
      },
    },
  },
});
