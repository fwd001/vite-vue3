<template>
  <div class="w-full h-full">加载中...</div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, watch } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter, useRoute } from 'vue-router';
  import { isString } from '@/utils/is';

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const path = localStorage.getItem('routePath') || '/';

  async function login(query: { code?: string; state?: string }) {
    if (isString(query.code)) {
      await userStore.login({ code: query.code, state: query.state as string });
    } else {
      router.replace(path);
    }
  }

  watch(
    () => route.query,
    async (query: { code?: string; state?: string }) => {
      login(query);
    },
  );

  onBeforeMount(async () => {
    console.log(route.query);

    login(route.query);
  });
</script>
