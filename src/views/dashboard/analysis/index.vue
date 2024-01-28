<template>
  <div class="p-4">
    <div class="mb-12px"> </div>
    <div class="card">
      <p v-ellipsis class="w-100">TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>

      <p>请求测试：</p>
      <p>{{ data }}</p>
      <p>{{ loading }}</p>
      <p>富文本</p>

      <Tinymce v-model="value" @change="handleChange" width="100%" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRequest } from 'vue-request';
  import { apiList } from '@/api/dashboard/analysis';
  import { Tinymce } from '@/components/Tinymce/index';

  defineOptions({
    name: 'Analysis',
  });

  const value = ref('hello world!');
  function handleChange(value: string) {
    console.log(value);
  }
  const { data, loading } = useRequest(apiList, {
    defaultParams: [{ query: 'string' }],
    onSuccess(res) {
      console.log('res', res);
    },
  });
</script>
