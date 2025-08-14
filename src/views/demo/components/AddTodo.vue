<script setup>
  import { ref } from 'vue';
  import apiClient from '../apiClient';
  import { useMutation, useQueryClient } from '@tanstack/vue-query';

  const newTodo = ref({
    title: '',
    completed: false,
  });

  const queryClient = useQueryClient();

  const {
    mutate: addTodo,
    isPending: isAddingTodo,
    isSuccess: isAddSuccess,
    reset: resetAddMutation,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: (newTodo) => apiClient.post('/todos', newTodo),
    onSuccess: () => {
      // 方法1: 使快取失效並觸發重新獲取
      queryClient.invalidateQueries({ queryKey: ['todos'] });

      // 重置表單
      newTodo.value = {
        title: '',
        completed: false,
      };
    },
  });

  // 處理添加 Todo
  const handleAddTodo = () => {
    if (!newTodo.value.title.trim()) return;

    addTodo({
      ...newTodo.value,
      title: newTodo.value.title.trim(),
    });
  };
</script>

<template>
  <div class="overflow-hidden mb-8 bg-white rounded-lg shadow-md">
    <div class="p-4 border-b">
      <h3 class="text-lg font-medium text-gray-800">新增待辦事項</h3>
    </div>
    <div class="p-4">
      <form @submit.prevent="handleAddTodo">
        <div class="mb-4">
          <label for="todoTitle" class="block mb-1 text-sm font-medium text-gray-700">標題</label>
          <input
            type="text"
            id="todoTitle"
            v-model="newTodo.title"
            class="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="todoCompleted"
              v-model="newTodo.completed"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label for="todoCompleted" class="block ml-2 text-sm text-gray-700">已完成</label>
          </div>
        </div>
        <button
          type="submit"
          class="px-4 py-2 w-full font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          :class="{ 'opacity-50 cursor-not-allowed': isAddingTodo }"
          :disabled="isAddingTodo"
        >
          <span v-if="isAddingTodo">新增中...</span>
          <span v-else>新增待辦事項</span>
        </button>
      </form>

      <div v-if="isAddError" class="p-3 mt-4 text-red-600 bg-red-50 rounded-md">
        新增失敗: {{ addError?.message || '未知錯誤' }}
      </div>
      <div
        v-if="isAddSuccess"
        class="flex items-center p-3 mt-4 text-green-600 bg-green-50 rounded-md"
      >
        <svg
          class="mr-2 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>新增成功!</span>
        <button @click="resetAddMutation" class="ml-auto text-xs underline">關閉提示</button>
      </div>
    </div>
  </div>
</template>
