<template>
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

    <!-- ============ HERO ============ -->
    <UContainer
      id="claim"
      class="relative z-[1] min-h-[100svh] md:min-h-screen flex flex-col items-center justify-center pb-10 md:pb-0"
    >
      <div class="h-[7rem] md:h-[6rem]"></div>
      <div
        class="flex lg:flex-row flex-col gap-10 lg:gap-12 items-center w-full max-w-full"
      >
        <!-- Text Content -->
        <div
          class="flex-1 min-w-0 space-y-7 flex flex-col items-center lg:items-start"
        >
          <div
            class="inline-flex items-center gap-2 rounded-full border border-perlink-blue/20 bg-white/70 backdrop-blur px-3 py-1 text-xs md:text-sm font-medium text-perlink-blue shadow-sm"
          >
            <UIcon name="i-lucide-sparkles" class="size-4 text-perlink-cyan" />
            Portfolio templates + interactive 3D rooms
          </div>

          <h1
            class="text-center lg:text-left font-black text-[2.4rem] leading-[1.1] md:text-6xl md:leading-[1.08] text-gray-900 max-w-[22rem] md:max-w-2xl"
          >
            <span class="block">A beautiful <span class="whitespace-nowrap">page for</span></span>
            <span class="relative block h-[1.15em] overflow-hidden">
              <Transition name="hero-word" mode="out-in">
                <span
                  :key="heroWordIndex"
                  class="absolute inset-x-0 lg:inset-x-auto lg:left-0 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
                >
                  {{ heroWords[heroWordIndex] }}
                </span>
              </Transition>
            </span>
          </h1>

          <p
            class="text-gray-600 text-base md:text-xl text-center lg:text-left max-w-md md:max-w-xl"
          >
            Pick a portfolio template, make it yours with drag-and-drop, and
            share it at
            <strong class="text-perlink-blue font-semibold"
              >perlink.to/yourname</strong
            >. One page can be your portfolio, a restaurant menu, a hotel
            website or a shop.
          </p>

          <div class="w-full max-w-xl">
            <FeaturesSlugInput
              v-model="inputValue"
              hide-domain-switch
              confirm-text="Claim your page"
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
            <p
              class="mt-3 text-xs md:text-sm text-gray-500 text-center lg:text-left"
            >
              Free forever plan · No credit card · Live in under a minute
            </p>
          </div>
        </div>

        <!-- Preview: stacked template pages -->
        <div class="relative w-full lg:w-auto shrink-0">
          <div
            class="relative mx-auto h-[20rem] sm:h-[25rem] md:h-[31rem] w-full md:w-[34rem]"
          >
            <div
              class="absolute left-1/2 top-0 w-[34rem] h-[31rem] -translate-x-1/2 origin-top scale-[0.62] sm:scale-[0.8] md:scale-100"
            >
              <!-- Restaurant card -->
              <div
                v-element-hover="(e: boolean) => onPreviewCardHover(e, 'saigon-kitchen')"
                class="absolute left-0 top-[4.5rem] w-[16.5rem] rounded-3xl overflow-hidden bg-white shadow-xl border border-orange-200/60 -rotate-[9deg] hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300 z-[2]"
              >
                <div
                  class="h-20 bg-gradient-to-br from-orange-400 to-rose-500 relative"
                >
                  <div
                    class="absolute -bottom-6 left-5 size-12 rounded-2xl bg-white shadow flex items-center justify-center"
                  >
                    <UIcon name="i-lucide-utensils" class="size-6 text-rose-500" />
                  </div>
                </div>
                <div class="pt-8 px-5 pb-5 space-y-3">
                  <div>
                    <h3 class="font-bold text-gray-900">Saigon Kitchen</h3>
                    <p class="text-xs text-gray-500">Open today · 10:00–22:00</p>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div
                      v-for="dish in heroMenu"
                      :key="dish.name"
                      class="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2"
                    >
                      <span class="text-gray-700">{{ dish.name }}</span>
                      <span class="font-semibold text-rose-500">{{ dish.price }}</span>
                    </div>
                  </div>
                  <div
                    class="rounded-full bg-rose-500 text-white text-center text-sm font-semibold py-2"
                  >
                    Reserve a table
                  </div>
                </div>
              </div>

              <!-- Hotel card -->
              <div
                v-element-hover="(e: boolean) => onPreviewCardHover(e, 'seaside-homestay')"
                class="absolute right-0 top-[5.5rem] w-[16.5rem] rounded-3xl overflow-hidden bg-white shadow-xl border border-teal-200/60 rotate-[9deg] hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300 z-[1]"
              >
                <div
                  class="h-28 bg-gradient-to-br from-teal-400 to-sky-500 relative overflow-hidden"
                >
                  <div
                    class="absolute -bottom-8 -right-6 size-28 rounded-full bg-white/20"
                  ></div>
                  <div
                    class="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow"
                  >
                    Seaside Homestay
                  </div>
                </div>
                <div class="p-5 space-y-3">
                  <p class="text-xs text-gray-500 flex items-center gap-1">
                    <UIcon name="i-lucide-map-pin" class="size-3.5" /> Da Nang ·
                    <UIcon name="i-lucide-star" class="size-3.5 text-amber-400" /> 4.9
                  </p>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="h-14 rounded-xl bg-gradient-to-br from-sky-100 to-teal-100"></div>
                    <div class="h-14 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100"></div>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-700">Ocean view room</span>
                    <span class="font-semibold text-teal-600">$48</span>
                  </div>
                  <div
                    class="rounded-full bg-teal-500 text-white text-center text-sm font-semibold py-2"
                  >
                    Book your stay
                  </div>
                </div>
              </div>

              <!-- Personal card (front) -->
              <div
                v-element-hover="(e: boolean) => onPreviewCardHover(e, 'linh')"
                class="absolute left-1/2 top-0 -translate-x-1/2 w-[17rem] rounded-3xl bg-white/90 backdrop-blur-lg shadow-2xl border border-perlink-blue/15 p-5 -rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-[3]"
              >
                <div class="flex flex-col items-center text-center">
                  <div
                    class="size-16 rounded-full p-[3px] bg-gradient-to-br from-perlink-blue to-perlink-cyan"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt=""
                      class="size-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <h3 class="mt-3 font-bold text-gray-900">Linh Tran</h3>
                  <p class="text-xs text-gray-500">Product designer · Hanoi</p>
                </div>
                <div class="mt-4 grid grid-cols-3 gap-1.5">
                  <div class="aspect-square rounded-lg bg-gradient-to-br from-perlink-blue/30 to-perlink-cyan/30"></div>
                  <div class="aspect-square rounded-lg bg-gradient-to-br from-perlink-purple/30 to-pink-300/40"></div>
                  <div class="aspect-square rounded-lg bg-gradient-to-br from-amber-200 to-orange-300/60"></div>
                </div>
                <div class="mt-3 space-y-2 text-sm">
                  <div
                    class="rounded-xl bg-gradient-to-r from-perlink-blue/10 to-perlink-cyan/10 px-3 py-2 text-perlink-blue font-medium"
                  >
                    Selected work
                  </div>
                  <div
                    class="rounded-xl bg-gradient-to-r from-perlink-blue/10 to-perlink-cyan/10 px-3 py-2 text-perlink-blue font-medium"
                  >
                    Book a call
                  </div>
                </div>
              </div>

              <!-- Floating chips -->
              <div
                class="absolute left-6 top-0 z-10 flex items-center gap-1.5 rounded-full bg-white shadow-lg px-3 py-1.5 text-xs font-semibold text-perlink-blue animate-float-slow pointer-events-none"
              >
                <UIcon name="i-lucide-box" class="size-4" /> 3D mode
              </div>
              <div
                class="absolute right-4 top-6 z-10 size-10 rounded-xl bg-gray-900 shadow-lg flex items-center justify-center animate-float-slower pointer-events-none"
              >
                <UIcon name="i-lucide-qr-code" class="size-6 text-white" />
              </div>
              <div
                class="absolute right-10 bottom-14 z-10 flex items-center gap-1.5 rounded-full bg-white shadow-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 animate-float pointer-events-none"
              >
                <UIcon name="i-lucide-trending-up" class="size-4" /> +128 visits today
              </div>

              <!-- URL pill -->
              <div
                class="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 px-6 py-3 bg-white/90 backdrop-blur text-perlink-blue border-2 border-perlink-blue/50 font-semibold rounded-full shadow-lg whitespace-nowrap"
              >
                <span class="text-perlink-blue/60">perlink.to/</span>{{ previewCard }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- ============ TEMPLATE GALLERY ============ -->
    <section id="templates" class="relative z-[1] py-16 md:py-24 scroll-mt-24">
      <UContainer>
        <div class="text-center mb-12 md:mb-16">
          <p
            class="text-sm font-semibold uppercase tracking-wider text-perlink-cyan mb-3"
          >
            Portfolio templates
          </p>
          <h2
            class="max-w-3xl mx-auto text-3xl md:text-5xl font-black mb-5 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
          >
            One page, any purpose
          </h2>
          <p class="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
            Start from a template built for what you do, then change anything:
            sections, colors, photos, buttons.
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          <article
            v-for="tpl in templates"
            :key="tpl.id"
            class="group flex flex-col rounded-3xl bg-white/70 backdrop-blur-lg border border-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-3"
          >
            <!-- Mini page mock -->
            <div
              class="rounded-2xl overflow-hidden bg-white border border-gray-100"
            >
              <div class="h-16 relative bg-gradient-to-br" :class="tpl.cover">
                <div
                  class="absolute -bottom-5 left-4 size-10 rounded-xl bg-white shadow flex items-center justify-center"
                >
                  <UIcon :name="tpl.icon" class="size-5" :class="tpl.accentText" />
                </div>
              </div>
              <div class="pt-7 px-4 pb-4 space-y-2.5">
                <div>
                  <p class="font-bold text-gray-900 text-sm leading-tight">
                    {{ tpl.mockTitle }}
                  </p>
                  <p class="text-[11px] text-gray-500">{{ tpl.mockSubtitle }}</p>
                </div>
                <div
                  v-for="row in tpl.rows"
                  :key="row.label"
                  class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs"
                  :class="tpl.rowBg"
                >
                  <span class="text-gray-700 truncate">{{ row.label }}</span>
                  <span class="font-semibold shrink-0 ml-2" :class="tpl.accentText">
                    {{ row.meta }}
                  </span>
                </div>
                <div
                  class="rounded-full text-white text-center text-xs font-semibold py-1.5"
                  :class="tpl.button"
                >
                  {{ tpl.cta }}
                </div>
              </div>
            </div>

            <div class="px-2 pt-4 pb-2 flex-1 flex flex-col">
              <h3 class="font-bold text-gray-900">{{ tpl.name }}</h3>
              <p class="text-sm text-gray-500 mt-1 flex-1">{{ tpl.description }}</p>
              <p class="mt-3 text-xs font-medium text-perlink-blue/80 truncate">
                perlink.to/{{ tpl.slug }}
              </p>
            </div>
          </article>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span class="text-sm text-gray-500 mr-1">Also great for</span>
          <span
            v-for="use in moreUses"
            :key="use"
            class="rounded-full bg-white/80 border border-perlink-blue/10 px-3 py-1 text-sm text-gray-700"
          >
            {{ use }}
          </span>
        </div>
      </UContainer>
    </section>

    <!-- ============ HOW IT WORKS ============ -->
    <section class="relative z-[1] py-12 md:py-16">
      <UContainer>
        <div class="grid md:grid-cols-3 gap-5">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="relative rounded-3xl bg-white/60 backdrop-blur border border-white p-6 md:p-8"
          >
            <div
              class="size-10 rounded-full bg-gradient-to-br from-perlink-blue to-perlink-cyan text-white font-bold flex items-center justify-center mb-4"
            >
              {{ i + 1 }}
            </div>
            <h3 class="text-lg font-bold text-gray-900">{{ step.title }}</h3>
            <p class="text-gray-600 mt-1.5">{{ step.text }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ============ 3D MODE ============ -->
    <section id="3d-mode" class="relative z-[1] py-16 md:py-24 scroll-mt-24">
      <UContainer>
        <div
          class="rounded-[2rem] border border-perlink-blue/10 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          <div class="grid lg:grid-cols-2 gap-0">
            <!-- Copy -->
            <div class="p-6 md:p-12 flex flex-col justify-center">
              <p
                class="text-sm font-semibold uppercase tracking-wider text-perlink-cyan mb-3"
              >
                3D mode
              </p>
              <h2
                class="text-3xl md:text-5xl font-black mb-5 text-gray-900 leading-tight"
              >
                Turn your page into a
                <span
                  class="bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
                  >tiny 3D room</span
                >
              </h2>
              <p class="text-gray-600 text-base md:text-lg">
                Show your page as an interactive mini room that visitors can
                explore. Decorate it your way, and let every object open a link,
                a menu, a gallery or a booking form.
              </p>

              <ul class="mt-7 space-y-4">
                <li
                  v-for="point in roomPoints"
                  :key="point.title"
                  class="flex gap-3"
                >
                  <div
                    class="size-9 shrink-0 rounded-xl bg-perlink-blue/10 flex items-center justify-center"
                  >
                    <UIcon :name="point.icon" class="size-5 text-perlink-blue" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ point.title }}</p>
                    <p class="text-sm text-gray-600">{{ point.text }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Scene -->
            <div
              class="room-scene relative min-h-[22rem] md:min-h-[30rem] flex flex-col"
              :class="isNight ? 'room-night' : 'room-day'"
            >
              <!-- Controls -->
              <div
                class="relative z-10 flex flex-wrap items-center justify-between gap-2 p-4 md:p-5"
              >
                <div
                  class="inline-flex rounded-full bg-white/80 backdrop-blur p-1 shadow-sm text-sm"
                  role="group"
                  aria-label="Room lighting"
                >
                  <button
                    v-for="mode in roomModes"
                    :key="mode.id"
                    type="button"
                    class="px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5"
                    :class="
                      roomMode === mode.id
                        ? 'bg-perlink-blue text-white'
                        : 'text-gray-600 hover:text-perlink-blue'
                    "
                    :aria-pressed="roomMode === mode.id"
                    @click="setRoomMode(mode.id)"
                  >
                    <UIcon :name="mode.icon" class="size-4" />
                    {{ mode.label }}
                  </button>
                </div>
                <div
                  class="rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-xs font-semibold shadow-sm"
                  :class="isNight ? 'text-indigo-700' : 'text-amber-600'"
                >
                  {{ isNight ? "Night · lamps on" : "Daytime" }}
                </div>
              </div>

              <div class="relative flex-1 flex items-center justify-center px-4 pb-6">
                <svg
                  viewBox="40 20 320 330"
                  class="w-full max-w-[26rem] h-auto drop-shadow-2xl"
                  role="img"
                  aria-label="Illustration of a decorated 3D mini room with a window, lamp, sofa, plant and picture frame"
                >
                  <defs>
                    <clipPath id="room-inside-clip">
                      <polygon points="60,110 200,40 340,110 340,260 200,330 60,260" />
                    </clipPath>
                    <clipPath id="room-window-clip">
                      <polygon points="242,101 298,129 298,184 242,156" />
                    </clipPath>
                    <radialGradient id="room-lamp-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ffd27a" stop-opacity="0.85" />
                      <stop offset="60%" stop-color="#ffb347" stop-opacity="0.25" />
                      <stop offset="100%" stop-color="#ffb347" stop-opacity="0" />
                    </radialGradient>
                  </defs>

                  <!-- Floor & walls -->
                  <polygon class="room-floor" points="200,190 340,260 200,330 60,260" />
                  <polygon class="room-wall-l" points="60,260 200,190 200,40 60,110" />
                  <polygon class="room-wall-r" points="200,190 340,260 340,110 200,40" />
                  <!-- Wall edges -->
                  <polygon class="room-edge" points="60,260 60,268 200,338 200,330" />
                  <polygon class="room-edge-r" points="200,330 200,338 340,268 340,260" />

                  <!-- Rug -->
                  <polygon class="room-rug" points="200,232 262,263 200,294 138,263" />

                  <!-- Window with sky -->
                  <polygon class="room-window-frame" points="238,95 302,127 302,190 238,158" />
                  <g clip-path="url(#room-window-clip)">
                    <polygon class="room-sky" points="242,101 298,129 298,184 242,156" />
                    <circle class="room-sun" cx="276" cy="136" r="9" />
                    <g class="room-stars">
                      <circle cx="252" cy="122" r="1.2" fill="#fff" />
                      <circle cx="262" cy="139" r="0.9" fill="#fff" />
                      <circle cx="288" cy="160" r="1.1" fill="#fff" />
                      <circle cx="257" cy="150" r="0.8" fill="#fff" />
                    </g>
                    <circle class="room-moon" cx="282" cy="142" r="7" />
                  </g>
                  <line x1="270" y1="115" x2="270" y2="170" class="room-mullion" />

                  <!-- Picture frame (clickable hotspot) -->
                  <polygon points="153,97 114,117 114,165 153,145" fill="#c99a5b" />
                  <polygon class="room-art" points="149,103 118,119 118,159 149,143" />
                  <circle cx="134" cy="129" r="6" fill="#ffd166" opacity="0.9" />
                  <polygon points="120,156 132,138 147,146 147,141" fill="#2a9d8f" opacity="0.85" />

                  <!-- String lights on left wall -->
                  <path
                    d="M70,120 Q100,118 125,100 Q160,82 195,55"
                    fill="none"
                    class="room-string"
                  />
                  <g class="room-bulbs">
                    <circle cx="82" cy="119" r="2.6" />
                    <circle cx="104" cy="113" r="2.6" />
                    <circle cx="125" cy="100" r="2.6" />
                    <circle cx="148" cy="88" r="2.6" />
                    <circle cx="172" cy="73" r="2.6" />
                    <circle cx="192" cy="58" r="2.6" />
                  </g>

                  <!-- Plant in the corner -->
                  <ellipse cx="183" cy="186" rx="8" ry="15" class="room-leaf" transform="rotate(-25 183 186)" />
                  <ellipse cx="197" cy="182" rx="7" ry="16" class="room-leaf-2" />
                  <ellipse cx="210" cy="188" rx="8" ry="14" class="room-leaf" transform="rotate(28 210 188)" />
                  <polygon points="184,198 212,198 208,220 188,220" fill="#c2703d" />
                  <polygon points="184,198 212,198 211,203 185,203" fill="#a85d30" />

                  <!-- Lamp glow (night) -->
                  <circle class="room-glow" cx="104" cy="196" r="78" fill="url(#room-lamp-glow)" clip-path="url(#room-inside-clip)" />

                  <!-- Floor lamp -->
                  <ellipse cx="104" cy="262" rx="11" ry="4.5" fill="#3d405b" />
                  <line x1="104" y1="262" x2="104" y2="186" stroke="#3d405b" stroke-width="3" />
                  <polygon class="room-shade" points="88,190 120,190 113,170 95,170" />

                  <!-- Sofa -->
                  <polygon class="room-sofa-back" points="255,223 315,253 315,229 255,199" />
                  <polygon class="room-sofa-top" points="255,223 315,253 285,268 225,238" />
                  <polygon class="room-sofa-front" points="225,238 285,268 285,288 225,258" />
                  <polygon class="room-sofa-side" points="285,268 315,253 315,273 285,288" />
                  <polygon points="236,236 252,244 252,234 236,226" fill="#ffd166" />

                  <!-- Side table + book -->
                  <polygon points="150,262 172,273 150,284 128,273" fill="#b07d4f" />
                  <polygon points="128,273 150,284 150,288 128,277" fill="#8c5f38" />
                  <polygon points="150,284 172,273 172,277 150,288" fill="#9c6b41" />
                  <polygon points="143,268 156,274 150,277 137,271" fill="#e76f51" />

                  <!-- Hotspots -->
                  <g class="room-hotspot">
                    <circle cx="134" cy="131" r="11" class="room-hotspot-ring" />
                    <circle cx="134" cy="131" r="4" class="room-hotspot-dot" />
                  </g>
                  <g class="room-hotspot" style="animation-delay: 0.6s">
                    <circle cx="270" cy="238" r="11" class="room-hotspot-ring" />
                    <circle cx="270" cy="238" r="4" class="room-hotspot-dot" />
                  </g>
                  <g class="room-hotspot" style="animation-delay: 1.2s">
                    <circle cx="150" cy="268" r="11" class="room-hotspot-ring" />
                    <circle cx="150" cy="268" r="4" class="room-hotspot-dot" />
                  </g>

                  <!-- Night tint over the room -->
                  <polygon class="room-tint" points="60,110 200,40 340,110 340,268 200,338 60,268" />
                  <!-- Hotspot labels -->
                  <g class="room-label">
                    <rect x="92" y="72" width="58" height="17" rx="6" />
                    <text x="121" y="84">Gallery</text>
                  </g>
                  <g class="room-label">
                    <rect x="276" y="194" width="66" height="17" rx="6" />
                    <text x="309" y="206">Book a stay</text>
                  </g>
                  <g class="room-label">
                    <rect x="90" y="290" width="48" height="17" rx="6" />
                    <text x="114" y="302">Menu</text>
                  </g>
                </svg>

              </div>

              <p
                class="relative z-10 px-5 pb-5 text-xs text-center"
                :class="isNight ? 'text-white/70' : 'text-gray-600'"
              >
                On live pages the sky follows each visitor's local time, or a
                custom rhythm you set (like 1 minute day, 1 minute night).
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ============ FEATURES ============ -->
    <section id="features" class="relative z-[1] py-16 md:py-24 scroll-mt-24">
      <UContainer>
        <div class="text-center mb-12 md:mb-16">
          <h2
            class="max-w-3xl mx-auto text-3xl md:text-5xl font-black mb-5 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
          >
            Everything your page needs
          </h2>
          <p class="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
            Build, style, share and measure, without writing a line of code.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group relative overflow-hidden bg-white/60 backdrop-blur-lg rounded-3xl p-7 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-white"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-perlink-blue/5 to-perlink-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <div class="relative">
              <div
                class="size-14 bg-gradient-to-br from-perlink-blue to-perlink-cyan rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
              >
                <UIcon :name="feature.icon" class="size-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 leading-relaxed">{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ============ TESTIMONIALS ============ -->
    <section
      class="relative z-[1] py-16 md:py-24 overflow-hidden bg-gradient-to-br from-white via-perlink-blue/5 to-perlink-cyan/5"
    >
      <UContainer>
        <div class="text-center mb-12 md:mb-16">
          <h2
            class="text-3xl md:text-5xl font-black mb-5 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
          >
            Made for people and places
          </h2>
          <p class="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
            Freelancers, restaurants, homestays and makers use Perlink.to as
            their home on the web.
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
                <div
                  class="absolute -right-4 -top-4 text-perlink-blue/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500"
                >
                  <UIcon name="i-lucide-quote" class="w-24 h-24" />
                </div>
                <div class="relative">
                  <div class="flex mb-4">
                    <UIcon
                      v-for="star in item.rating"
                      :key="star"
                      name="i-mingcute-star-fill"
                      class="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  </div>
                  <p class="text-gray-600 mb-6 text-lg leading-relaxed">
                    {{ item.content }}
                  </p>
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
    </section>

    <!-- ============ FAQ ============ -->
    <section
      id="faq"
      class="relative z-[1] py-16 md:py-24 overflow-hidden bg-gradient-to-br from-perlink-blue/10 via-perlink-cyan/5 to-white"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,168,255,0.1),transparent_50%)]"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,209,218,0.1),transparent_50%)]"
        ></div>
      </div>

      <UContainer class="relative">
        <h2
          class="text-3xl md:text-5xl font-black text-center mb-12 md:mb-16 bg-gradient-to-r from-perlink-blue to-perlink-cyan bg-clip-text text-transparent"
        >
          Got questions?
        </h2>

        <div class="max-w-3xl mx-auto space-y-4">
          <div
            v-for="(item, index) in questions"
            :key="index"
            class="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/20 hover:border-perlink-blue/20"
          >
            <button
              type="button"
              class="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-base md:text-lg text-perlink-blue hover:text-perlink-cyan transition-colors"
              :aria-expanded="openQuestion === index"
              @click="toggleQuestion(index)"
            >
              {{ item.question }}
              <UIcon
                name="i-lucide-chevron-down"
                class="size-6 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180': openQuestion === index }"
              />
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
        </div>
      </UContainer>
    </section>

    <!-- ============ CTA ============ -->
    <section class="relative z-[1] py-16 md:py-24">
      <UContainer>
        <div
          class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-perlink-blue to-perlink-cyan px-6 py-12 md:px-16 md:py-16 text-center text-white shadow-2xl"
        >
          <div
            class="absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-2xl"
          ></div>
          <div
            class="absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-2xl"
          ></div>
          <div class="relative">
            <h2 class="text-3xl md:text-5xl font-black">
              Your page is one name away
            </h2>
            <p class="mt-4 text-white/85 text-base md:text-xl max-w-2xl mx-auto">
              Claim perlink.to/yourname, pick a template, and publish in minutes.
              Free to start.
            </p>
            <div
              class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <UButton
                to="#claim"
                size="xl"
                color="neutral"
                variant="solid"
                class="rounded-full px-6 bg-white text-perlink-blue hover:bg-white/90"
                trailing-icon="i-lucide-arrow-right"
              >
                Claim your page
              </UButton>
              <UButton
                to="/pricing"
                size="xl"
                variant="ghost"
                class="rounded-full px-6 text-white hover:bg-white/10"
              >
                See pricing
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
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

