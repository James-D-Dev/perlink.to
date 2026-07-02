// https://nuxt.com/docs/api/configuration/nuxt-config
const isProd = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  ssr: true,
  modules: [
    "nitro-cloudflare-dev",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxt/icon",
  ],

  // Public runtime config only (private secrets handled by nuxt-auth-utils)
  runtimeConfig: {
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
      title: "Perlink.to - Bio Link Pages, Short URLs & QR Codes",
      meta: [
        {
          name: "description",
          content:
            "All-in-one platform to create bio link pages, shorten URLs, and generate QR codes including VietQR. Built on Cloudflare for lightning-fast performance.",
        },
        { name: "apple-mobile-web-app-title", content: "Perlink" },
      ],
      link: [
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
    "/admin/bio/**": { ssr: false },
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
