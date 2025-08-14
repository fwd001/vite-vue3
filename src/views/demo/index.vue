<script setup>
  import { ref } from 'vue';
  import TraditionalFetch from './components/TraditionalFetch.vue';
  import UseQueryDemo from './components/UseQueryDemo.vue';
  import TablePaginationDemo from './components/TablePaginationDemo.vue';
  import MutationDemo from './components/MutationDemo.vue';

  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

  // 選單配置
  const menu = [
    {
      title: '傳統數據獲取',
      description: '不使用 Vue Query 的傳統獲取方式，需要手動管理狀態、錯誤處理和 Server State',
    },
    {
      title: 'useQuery 基礎',
      description: '使用 Vue Query 的 useQuery 來管理 Server State',
    },
    {
      title: '表格與分頁優化',
      description: '使用 placeholderData 和 keepPreviousData 來優化表格分頁體驗',
    },
    {
      title: 'useMutation 與快取更新',
      description: '使用 useMutation 發送請求，並在成功後通過 queryClient 更新快取',
    },
  ];

  const activeDemo = ref(0);
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 左側選單 -->
    <div class="w-64 bg-white shadow-md">
      <div class="p-4 border-b">
        <h1 class="text-xl font-semibold text-gray-800">Vue Query Playground</h1>
      </div>
      <nav class="mt-4">
        <a
          v-for="(item, index) in menu"
          :key="index"
          class="block px-4 py-2 text-gray-700 transition-colors cursor-pointer hover:bg-blue-50 hover:text-blue-700"
          :class="{
            'bg-blue-50 text-blue-700 font-medium border-r-4 border-blue-500': activeDemo === index,
          }"
          @click="activeDemo = index"
        >
          {{ item.title }}
        </a>
      </nav>
    </div>

    <!-- 右側內容 -->
    <div class="overflow-auto flex-1 p-6">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-2 text-2xl font-bold text-gray-800">{{ menu[activeDemo].title }}</h2>
        <p class="mb-6 text-gray-600">{{ menu[activeDemo].description }}</p>

        <!-- 不同元件的條件渲染 -->
        <TraditionalFetch v-if="activeDemo === 0" />
        <UseQueryDemo v-if="activeDemo === 1" />
        <TablePaginationDemo v-if="activeDemo === 2" />
        <MutationDemo v-if="activeDemo === 3" />
      </div>
    </div>
  </div>
  <VueQueryDevtools />
</template>