// ---------- SEO ----------
const SITE_URL = "https://perlink.to";
const seoTitle = "Perlink.to - Portfolio Templates & 3D Pages for Anything";
const seoDescription =
  "Build a beautiful page for you, your restaurant, your hotel or your shop. Pick a portfolio template, customize it with drag-and-drop, switch on interactive 3D mode, and share it at perlink.to/yourname.";
const ogImage = `${SITE_URL}/logo-full.png`;

useHead({
  meta: [
    {
      name: "keywords",
      content:
        "portfolio template, page builder, personal website, restaurant menu page, hotel website, homestay website, cafe website, creator portfolio, 3D portfolio, link in bio",
    },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-title", content: "Perlink.to" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
  ],
  link: [{ rel: "canonical", href: SITE_URL }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            name: "Perlink.to",
            url: SITE_URL,
            description: seoDescription,
          },
          {
            "@type": "SoftwareApplication",
            name: "Perlink.to",
            url: SITE_URL,
            applicationCategory: "WebApplication",
            operatingSystem: "Any",
            description: seoDescription,
            featureList: [
              "Portfolio templates for people, restaurants, hotels, cafés and creators",
              "Drag-and-drop page editor",
              "Interactive 3D room mode with day and night cycle",
              "Themes and backgrounds",
              "Page analytics",
              "QR code sharing",
              "Custom domains",
            ],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
        ],
      }),
    },
  ],
});

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: SITE_URL,
  ogSiteName: "Perlink.to",
  ogType: "website",
  ogImage,
  twitterCard: "summary_large_image",
  twitterSite: "@perlinkto",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: ogImage,
});

