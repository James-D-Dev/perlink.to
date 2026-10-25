<template>
  <!-- Behind the hero: slow-drifting colour fields from the orb palettes, a
       fading dot grid and a little grain. CSS only, nothing to click. -->
  <div class="mk-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <span class="mk-field mk-field--sunset" />
    <span class="mk-field mk-field--sakura" />
    <span class="mk-field mk-field--lagoon" />
    <span class="mk-field mk-field--mint" />
    <span class="mk-dots" />
    <span class="mk-grain" />
  </div>
</template>

<style scoped>
.mk-backdrop {
  /* Melt into the page at the bottom so the showcase below sits on paper */
  mask-image: linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%);
}

.mk-field {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.5;
  will-change: transform;
}
.mk-field--sunset {
  width: clamp(320px, 46vw, 620px); height: clamp(320px, 46vw, 620px);
  right: -8%; top: -18%;
  background: radial-gradient(circle at 35% 35%, #ffd9a8, #ff9a5a 45%, transparent 70%);
  animation: mk-drift-a 22s ease-in-out infinite;
}
.mk-field--sakura {
  width: clamp(280px, 38vw, 520px); height: clamp(280px, 38vw, 520px);
  right: 22%; top: 10%;
  background: radial-gradient(circle at 40% 40%, #ffc4dc, #d98cd6 50%, transparent 72%);
  animation: mk-drift-b 26s ease-in-out infinite;
  opacity: 0.42;
}
.mk-field--lagoon {
  width: clamp(260px, 34vw, 460px); height: clamp(260px, 34vw, 460px);
  left: -10%; top: 25%;
  background: radial-gradient(circle at 45% 45%, #9fdcf0, #4ba3d9 50%, transparent 72%);
  animation: mk-drift-c 30s ease-in-out infinite;
  opacity: 0.32;
}
.mk-field--mint {
  width: clamp(220px, 28vw, 380px); height: clamp(220px, 28vw, 380px);
  left: 30%; top: -12%;
  background: radial-gradient(circle at 50% 50%, #bfeccc, #7cc59a 50%, transparent 72%);
  animation: mk-drift-b 34s ease-in-out infinite reverse;
  opacity: 0.3;
}

/* A dot grid that fades out away from the middle and slides very slowly */
.mk-dots {
  position: absolute;
  inset: -40px;
  background-image: radial-gradient(rgb(12 11 10 / 0.13) 1px, transparent 1.2px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 70% 60% at 55% 40%, #000 20%, transparent 75%);
  animation: mk-dots 60s linear infinite;
}

.mk-grain {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes mk-drift-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-6%, 8%) scale(1.08); }
  66% { transform: translate(4%, 4%) scale(0.94); }
}
@keyframes mk-drift-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10%, -6%) scale(1.12); }
}
@keyframes mk-drift-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(12%, -10%) scale(1.1); }
  75% { transform: translate(4%, 6%) scale(0.95); }
}
@keyframes mk-dots {
  from { transform: translate(0, 0); }
  to { transform: translate(22px, 22px); }
}

@media (prefers-reduced-motion: reduce) {
  .mk-field,
  .mk-dots { animation: none; }
}
</style>
