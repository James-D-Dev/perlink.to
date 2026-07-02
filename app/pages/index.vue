<template>
  <Head>
    <Meta charSet="utf-8" />
    <Meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=contain, user-scalable=no"
    />
    <Title>Perlink.to - Bio Link Pages, Short URLs & QR Codes</Title>
    <Meta
      name="description"
      content="All-in-one platform to create bio link pages, shorten URLs, and generate QR codes including VietQR. Built on Cloudflare for lightning-fast performance."
    />
    <Meta
      name="keywords"
      content="bio link, link in bio, URL shortener, QR code, VietQR, link tree, bio page"
    />

    <!-- Open Graph -->
    <Meta
      property="og:title"
      content="Perlink.to - Bio Link Pages, Short URLs & QR Codes"
    />
    <Meta
      property="og:description"
      content="All-in-one platform to create bio link pages, shorten URLs, and generate QR codes including VietQR."
    />
    <Meta property="og:url" content="https://perlink.to" />
    <Meta property="og:site_name" content="Perlink.to" />
    <Meta property="og:type" content="website" />

    <!-- Twitter -->
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" content="@perlinkto" />
    <Meta
      name="twitter:title"
      content="Perlink.to - Bio Link Pages, Short URLs & QR Codes"
    />
    <Meta
      name="twitter:description"
      content="All-in-one platform to create bio link pages, shorten URLs, and generate QR codes."
    />

    <!-- PWA -->
    <Meta name="mobile-web-app-capable" content="yes" />
    <Meta name="apple-mobile-web-app-title" content="Perlink.to" />
    <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <Meta name="theme-color" content="#0984E3" />

    <Link rel="canonical" href="https://perlink.to" />
  </Head>
  <div
    class="min-h-screen bg-gradient-to-br from-perlink-blue/10 via-perlink-cyan/5 to-white relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div
      class="absolute z-0 inset-0 overflow-hidden w-full pointer-events-none user-select-none"
    >
      <div
        class="absolute inset-0 [background:radial-gradient(circle_500px_at_50%_200px,rgba(9,132,227,0.1),transparent)]"
      >
        <!-- Floating Elements -->
        <div
          class="absolute top-[60vh] left-[10%] w-32 h-32 bg-gradient-to-br from-perlink-blue/20 to-perlink-cyan/20 rounded-full blur-xl animate-float-slow"
        ></div>
        <div
          class="absolute top-[10rem] right-1/4 w-40 h-40 bg-gradient-to-br from-perlink-cyan/20 to-perlink-blue/20 rounded-full blur-xl animate-float-slower"
        ></div>
        <div
          class="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-perlink-blue/20 to-perlink-cyan/20 rounded-full blur-xl animate-float-slow"
        ></div>
        <div
          class="absolute top-1/2 right-1/4 w-40 h-40 bg-gradient-to-br from-perlink-cyan/20 to-perlink-blue/20 rounded-full blur-xl animate-float-slower"
        ></div>
        <div
          class="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-perlink-blue/10 to-perlink-cyan/10 rounded-full blur-lg animate-float"
        ></div>

        <!-- Connected Lines -->
        <svg
          class="absolute inset-0 top-0 2xl:top-[8rem] md:left-0 -left-[100%] w-full h-full overflow-visible user-select-none pointer-events-none opacity-60"
          style="transform: rotate(10deg)"
        >
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style="stop-color: rgb(0, 168, 255); stop-opacity: 0"
              />
              <stop
                offset="50%"
                style="stop-color: rgb(9, 132, 227); stop-opacity: 0.2"
              />
              <stop
                offset="100%"
                style="stop-color: rgb(0, 168, 255); stop-opacity: 0"
              />
            </linearGradient>

            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#000000" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
          </defs>

          <path
            id="loop-normal-2"
            d="M0,100 Q400,300 800,100 T1600,100"
            fill="none"
            stroke-width="100"
            stroke-linecap="round"
          />
          <path
            id="loop-normal-1"
            d="M0,300 Q400,500 800,300 T1600,300"
            fill="none"
            stroke-width="100"
            stroke-linecap="round"
          />
          <path
            id="loop-normal"
            d="M0,500 Q400,700 800,500 T1600,500"
            fill="none"
            stroke-width="100"
            stroke-linecap="round"
          />
          <path
            id="loop-normal-3"
            d="M0,700 Q400,900 800,700 T1600,700"
            fill="none"
            stroke-width="100"
            stroke-linecap="round"
          />

          <use
            class="sd"
            stroke="url(#line-gradient)"
            stroke-dasharray="1000 1710"
            xlink:href="#loop-normal"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="-1710"
              begin="0s"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0; 1; 0"
              keyTimes="0; 0.5; 1"
              dur="10s"
              repeatCount="indefinite"
            />
          </use>
          <use
            class="sd1"
            stroke="url(#line-gradient)"
            stroke-dasharray="1000 1710"
            xlink:href="#loop-normal-1"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="-1710"
              begin="0s"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0; 1; 0"
              keyTimes="0; 0.5; 1"
              dur="10s"
              repeatCount="indefinite"
            />
          </use>
          <use
            class="sd2"
            stroke="url(#line-gradient)"
            stroke-dasharray="1000 1710"
            xlink:href="#loop-normal-2"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="-1710"
              begin="0s"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0; 1; 0"
              keyTimes="0; 0.5; 1"
              dur="10s"
              repeatCount="indefinite"
            />
          </use>

          <use
            class="sd3"
            stroke="url(#line-gradient)"
            stroke-dasharray="1000 1710"
            xlink:href="#loop-normal-3"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="-1710"
              begin="0s"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0; 1; 0"
              keyTimes="0; 0.5; 1"
              dur="10s"
              repeatCount="indefinite"
            />
          </use>
        </svg>
      </div>
    </div>

    <UContainer class="md:h-screen flex flex-col items-center justify-center">
      <div class="h-[8rem] md:h-[6rem]"></div>
      <div class="flex md:flex-row flex-col gap-12 items-center max-w-full">
        <!-- Text Content -->
        <div
          class="space-y-8 h-auto flex flex-col items-center justify-center md:items-start"
        >
          <!-- SEO H1 - Screen reader only -->
          <h1 class="sr-only">Make Every Link more Personal with Perlink</h1>

          <!-- Visual H1 for animation -->
          <div
            role="presentation"
            aria-hidden="true"
            class="max-w-[295px] md:max-w-xl mx-auto text-center font-black text-4xl md:text-6xl leading-11 md:leading-16"
          >
            Make Every Link more Personal with Perlink
          </div>

          <p
            class="relative z-1 text-perlink-blue text-base md:text-xl text-center max-w-xs md:max-w-xl"
          >
            Create beautiful bio profiles, smart short links, and shareable QR
            codes all in one place.
          </p>
          <div class="flex items-center flex-col gap-4 max-w-xl">
            <FeaturesSlugInput
              v-model="inputValue"
              v-model:domain="selectedDomain"
              confirm-text="Claim your link"
              @confirm="handleClaimLink"
            >
              <template #placeholder-overlay>
                <VueWriter
                  :array="writerValues"
                  :type-speed="100"
                  :erase-speed="30"
                  :delay="1000"
                  :intervals="1000"
                  :start="0"
                  caret="|"
                  :iterations="Infinity"
                />
              </template>
            </FeaturesSlugInput>
          </div>
        </div>
        <!-- Preview/Demo Section -->
        <div
          class="w-full md:w-auto overflow-hidden md:overflow-visible md:mt-0 -mt-14"
        >
          <div
            class="relative h-[35rem] w-[35rem] md:scale-[1] scale-[.62] md:translate-x-0 -translate-x-[calc(100vw-17rem)]"
          >
            <div class="w-[35rem]"></div>
            <!-- Developer Profile Card -->
            <div
              v-element-hover="(e: any) => onPreviewCardHover(e, 'devalex')"
              class="absolute left-[12rem] top-4 w-[20rem] bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform rotate-[12deg] hover:rotate-0 transition-all duration-300 border border-perlink-cyan/20 hover:scale-105 hover:z-10 z-[3]"
            >
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-perlink-blue/20 to-perlink-cyan/20 rounded-full overflow-hidden"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/43.jpg"
                      alt="Alex Chen"
                    />
                  </div>
                  <div>
                    <h3 class="text-perlink-blue font-semibold">Alex Chen</h3>
                    <p class="text-perlink-blue/70 text-sm">@devalex</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <a
                    class="block p-3 bg-gradient-to-r from-perlink-blue/10 to-perlink-cyan/10 rounded-lg text-perlink-blue hover:from-perlink-blue/20 hover:to-perlink-cyan/20 transition-colors"
                  >
                    Portfolio
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-perlink-blue/10 to-perlink-cyan/10 rounded-lg text-perlink-blue hover:from-perlink-blue/20 hover:to-perlink-cyan/20 transition-colors"
                  >
                    Latest Project
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-perlink-blue/10 to-perlink-cyan/10 rounded-lg text-perlink-blue hover:from-perlink-blue/20 hover:to-perlink-cyan/20 transition-colors"
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            <!-- Artist Profile Card -->
            <div
              v-element-hover="
                (e: any) => onPreviewCardHover(e, 'creative.sarah')
              "
              class="absolute left-1/2 top-16 -translate-x-1/2 w-[20rem] bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform -rotate-[8deg] hover:rotate-0 transition-all duration-300 border border-purple-400/20 hover:scale-105 hover:z-10 z-[2]"
            >
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full overflow-hidden"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/20.jpg"
                      alt="Sarah Arts"
                    />
                  </div>
                  <div>
                    <h3 class="text-purple-600 font-semibold">Sarah Arts</h3>
                    <p class="text-purple-600/70 text-sm">@creative.sarah</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <a
                    class="block p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg text-purple-600 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors"
                  >
                    Art Gallery
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg text-purple-600 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors"
                  >
                    Commission Work
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg text-purple-600 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors"
                  >
                    Shop Prints
                  </a>
                </div>
              </div>
            </div>

            <!-- Fitness Coach Card -->
            <div
              v-element-hover="(e: any) => onPreviewCardHover(e, 'coach.mike')"
              class="absolute right-[10rem] top-32 w-[20rem] bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform -rotate-[18deg] hover:rotate-0 transition-all duration-300 border border-emerald-400/20 hover:scale-105 hover:z-10 z-[1]"
            >
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full overflow-hidden"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/20.jpg"
                      alt="Mike Fitness"
                    />
                  </div>
                  <div>
                    <h3 class="text-emerald-600 font-semibold">Mike Fitness</h3>
                    <p class="text-emerald-600/70 text-sm">@coach.mike</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <a
                    class="block p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg text-emerald-600 hover:from-emerald-500/20 hover:to-teal-500/20 transition-colors"
                  >
                    Training Programs
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg text-emerald-600 hover:from-emerald-500/20 hover:to-teal-500/20 transition-colors"
                  >
                    Nutrition Plans
                  </a>
                  <a
                    class="block p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg text-emerald-600 hover:from-emerald-500/20 hover:to-teal-500/20 transition-colors"
                  >
                    Book Session
                  </a>
                </div>
              </div>
            </div>

            <!-- Analytics Preview Card -->
            <div
              class="absolute group w-[26rem] bottom-[7rem] left-1/2 -translate-x-1/2 z-10 overflow-hidden cursor-pointer bg-perlink-blue/10 backdrop-blur-lg rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-perlink-blue/20"
            >
              <div class="flex items-center">
                <div class="space-y-4">
                  <div class="space-y-3">
                    <!-- Social Stats -->
                    <div class="flex items-center space-x-3 text-black/80">
                      <Icon
                        name="mdi:instagram"
                        class="w-6 h-6 text-[#E1306C]"
                      />
                      <div class="text-sm font-medium">37%</div>
                    </div>
                    <div class="flex items-center space-x-3 text-black/80">
                      <Icon name="logos:tiktok-icon" class="w-6 h-6" />
                      <div class="text-sm font-medium">29%</div>
                    </div>
                    <div class="flex items-center space-x-3 text-black/80">
                      <Icon
                        name="mdi:facebook"
                        class="w-6 h-6 text-[#1877F2]"
                      />
                      <div class="text-sm font-medium">21%</div>
                    </div>
                    <div class="flex items-center space-x-3 text-black/80">
                      <Icon
                        name="fa6-brands:square-x-twitter"
                        class="w-6 h-6 text-black"
                      />
                      <div class="text-sm font-medium">13%</div>
                    </div>
                  </div>
                </div>

                <!-- Bar Chart -->
                <div
                  class="relative flex-1 h-36 bg-white/5 rounded-xl overflow-hidden p-2"
                >
                  <svg
                    class="w-full h-full"
                    viewBox="0 0 100 60"
                    preserveAspectRatio="none"
                  >
                    <!-- Grid Lines -->
                    <line
                      x1="0"
                      y1="15"
                      x2="100"
                      y2="15"
                      stroke="#94a3b8"
                      stroke-width="0.2"
                      stroke-dasharray="2 2"
                    />
                    <line
                      x1="0"
                      y1="30"
                      x2="100"
                      y2="30"
                      stroke="#94a3b8"
                      stroke-width="0.2"
                      stroke-dasharray="2 2"
                    />
                    <line
                      x1="0"
                      y1="45"
                      x2="100"
                      y2="45"
                      stroke="#94a3b8"
                      stroke-width="0.2"
                      stroke-dasharray="2 2"
                    />

                    <!-- Bar 1 (Darkest) -->
                    <g transform="translate(10, 0)">
                      <rect
                        x="0"
                        y="10"
                        width="15"
                        height="50"
                        fill="#3B82F6"
                        fill-opacity="1"
                        rx="2"
                        class="drop-shadow-md"
                      />
                    </g>

                    <!-- Bar 2 -->
                    <g transform="translate(30, 0)">
                      <rect
                        x="0"
                        y="15"
                        width="15"
                        height="45"
                        fill="#60A5FA"
                        fill-opacity="0.85"
                        rx="2"
                        class="drop-shadow-md"
                      />
                    </g>

                    <!-- Bar 3 -->
                    <g transform="translate(50, 0)">
                      <rect
                        x="0"
                        y="25"
                        width="15"
                        height="35"
                        fill="#93C5FD"
                        fill-opacity="1"
                        rx="2"
                        class="drop-shadow-md"
                      />
                    </g>

                    <!-- Bar 4 (Lightest) -->
                    <g transform="translate(70, 0)">
                      <rect
                        x="0"
                        y="35"
                        width="15"
                        height="25"
                        fill="#BFDBFE"
                        fill-opacity="1"
                        rx="2"
                        class="drop-shadow-md"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Floating Logos -->
            <div class="absolute inset-0 z-10 pointer-events-none">
              <!-- Social Media Logos -->
              <div
                class="absolute top-8 left-4 w-8 h-8 bg-black rounded-lg shadow-lg p-1.5 animate-float-slow"
              >
                <Icon name="simple-icons:x" class="w-5 h-5 text-white" />
              </div>
              <div
                class="absolute top-20 right-16 w-8 h-8 bg-[#FF0000] rounded-lg shadow-lg p-1.5 animate-float-slower"
              >
                <Icon name="mdi:youtube" class="w-5 h-5 text-white" />
              </div>
              <div
                class="absolute bottom-14 left-20 w-8 h-8 bg-[#1877F2] rounded-lg shadow-lg p-1.5 animate-float"
              >
                <Icon name="mdi:facebook" class="w-5 h-5 text-white" />
              </div>
              <div
                class="absolute top-40 right-4 w-8 h-8 bg-black rounded-lg shadow-lg p-1.5 animate-float-slow"
              >
                <img src="@/assets/images/tiktok.svg" alt="" srcset="" />
              </div>
              <div
                class="absolute bottom-20 right-24 w-8 h-8 bg-[#FFFC00] rounded-lg shadow-lg p-1.5 animate-float-slower"
              >
                <Icon name="ri:snapchat-fill" class="w-5 h-5 text-black" />
              </div>

              <!-- Document Logos -->
              <div
                class="absolute top-16 left-32 w-8 h-8 bg-white rounded-lg shadow-lg p-1.5 animate-float"
              >
                <Icon
                  name="simple-icons:googledocs"
                  class="w-5 h-5 text-[#3086F6]"
                />
              </div>
              <div
                class="absolute top-32 left-8 w-8 h-8 bg-white rounded-lg shadow-lg p-1.5 animate-float-slow"
              >
                <Icon
                  name="simple-icons:googlesheets"
                  class="w-5 h-5 text-[#0F9D58]"
                />
              </div>
              <div
                class="absolute top-32 right-32 w-8 h-8 rounded-lg shadow-lg animate-float-slower"
              >
                <Icon name="skill-icons:instagram" class="w-8 h-8 text-white" />
              </div>
              <div
                class="absolute bottom-16 right-8 w-8 h-8 bg-black rounded-lg shadow-lg p-1.5 animate-float"
              >
                <Icon name="mdi:qrcode" class="w-5 h-5 text-white" />
              </div>
            </div>

            <button
              class="absolute left-[50%] translate-x-[-50%] bottom-[3rem] px-6 py-3 bg-gradient-to-r from-perlink-blue/20 to-perlink-cyan/20 text-perlink-blue border-2 border-perlink-blue/60 font-semibold rounded-lg hover:from-perlink-cyan/20 hover:to-perlink-blue/20 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
            >
              <span>perlink.to/</span>{{ previewCard }}
            </button>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Features Section -->
    <div class="relative md:h-screen py-10 md:py-24 overflow-hidden">
      <UContainer class="">
        <div class="text-center mb-16">
          <h2
            class="max-w-3xl mx-auto text-3xl md:text-5xl font-black mb-6 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
          >
            Bio Pages, Short URLs & QR Codes
          </h2>
          <p class="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
            Everything you need to share your online presence. Create stunning
            bio link pages, shorten any URL instantly, and generate custom QR
            codes - all in one powerful platform.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <!-- Feature 1 -->
          <div
            class="group relative overflow-hidden bg-white/30 backdrop-blur-lg rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-perlink-blue/5 to-perlink-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div class="relative">
              <div class="flex gap-3 items-center mb-2">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-perlink-blue to-perlink-cyan rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3
                  class="text-2xl font-bold mb-4 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
                >
                  Bio Link Pages
                </h3>
              </div>
              <p class="text-gray-600/90 leading-relaxed">
                Create stunning bio link pages with customizable themes, colors,
                and layouts. Perfect for Instagram, TikTok, and all your social
                profiles.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div
            class="group relative overflow-hidden bg-white/30 backdrop-blur-lg rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-perlink-blue/5 to-perlink-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div class="relative">
              <div class="flex gap-3 items-center mb-2">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-perlink-blue to-perlink-cyan rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <h3
                  class="text-2xl font-bold mb-4 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
                >
                  Short URLs
                </h3>
              </div>
              <p class="text-gray-600/90 leading-relaxed">
                Shorten any long URL into a clean, memorable link. Track clicks
                and manage all your links in one dashboard.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div
            class="group relative overflow-hidden bg-white/30 backdrop-blur-lg rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-perlink-blue/5 to-perlink-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div class="relative">
              <div class="flex gap-3 items-center mb-2">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-perlink-blue to-perlink-cyan rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h3
                  class="text-2xl font-bold mb-4 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
                >
                  QR Codes
                </h3>
              </div>
              <p class="text-gray-600/90 leading-relaxed">
                Generate beautiful QR codes with custom themes including VietQR
                for payments. Perfect for offline marketing and quick sharing.
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="text-center">
          <button
            class="bg-gradient-to-r from-perlink-blue to-perlink-cyan text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
          >
            Get started for free
          </button>
        </div>
      </UContainer>
    </div>
    <!-- FAQ Section -->
    <div
      class="relative md:h-screen py-10 md:py-24 overflow-hidden bg-gradient-to-br from-perlink-blue/10 via-perlink-cyan/5 to-white"
    >
      <!-- Background Mesh -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,168,255,0.1),transparent_50%)]"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,209,218,0.1),transparent_50%)]"
        ></div>
      </div>

      <UContainer class="relative">
        <h2
          class="text-3xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
        >
          Got questions?
        </h2>

        <div class="max-w-3xl mx-auto space-y-4">
          <template v-for="(item, index) in questions" :key="index">
            <div
              class="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/20 hover:border-perlink-blue/20"
            >
              <button
                @click="toggleQuestion(index)"
                class="w-full px-6 py-4 text-left flex items-center justify-between font-medium text-lg text-perlink-blue hover:text-perlink-cyan transition-colors"
              >
                {{ item.question }}
                <svg
                  class="w-6 h-6 transform transition-transform duration-300"
                  :class="{ 'rotate-180': openQuestion === index }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                class="overflow-hidden transition-all duration-300 bg-white/50"
                :class="{
                  'max-h-0': openQuestion !== index,
                  'max-h-96': openQuestion === index,
                }"
              >
                <div class="px-6 py-4 text-gray-600">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </UContainer>
    </div>

    <!-- Testimonials Section -->
    <div
      class="relative py-10 md:py-24 overflow-hidden bg-gradient-to-br from-white via-perlink-blue/5 to-perlink-cyan/5"
    >
      <UContainer class="">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-5xl font-black mb-6 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
          >
            Loved by creators worldwide
          </h2>
          <p class="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Perlink.to to connect
            with their audience
          </p>
        </div>

        <div class="relative max-w-7xl mx-auto">
          <UCarousel
            v-slot="{ item }"
            :items="testimonials"
            loop
            arrows
            :autoplay="{ delay: 4000 }"
            :ui="{
              item: 'basis-full md:basis-1/2 lg:basis-1/3',
              container: 'gap-2',
              viewport: 'px-6',
              prev: 'size-12 flex items-center justify-center',
              next: 'size-12 flex items-center justify-center',
            }"
          >
            <div class="h-full mb-6">
              <div
                class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group border border-white/20 h-full"
              >
                <!-- Quote Icon -->
                <div
                  class="absolute -right-4 -top-4 text-perlink-blue/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500"
                >
                  <UIcon name="i-lucide-quote" class="w-24 h-24" />
                </div>

                <!-- Content -->
                <div class="relative">
                  <!-- Rating -->
                  <div class="flex mb-4">
                    <UIcon
                      v-for="star in item.rating"
                      :key="star"
                      name="i-mingcute-star-fill"
                      class="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  </div>

                  <!-- Testimonial Text -->
                  <p class="text-gray-600 mb-6 text-lg leading-relaxed">
                    {{ item.content }}
                  </p>

                  <!-- Author Info -->
                  <div class="flex items-center">
                    <UAvatar :src="item.image" :alt="item.name" size="md" />
                    <div class="ml-4">
                      <h4 class="font-semibold text-gray-900">
                        {{ item.name }}
                      </h4>
                      <p class="text-gray-500 text-sm">{{ item.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCarousel>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { vElementHover } from "@vueuse/components";
import VueWriter from "~/components/vue-writer.vue";
definePageMeta({
  colorMode: "light",
});
defineOptions({ name: "IndexPage" });

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});