// ---------- Hero ----------
const heroWords = ["you", "your menu", "your hotel", "your café", "your art", "your shop"];
const heroWordIndex = ref(0);

const previewCard = ref("yourname");
const onPreviewCardHover = (hovering: boolean, cardName: string) => {
  previewCard.value = hovering ? cardName : "yourname";
};

const heroMenu = [
  { name: "Grilled pork banh mi", price: "$6" },
  { name: "Beef pho", price: "$9" },
  { name: "Iced milk coffee", price: "$3" },
];

const inputValue = ref("");
const route = useRoute();

const handleClaimLink = (slug: string) => {
  const { loggedIn } = useUserSession();
  // The landing page only claims pages on perlink.to.
  const query = `input=${encodeURIComponent(slug)}&domain=perlink.to`;

  if (loggedIn.value) {
    navigateTo(`/create?${query}`);
  } else {
    navigateTo(`/login?redirect=/create?${query}`);
  }
};

const writerValues = ["yourname", "saigon-kitchen", "seaside-homestay", "mocha-corner", "mai-studio"];

// ---------- Templates ----------
const templates = [
  {
    id: "personal",
    name: "Personal portfolio",
    description: "Show who you are, your best work and how to reach you.",
    slug: "linh",
    icon: "i-lucide-user-round",
    cover: "from-perlink-blue to-perlink-cyan",
    accentText: "text-perlink-blue",
    rowBg: "bg-perlink-blue/5",
    button: "bg-perlink-blue",
    mockTitle: "Linh Tran",
    mockSubtitle: "Product designer · Hanoi",
    rows: [
      { label: "Selected work", meta: "12" },
      { label: "Resume", meta: "PDF" },
      { label: "Book a call", meta: "30 min" },
    ],
    cta: "Say hello",
  },
  {
    id: "restaurant",
    name: "Restaurant menu",
    description: "A mobile menu with prices, opening hours and reservations.",
    slug: "saigon-kitchen",
    icon: "i-lucide-utensils",
    cover: "from-orange-400 to-rose-500",
    accentText: "text-rose-500",
    rowBg: "bg-orange-50",
    button: "bg-rose-500",
    mockTitle: "Saigon Kitchen",
    mockSubtitle: "Open today · 10:00–22:00",
    rows: [
      { label: "Grilled pork banh mi", meta: "$6" },
      { label: "Beef pho", meta: "$9" },
      { label: "Iced milk coffee", meta: "$3" },
    ],
    cta: "Reserve a table",
  },
  {
    id: "hotel",
    name: "Hotel & homestay",
    description: "Rooms, photos, amenities and a direct booking button.",
    slug: "seaside-homestay",
    icon: "i-lucide-bed-double",
    cover: "from-teal-400 to-sky-500",
    accentText: "text-teal-600",
    rowBg: "bg-teal-50",
    button: "bg-teal-500",
    mockTitle: "Seaside Homestay",
    mockSubtitle: "Da Nang · 4.9 rating",
    rows: [
      { label: "Ocean view room", meta: "$48" },
      { label: "Family suite", meta: "$72" },
      { label: "Airport pickup", meta: "Free" },
    ],
    cta: "Book your stay",
  },
  {
    id: "cafe",
    name: "Café & shop",
    description: "Products, daily specials and pickup orders in one place.",
    slug: "mocha-corner",
    icon: "i-lucide-coffee",
    cover: "from-amber-400 to-orange-600",
    accentText: "text-amber-700",
    rowBg: "bg-amber-50",
    button: "bg-amber-600",
    mockTitle: "Mocha Corner",
    mockSubtitle: "Coffee · pastries · beans",
    rows: [
      { label: "Signature latte", meta: "$4" },
      { label: "Croissant box", meta: "$8" },
      { label: "House blend 250g", meta: "$12" },
    ],
    cta: "Order for pickup",
  },
  {
    id: "creator",
    name: "Creator & artist",
    description: "A gallery for your art, commissions and print shop.",
    slug: "mai-studio",
    icon: "i-lucide-palette",
    cover: "from-perlink-purple to-pink-500",
    accentText: "text-perlink-purple",
    rowBg: "bg-perlink-purple/5",
    button: "bg-perlink-purple",
    mockTitle: "Mai Studio",
    mockSubtitle: "Illustration & prints",
    rows: [
      { label: "Gallery", meta: "48 works" },
      { label: "Commissions", meta: "Open" },
      { label: "Print shop", meta: "New" },
    ],
    cta: "Commission me",
  },
];

