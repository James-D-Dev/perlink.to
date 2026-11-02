<template>
  <span class="inline-flex items-center" :style="{ height: `${size}px` }">
    <!-- Wordmark: "perlink", drawn from Geist SemiBold as paths (no font to
         load); "per" (perfect) and the dot of the i, a perfect circle, in the
         tint colour -->
    <svg
      v-if="variant === 'full'"
      :height="size * 0.82"
      :width="size * 0.82 * 3.1460"
      viewBox="0 -855 3146 1000"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Perlink"
    >
      <path :class="inverted ? 'fill-tint' : 'fill-[#0066d6]'" d="M70 150L70 -534L193 -534L196 -420L183 -426Q203 -485 248.5 -515.5Q294 -546 355 -546Q431 -546 481.5 -508Q532 -470 557 -407Q582 -344 582 -267Q582 -190 556.5 -127Q531 -64 480.5 -26Q430 12 354 12Q314 12 279.5 -2Q245 -16 220.5 -42Q196 -68 186 -103L198 -113L198 150ZM324 -92Q382 -92 415.5 -138.5Q449 -185 449 -267Q449 -349 415.5 -395.5Q382 -442 324 -442Q285 -442 257 -422.5Q229 -403 213.5 -364Q198 -325 198 -267Q198 -209 213 -170Q228 -131 256.5 -111.5Q285 -92 324 -92ZM877 12Q797 12 738 -22.5Q679 -57 647 -120Q615 -183 615 -267Q615 -351 647 -413.5Q679 -476 737.5 -511Q796 -546 874 -546Q950 -546 1007.5 -512Q1065 -478 1096 -414Q1127 -350 1127 -260L1127 -231L748 -231Q752 -161 786.5 -125.5Q821 -90 878 -90Q921 -90 949.5 -109.5Q978 -129 989 -164L1120 -156Q1098 -78 1033.5 -33Q969 12 877 12ZM748 -317L995 -317Q991 -382 958 -413.5Q925 -445 874 -445Q823 -445 789.5 -412Q756 -379 748 -317ZM1192 0L1192 -534L1312 -534L1317 -386L1306 -388Q1318 -465 1351.5 -499.5Q1385 -534 1443 -534L1492 -534L1492 -424L1442 -424Q1401 -424 1374 -412Q1347 -400 1333.5 -374.5Q1320 -349 1320 -308L1320 0Z" />
      <path :fill="ink" d="M1684 0Q1626 0 1591 -30Q1556 -60 1556 -126L1556 -710L1684 -710L1684 -139Q1684 -119 1694.5 -109Q1705 -99 1724 -99L1763 -99L1763 0ZM1808 0L1808 -534L1936 -534L1936 0ZM2032 0L2032 -534L2148 -534L2153 -384L2138 -390Q2146 -446 2171 -480Q2196 -514 2232 -530Q2268 -546 2311 -546Q2370 -546 2410.5 -520Q2451 -494 2472 -448.5Q2493 -403 2493 -343L2493 0L2365 0L2365 -302Q2365 -347 2356 -378Q2347 -409 2326.5 -425.5Q2306 -442 2272 -442Q2221 -442 2190.5 -406Q2160 -370 2160 -302L2160 0ZM2588 0L2588 -710L2716 -710L2716 -293L2935 -534L3093 -534L2884 -312L3100 0L2956 0L2800 -236L2716 -147L2716 0Z" />
      <circle class="fill-tint" cx="1872.5" cy="-662" r="75" />
    </svg>

    <!-- Mark (favicons, folded sidebar): an open isometric room, the 3D
         world every site gets, with a pearl on its floor ("pearl link", per =
         perfect) on a glossy tint tile. Same drawing as public/favicon.svg -->
    <svg v-else :width="size" :height="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Perlink">
      <defs>
        <linearGradient :id="`${uid}-tile`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" :stop-color="inverted ? '#3a9bff' : '#2f8fff'" />
          <stop offset="1" :stop-color="inverted ? '#0066e0' : '#005fd6'" />
        </linearGradient>
        <radialGradient :id="`${uid}-pearl`" cx=".36" cy=".3" r=".75">
          <stop offset="0" stop-color="#fff" />
          <stop offset=".45" stop-color="#eef3ff" />
          <stop offset=".8" stop-color="#cfd9f3" />
          <stop offset="1" stop-color="#a9b8de" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14.5" :fill="`url(#${uid}-tile)`" />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="13.8" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" />
      <path d="M14.5 0h35A14.5 14.5 0 0 1 64 14.5V24C44 34 20 34 0 24v-9.5A14.5 14.5 0 0 1 14.5 0z" fill="#fff" opacity=".12" />
      <!-- The room seen from above: two back walls on a floor, a window -->
      <path d="M12 25 32 15v22L12 47z" fill="#d9e6ff" />
      <path d="M52 25 32 15v22L52 47z" fill="#bcd3ff" />
      <path d="M12 47 32 37l20 10-20 10z" fill="#fff" />
      <path d="M17 29.5 26 25v8l-9 4.5z" fill="#5aa6ff" />
      <path d="M17 29.5 26 25v1.8l-9 4.5z" fill="#fff" opacity=".5" />
      <!-- The pearl, resting on the floor -->
      <ellipse cx="32" cy="50.6" rx="6.3" ry="2.3" fill="#003a8c" opacity=".35" />
      <circle cx="32" cy="45.5" r="6" :fill="`url(#${uid}-pearl)`" />
      <ellipse cx="29.9" cy="43" rx="1.9" ry="1.2" fill="#fff" opacity=".9" transform="rotate(-30 29.9 43)" />
    </svg>
  </span>
</template>

<script setup lang="ts">
// Perlink logo: the wordmark (ink on light surfaces, paper on dark ones), or
// the mark alone (a glossy tint tile, a touch brighter on dark surfaces).
const props = withDefaults(defineProps<{
  variant?: 'full' | 'mark'
  size?: number
  inverted?: boolean
}>(), {
  variant: 'full',
  size: 28,
})

const ink = computed(() => (props.inverted ? '#fdfcfb' : '#0c0b0a'))
// Gradient ids must be unique on the page
const uid = `pl-${useId()}`

</script>
