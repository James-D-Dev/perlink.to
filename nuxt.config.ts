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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "perlink_lang",
      redirectOn: "root",
      fallbackLocale: "en",
    },
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
    // Email via Resend (https://resend.com). Empty key = emails are skipped.
    // Set NUXT_RESEND_API_KEY (and optionally NUXT_EMAIL_FROM) as Cloudflare Pages secrets.
    resendApiKey: "",
    emailFrom: "Perlink <notifications@perlink.to>",
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
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@300;400;500&display=swap",
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
    "/": { prerender: true },
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
                "default-src 'self'; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:;",
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