const moreUses = ["Events & weddings", "Gyms & studios", "Clinics & salons", "Real estate", "Musicians", "Tour guides"];

const steps = [
  {
    title: "Claim your name",
    text: "Grab perlink.to/yourname. It's yours to keep, even on the free plan.",
  },
  {
    title: "Pick a template",
    text: "Choose a portfolio, menu, hotel, shop or creator layout as your starting point.",
  },
  {
    title: "Make it yours and share",
    text: "Drag in sections, set your theme, then share the link or its QR code anywhere.",
  },
];

// ---------- 3D room ----------
const roomPoints = [
  {
    icon: "i-lucide-sofa",
    title: "Decorate with drag-and-drop",
    text: "Place furniture, lamps, plants and picture frames anywhere in your room.",
  },
  {
    icon: "i-lucide-sun-moon",
    title: "A real day and night",
    text: "The room follows each visitor's local time. At night it gets dark and the lamps light up.",
  },
  {
    icon: "i-lucide-mouse-pointer-click",
    title: "Click to explore",
    text: "Visitors rotate the room and tap objects to open your links, menu, gallery or booking.",
  },
];

type RoomMode = "auto" | "day" | "night";
const roomModes: { id: RoomMode; label: string; icon: string }[] = [
  { id: "auto", label: "Auto", icon: "i-lucide-refresh-cw" },
  { id: "day", label: "Day", icon: "i-lucide-sun" },
  { id: "night", label: "Night", icon: "i-lucide-moon" },
];
const roomMode = ref<RoomMode>("auto");
const isNight = ref(false);

