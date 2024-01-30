<template>
  <div class="w-full h-full">
    <Suspense>
      <AsyncAuth />
      <template #fallback>
        <p>加载中...</p>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue';

  const AsyncAuth = defineAsyncComponent(() => import('./AsyncAuth.vue'));
</script>
