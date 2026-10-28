<template>
  <!-- While a 3D room loads (the room editor, and sites' 3D views): the
       animated Perlink mark on the room's dark screen -->
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0a0a]" aria-busy="true">
    <AppLoader :size="76" />
  </div>
</template>