function setRoomMode(mode: RoomMode) {
  roomMode.value = mode;
  if (mode === "day") isNight.value = false;
  if (mode === "night") isNight.value = true;
}

// ---------- FAQ ----------
const openQuestion = ref<number | null>(null);
const toggleQuestion = (index: number) => {
  openQuestion.value = openQuestion.value === index ? null : index;
};

const questions = [
  {
    question: "What can I build with Perlink.to?",
    answer:
      "Any single page you want to share: a personal portfolio, a restaurant menu, a hotel or homestay website, a café or shop page, an artist gallery, an event page and more. Start from a template and customize everything.",
  },
  {
    question: "Do I need to know how to code or design?",
    answer:
      "No. Pick a template, then drag and drop sections, swap photos and text, and choose a theme. Your page looks great on phones and desktops automatically.",
  },
  {
    question: "What is 3D mode?",
    answer:
      "3D mode shows your page as an interactive mini room. You decorate it with furniture, lamps, plants and picture frames, and each object can open a link or a piece of content. The room has a day and night cycle that follows your visitor's local time, or a custom rhythm you choose, and the lamps light up at night.",
  },
  {
    question: "Can I change my template later?",
    answer:
      "Yes. You can switch templates and themes whenever you like to give your page a new look.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes. Every page lives at perlink.to/yourname, and on the Plus plan and above you can connect your own custom domain.",
  },
  {
    question: "Is Perlink.to free?",
    answer:
      "Yes. The free plan includes your own page, templates, basic analytics and a QR code to share it. Paid plans add more pages, premium themes, longer analytics, branding removal and custom domains.",
  },
];