const openQuestion = ref<number | null>(null);

const previewCard = ref("yourname");

const onPreviewCardHover = (hovering: boolean, cardName: string) => {
  previewCard.value = hovering ? cardName : "yourname";
};

const inputValue = ref("");
const errorMessage = ref("");
// const { user } = useUserSession()
const route = useRoute();

// Check if there's a saved input value in the URL when coming back from login
onMounted(() => {
  const savedValue = route.query.input;
  if (savedValue && typeof savedValue === "string") {
    inputValue.value = savedValue;
  }
});

const selectedDomain = ref("perlink.to");

const handleClaimLink = (slug: string) => {
  const { loggedIn } = useUserSession();
  const query = `input=${encodeURIComponent(slug)}&domain=${encodeURIComponent(selectedDomain.value)}`;

  if (loggedIn.value) {
    navigateTo(`/create?${query}`);
  } else {
    navigateTo(`/login?redirect=/create?${query}`);
  }
};

const writerValues = computed(() => {
  return ["yourname", "brand", "shopname", "event", "docs-link", "social-link"];
});

const toggleQuestion = (index: number) => {
  openQuestion.value = openQuestion.value === index ? null : index;
};

onMounted(() => {});

onUnmounted(() => {});

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content:
      "Perlink.to transformed how I share content with my audience. The analytics features are incredible, and the customization options let me perfectly match my brand.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Digital Marketer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: `The best link in bio tool I've ever used. Clean interface, powerful features, and the customer support is top-notch. Highly recommended!`,
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content:
      "Since switching to Perlink.to, our conversion rates have increased by 40%. The e-commerce integration is seamless and our customers love the shopping experience.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "YouTuber",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    content:
      "The analytics dashboard gives me incredible insights into my audience behavior. I can now optimize my content strategy based on real data.",
    rating: 5,
  },
  {
    name: "Lisa Wang",
    role: "Fashion Influencer",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    content:
      "The customization options are endless! I can perfectly match my Perlink.to page with my brand identity. My followers love the cohesive experience.",
    rating: 5,
  },
  {
    name: "James Miller",
    role: "Podcast Host",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    content:
      "Managing multiple podcast platforms was a hassle until I found Perlink.to. Now my listeners can easily find all my content in one place.",
    rating: 5,
  },
  {
    name: "Sophie Martinez",
    role: "Artist",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    content:
      "As an artist, visual presentation is crucial. Perlink.to lets me showcase my portfolio beautifully while maintaining a professional look.",
    rating: 5,
  },
  {
    name: "Alex Kim",
    role: "Tech Reviewer",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    content:
      "The page loading speed is impressive. My tech-savvy audience appreciates the smooth experience and modern design.",
    rating: 5,
  },
  {
    name: "Rachel Foster",
    role: "Fitness Coach",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    content: `I can easily organize my workout programs, nutrition guides, and social media links. It's become an essential tool for my online fitness business.`,
    rating: 5,
  },
  {
    name: "Marcus Bennett",
    role: "Music Producer",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    content:
      "Finally found a platform that lets me showcase my music portfolio, upcoming events, and merch store all in one place. The audio preview feature is fantastic!",
    rating: 5,
  },
  {
    name: "Nina Patel",
    role: "E-commerce Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    content:
      "The analytics and conversion tracking have been game-changing for my business. I can see exactly which products are getting the most attention.",
    rating: 5,
  },
  {
    name: "Thomas Wright",
    role: "Travel Blogger",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    content:
      "As a travel blogger, I love how I can update my links on the go. The mobile app makes it super easy to manage my content while traveling.",
    rating: 5,
  },
];

