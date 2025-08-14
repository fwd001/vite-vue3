<script setup>
  import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
  import axios from '../apiClient';
  import AddTodo from './AddTodo.vue';

  const queryClient = useQueryClient();

  const fetchTodos = async () => {
    const response = await axios.get('/todos');
    return response.data;
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 更新 Todo Mutation
  const {
    mutate: updateTodo,
    isPending: isUpdatingTodo,
    variables: updateVariables,
  } = useMutation({
    mutationFn: (todo) => axios.put(`/todos/${todo.id}`, todo),
    onSuccess: (data) => {
      // 直接更新快取數據，避免重新獲取
      queryClient.setQueryData(['todos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((item) => (item.id === data.data.id ? data.data : item));
      });
    },
  });

  // 刪除 Todo Mutation
  const {
    mutate: deleteTodo,
    isPending: isDeletingTodo,
    variables: deleteVariables,
  } = useMutation({
    mutationFn: (todo) => axios.delete(`/todos/${todo.id}`),
    onSuccess: (_, variables) => {
      // 樂觀更新 - 預先從快取中移除，即使請求失敗也會回滾
      queryClient.setQueryData(['todos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((item) => item.id !== variables.id);
      });
    },
  });

  // 處理切換 Todo 狀態
  const toggleTodoStatus = (todo) => {
    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  // 處理刪除 Todo
  const handleDeleteTodo = (todo) => {
    if (confirm(`確定要刪除 "${todo.title}" 嗎？`)) {
      deleteTodo(todo);
    }
  };
</script>

<template>
  <div>
    <AddTodo />
    <div class="overflow-hidden bg-white rounded-lg shadow-md">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-800">待辦事項列表</h3>
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
        <!-- 加載狀態 -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="w-8 h-8 rounded-full border-b-2 border-blue-500 animate-spin"></div>
        </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="isError" class="p-4 text-red-600 bg-red-50 rounded-md">
          {{ error?.message || '獲取數據失敗' }}
        </div>

        <!-- 空狀態 -->
        <div v-else-if="!data?.length" class="py-8 text-center text-gray-500">沒有待辦事項</div>

        <!-- 數據列表 -->
        <ul v-else class="divide-y divide-gray-200">
          <li
            v-for="todo in data"
            :key="todo.id"
            class="flex justify-between items-center py-3 group"
            :class="{ 'bg-gray-50': todo.completed }"
          >
            <div class="flex flex-1 items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodoStatus(todo)"
                :disabled="isUpdatingTodo && updateVariables?.id === todo.id"
                class="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span class="flex-1" :class="{ 'line-through text-gray-500': todo.completed }">
                {{ todo.title }}
              </span>
              <span
                v-if="isUpdatingTodo && updateVariables?.id === todo.id"
                class="px-2 py-1 ml-2 text-xs text-blue-700 bg-blue-100 rounded-full"
              >
                更新中...
              </span>
            </div>

            <button
              @click="handleDeleteTodo(todo)"
              class="ml-2 text-gray-400 opacity-0 transition-opacity hover:text-red-500 focus:outline-none group-hover:opacity-100"
              :class="{ 'opacity-100': isDeletingTodo && deleteVariables?.id === todo.id }"
              :disabled="isDeletingTodo && deleteVariables?.id === todo.id"
            >
              <svg
                v-if="isDeletingTodo && deleteVariables?.id === todo.id"
                class="w-5 h-5 text-red-500 animate-spin"
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
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