// ---------- Features ----------
const features = [
  {
    icon: "i-lucide-layout-template",
    title: "Drag-and-drop editor",
    text: "Add, reorder and edit sections like menus, galleries, rooms, products and contact buttons, all with live preview.",
  },
  {
    icon: "i-lucide-palette",
    title: "Themes & backgrounds",
    text: "20 ready-made themes plus custom colors, fonts, gradients and background images to match your brand.",
  },
  {
    icon: "i-lucide-box",
    title: "Interactive 3D mode",
    text: "Turn any page into a decorated mini room with a day and night cycle that visitors can explore.",
  },
  {
    icon: "i-lucide-chart-column",
    title: "Analytics",
    text: "See how many people visit your page and which buttons they click, so you know what your audience cares about.",
  },
  {
    icon: "i-lucide-qr-code",
    title: "QR sharing",
    text: "Share your page with a QR code on tables, flyers, business cards and hotel rooms. VietQR payments supported.",
  },
  {
    icon: "i-lucide-globe",
    title: "Custom domains",
    text: "Use perlink.to/yourname for free, or connect your own domain on Plus and Pro plans.",
  },
];

// ---------- Testimonials ----------
const testimonials = [
  {
    name: "Minh Nguyen",
    role: "Restaurant owner",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "We replaced our printed menus with a Perlink.to page and a QR code on every table. Updating prices now takes seconds.",
    rating: 5,
  },
  {
    name: "Hana Le",
    role: "Homestay host",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "The hotel template gave us a real website in one evening: rooms, photos and a booking button. Guests book directly with us now.",
    rating: 5,
  },
  {
    name: "Daniel Park",
    role: "Freelance designer",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    content:
      "My portfolio finally looks the way I want. Clients see my best work, my resume and a booking link on one clean page.",
    rating: 5,
  },
  {
    name: "Sofia Martins",
    role: "Café owner",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    content:
      "Our café page shows the daily specials and takes pickup orders. Customers love it, and I edit it from my phone.",
    rating: 5,
  },
  {
    name: "Mai Pham",
    role: "Illustrator",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    content:
      "I turned my page into a little 3D studio. Fans click the picture frames to see my gallery. It feels like visiting me.",
    rating: 5,
  },
  {
    name: "James Miller",
    role: "Wedding photographer",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    content:
      "Gallery, packages and an inquiry form, all on one page with a theme that matches my brand. The analytics show what couples look at most.",
    rating: 5,
  },
];

