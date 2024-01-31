<template>
  <div class="h-100% relative">
    <Map2D v-if="value" />
    <Map3D v-else />
    <!-- 工具按钮 -->
    <div class="absolute top-12px right-12px c-#333 z-999">
      <button @click="toggle()"> {{ value ? '3D模式' : '2D模式' }} </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Map2D from './components/map-2d.vue';
  import Map3D from './components/map-3d.vue';
  import { useToggle } from '@vueuse/core';

  const [value, toggle] = useToggle(true);
</script>

<style>
  .bigemap-logo,
  .bmgl-credit-textContainer {
    display: none !important;
  }
</style>