const questions = [
  {
    question: "What can I do with Perlink.to?",
    answer:
      "Perlink.to is an all-in-one platform for managing your online presence. Create beautiful bio link pages, shorten long URLs into memorable links, and generate custom QR codes including VietQR for payments. Perfect for creators, businesses, and anyone who wants to share their content effectively.",
  },
  {
    question: "How does Perlink.to work?",
    answer:
      "Simply claim your unique perlink.to/username, customize your bio page with themes and links, and start sharing. You can also shorten any URL instantly or create QR codes for offline use. All your analytics are available in one dashboard.",
  },
  {
    question: "What is VietQR and how do I use it?",
    answer:
      "VietQR is a QR code standard for bank transfers in Vietnam. With Perlink.to, you can create beautiful themed VietQR codes that customers can scan to pay you instantly. Perfect for small businesses, freelancers, and content creators.",
  },
  {
    question: "Is Perlink.to free to use?",
    answer:
      "Yes! Perlink.to offers a generous free plan with essential features. For advanced customization, analytics, and premium features, we offer affordable paid plans. Start free and upgrade when you need more.",
  },
];

onMounted(() => {
  document.querySelectorAll(".animate-draw-line").forEach((path) => {
    const svgPath = path as SVGPathElement;
    const length = svgPath.getTotalLength();
    svgPath.style.setProperty("--dash-length", length.toString());
    svgPath.style.animationDelay = `${Array.from(document.querySelectorAll(".animate-draw-line")).indexOf(path) * 0.3}s`;
  });
});
</script>
<style lang="css">
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(-30px) translateX(-15px);
  }
}

@keyframes float-slower {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(25px) translateX(15px);
  }
}

@keyframes draw-line {
  0% {
    stroke-dashoffset: var(--dash-length);
  }

  100% {
    stroke-dashoffset: 0;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 10s ease-in-out infinite;
}

.animate-draw-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: calc(var(--dash-length) * 0.3) var(--dash-length);
  /* Tạo hiệu ứng đuôi */
  stroke-dashoffset: var(--dash-length);
  animation: draw-line 2s ease-out infinite;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}
</style>