// ---------- Timers ----------
let heroTimer: ReturnType<typeof setInterval> | undefined;
let roomTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  const savedValue = route.query.input;
  if (savedValue && typeof savedValue === "string") {
    inputValue.value = savedValue;
  }

  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  heroTimer = setInterval(() => {
    heroWordIndex.value = (heroWordIndex.value + 1) % heroWords.length;
  }, 2400);

  roomTimer = setInterval(() => {
    if (roomMode.value === "auto") isNight.value = !isNight.value;
  }, 4000);
});

onUnmounted(() => {
  if (heroTimer) clearInterval(heroTimer);
  if (roomTimer) clearInterval(roomTimer);
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

<style scoped>
/* Hero rotating word */
.hero-word-enter-active,
.hero-word-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.hero-word-enter-from {
  opacity: 0;
  transform: translateY(40%);
}
.hero-word-leave-to {
  opacity: 0;
  transform: translateY(-40%);
}

/* ---------- 3D room illustration ---------- */
.room-scene {
  background: linear-gradient(180deg, #dff1ff 0%, #f3f9ff 100%);
  transition: background 1.2s ease;
}
.room-scene.room-night {
  background: linear-gradient(180deg, #0b1533 0%, #1d2550 100%);
}
.room-scene polygon,
.room-scene circle,
.room-scene ellipse,
.room-scene path,
.room-scene line {
  transition:
    fill 1.2s ease,
    opacity 1.2s ease,
    stroke 1.2s ease;
}

.room-floor { fill: #f2dcc0; }
.room-wall-l { fill: #eef2fb; }
.room-wall-r { fill: #f8faff; }
.room-edge { fill: #d9b98f; }
.room-edge-r { fill: #c9a87d; }
.room-rug { fill: #8ecae6; opacity: 0.8; }
.room-window-frame { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1; }
.room-sky { fill: #8fd3ff; }
.room-sun { fill: #ffd166; opacity: 1; }
.room-moon { fill: #f1f5f9; opacity: 0; }
.room-stars { opacity: 0; transition: opacity 1.2s ease; }
.room-mullion { stroke: #ffffff; stroke-width: 2.5; }
.room-art { fill: #fdf6ec; }
.room-string { stroke: #64748b; stroke-width: 1; }
.room-bulbs circle { fill: #e2e8f0; }
.room-leaf { fill: #52b788; }
.room-leaf-2 { fill: #40916c; }
.room-glow { opacity: 0; }
.room-shade { fill: #f4a261; }
.room-sofa-back { fill: #4361ee; }
.room-sofa-top { fill: #4f6ff0; }
.room-sofa-front { fill: #3a56d4; }
.room-sofa-side { fill: #2f47b8; }
.room-tint { fill: #0b1533; opacity: 0; pointer-events: none; }

.room-label rect { fill: #ffffff; opacity: 0.95; }
.room-label text {
  font-size: 9px;
  font-weight: 600;
  fill: #1f2937;
  text-anchor: middle;
  font-family: Poppins, sans-serif;
}

.room-hotspot-ring { fill: #086bf5; opacity: 0.25; }
.room-hotspot-dot { fill: #086bf5; }
.room-hotspot {
  transform-box: fill-box;
  transform-origin: center;
  animation: room-pulse 2.4s ease-in-out infinite;
}
@keyframes room-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.18); }
}

/* Night overrides */
.room-night .room-floor { fill: #4a3f5c; }
.room-night .room-wall-l { fill: #2a3563; }
.room-night .room-wall-r { fill: #323f73; }
.room-night .room-edge { fill: #3a3150; }
.room-night .room-edge-r { fill: #322a46; }
.room-night .room-sky { fill: #0a1230; }
.room-night .room-sun { opacity: 0; }
.room-night .room-moon { opacity: 1; }
.room-night .room-stars { opacity: 1; }
.room-night .room-window-frame { fill: #cbd5e1; }
.room-night .room-mullion { stroke: #cbd5e1; }
.room-night .room-bulbs circle { fill: #ffd27a; filter: drop-shadow(0 0 3px #ffb347); }
.room-night .room-glow { opacity: 1; }
.room-night .room-shade { fill: #ffd27a; }
.room-night .room-tint { opacity: 0.12; }
.room-night .room-hotspot-ring { fill: #00a8ff; opacity: 0.4; }
.room-night .room-hotspot-dot { fill: #00a8ff; }

@media (prefers-reduced-motion: reduce) {
  .room-hotspot { animation: none; }
}
</style>
