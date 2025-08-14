<script setup>
  import { ref, computed, watch } from 'vue';
  import { useQuery, keepPreviousData } from '@tanstack/vue-query';
  import axios from '../apiClient';

  // 分頁狀態
  const page = ref(1);
  const pageSize = ref(3);
  const pageSizes = [3, 5, 10];

  // 使用 keepPreviousData 和 placeholderData 優化
  const fetchTodos = async ({ pageParam = page.value, pageSizeParam = pageSize.value }) => {
    const response = await axios.get('/todos', {
      params: {
        _page: pageParam,
        _limit: pageSizeParam,
      },
    });

    const totalCount = parseInt(response.headers['x-total-count'] || '0');
    const totalPages = Math.ceil(totalCount / pageSizeParam);

    return {
      todos: response.data,
      totalCount,
      totalPages,
    };
  };

  const { data, isLoading, isError, error, isFetching, refetch, isPlaceholderData } = useQuery({
    queryKey: ['todos', page, pageSize],
    queryFn: () => fetchTodos({ pageParam: page.value, pageSizeParam: pageSize.value }),
    // placeholderData: keepPreviousData,
  });

  const totalPages = computed(() => data.value?.totalPages || 1);

  const getPageNumbers = () => {
    const total = totalPages.value;
    const current = page.value;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [current - 2, current - 1, current, current + 1, current + 2];
  };

  // 當頁大小變化時，重置為第一頁
  watch(pageSize, () => {
    page.value = 1;
  });
</script>

<template>
  <div>
    <div class="overflow-hidden mb-8 bg-white rounded-lg shadow-md">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-800">待辦事項表格 (帶分頁優化)</h3>
        <button
          @click="refetch"
          class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          :disabled="isFetching"
        >
          <span v-if="isFetching">重新整理中...</span>
          <span v-else>重新整理</span>
        </button>
      </div>
      <div class="p-4">
        <!-- 頁面大小選擇器 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-1">
            <button
              v-for="size in pageSizes"
              :key="size"
              @click="pageSize = size"
              class="px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              :class="
                pageSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
            >
              {{ size }} 條/頁
            </button>
          </div>
        </div>

        <!-- 表格容器 - 相對定位 -->
        <div class="overflow-x-auto relative">
          <!-- 資料狀態遮罩 -->
          <div
            v-if="isPlaceholderData"
            class="flex absolute inset-0 z-10 flex-col justify-center items-center bg-white bg-opacity-70"
          >
            <div class="flex items-center mb-2">
              <svg
                class="mr-3 w-8 h-8 text-blue-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div class="text-xl font-semibold text-blue-700">載入中...</div>
            </div>
            <div class="text-blue-600">
              <span v-if="isPlaceholderData">顯示 placeholder 資料</span>
            </div>
          </div>

          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  標題
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  狀態
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-if="isLoading && !data">
                <tr v-for="i in pageSize" :key="i">
                  <td colspan="3" class="px-6 py-4">
                    <div class="flex space-x-4 animate-pulse">
                      <div class="w-full h-4 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- 數據行 -->
              <template v-else-if="data">
                <tr v-for="todo in data.todos" :key="todo.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ todo.id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{
                    todo.title
                  }}</td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
                      :class="
                        todo.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      "
                    >
                      {{ todo.completed ? '已完成' : '未完成' }}
                    </span>
                  </td>
                </tr>
              </template>

              <!-- 錯誤狀態 -->
              <tr v-if="isError">
                <td colspan="3" class="px-6 py-4 text-center text-red-500">
                  加載失敗: {{ error?.message || '未知錯誤' }}
                </td>
              </tr>

              <!-- 空狀態 -->
              <tr v-if="data?.todos.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">沒有數據</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 更新提示 -->
        <div
          v-if="isFetching && data && !isPlaceholderData"
          class="flex justify-center items-center mt-4 text-sm text-blue-500"
        >
          <svg
            class="mr-2 -ml-1 w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>更新中...</span>
        </div>

        <!-- 分頁控件 -->
        <div class="flex justify-end mt-4">
          <nav
            class="inline-flex relative z-0 -space-x-px text-sm rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              @click="page = Math.max(1, page - 1)"
              :disabled="page === 1"
              class="inline-flex relative items-center px-2 py-2 text-gray-500 bg-white rounded-l-md border border-gray-300 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
            >
              <span class="sr-only">上一頁</span>
              &laquo;
            </button>

            <button
              v-for="p in getPageNumbers()"
              :key="p"
              @click="page = p"
              class="inline-flex relative items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50"
              :class="{ 'bg-blue-50 text-blue-600 z-10 border-blue-500': p === page }"
            >
              {{ p }}
            </button>

            <button
              @click="page = Math.min(totalPages, page + 1)"
              :disabled="page === totalPages"
              class="inline-flex relative items-center px-2 py-2 text-gray-500 bg-white rounded-r-md border border-gray-300 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
            >
              <span class="sr-only">下一頁</span>
              &raquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 讓表格容器有最小高度，確保遮罩效果顯示良好 */
  .overflow-x-auto {
    min-height: 200px;
  }
</style>
