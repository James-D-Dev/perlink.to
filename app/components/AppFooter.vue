<template>
  <UFooter
    :ui="{
      root: 'bg-gradient-to-br from-gray-900 via-gray-900 to-perlink-blue/90 text-white/80',
      container: 'max-w-6xl',
      top: 'py-12',
      bottom: 'pt-8 mt-8 border-t border-white/10'
    }"
  >
    <!-- Top Section - Logo and Links Grid -->
    <template #top>
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Logo and Description -->
        <div class="space-y-4 lg:col-span-2">
          <div class="text-2xl font-bold bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent">
            Perlink.to
          </div>
          <p class="text-sm text-white/60 max-w-sm">
            Beautiful pages for people and places: portfolios, menus, hotels, shops and interactive 3D rooms. Built on Cloudflare for speed and reliability.
          </p>
          <!-- Social Links -->
          <div class="flex space-x-3 pt-2">
            <UButton
              to="#"
              icon="i-simple-icons-x"
              color="neutral"
              variant="ghost"
              size="sm"
              :ui="{ base: 'text-white/60 hover:text-white' }"
              aria-label="Twitter"
            />
            <UButton
              to="#"
              icon="i-simple-icons-github"
              color="neutral"
              variant="ghost"
              size="sm"
              :ui="{ base: 'text-white/60 hover:text-white' }"
              aria-label="GitHub"
            />
            <UButton
              to="#"
              icon="i-simple-icons-instagram"
              color="neutral"
              variant="ghost"
              size="sm"
              :ui="{ base: 'text-white/60 hover:text-white' }"
              aria-label="Instagram"
            />
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Product</h3>
          <nav class="flex flex-col space-y-2">
            <ULink to="/#templates" class="text-sm text-white/60 hover:text-white transition-colors">
              Portfolio Templates
            </ULink>
            <ULink to="/#3d-mode" class="text-sm text-white/60 hover:text-white transition-colors">
              3D Mode
            </ULink>
            <ULink to="/#features" class="text-sm text-white/60 hover:text-white transition-colors">
              QR Sharing
            </ULink>
            <ULink to="/pricing" class="text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </ULink>
          </nav>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Company</h3>
          <nav class="flex flex-col space-y-2">
            <ULink to="#" class="text-sm text-white/60 hover:text-white transition-colors">
              About
            </ULink>
            <ULink to="#" class="text-sm text-white/60 hover:text-white transition-colors">
              Blog
            </ULink>
            <ULink to="/#faq" class="text-sm text-white/60 hover:text-white transition-colors">
              FAQ
            </ULink>
            <ULink to="#" class="text-sm text-white/60 hover:text-white transition-colors">
              Contact
            </ULink>
          </nav>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Legal</h3>
          <nav class="flex flex-col space-y-2">
            <ULink to="/terms" class="text-sm text-white/60 hover:text-white transition-colors">
              Terms
            </ULink>
            <ULink to="/privacy" class="text-sm text-white/60 hover:text-white transition-colors">
              Privacy
            </ULink>
            <ULink to="/cookie-notice" class="text-sm text-white/60 hover:text-white transition-colors">
              Cookies
            </ULink>
          </nav>
        </div>
      </div>
    </template>

    <!-- Bottom Section - Copyright and Links -->
    <template #left>
      <p class="text-sm text-white/40">
        © {{ new Date().getFullYear() }} Perlink.to. Built with ❤️ on Cloudflare.
      </p>
    </template>

    <template #right>
      <div class="flex items-center space-x-4">
        <span class="text-xs text-white/40 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          All systems operational
        </span>
      </div>
    </template>
  </UFooter>
</template>