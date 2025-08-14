<script setup>
  import { useQuery, useMutation } from '@tanstack/vue-query';
  import axios from '../apiClient';

  const fetchTodos = async () => {
    const response = await axios.get('/todos');
    return response.data;
  };

  const {
    data: todos,
    isLoading,
    isError,
    isFetching,
    error,
    status,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodos(),
    gcTime: 3000,
  });

  const updateTodo = async (todo) => {
    const response = await axios.put(`/todos/${todo.id}`, todo);
    return response.data;
  };

  const todoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      // 成功後使快取失效，觸發重新獲取
      refetch();
    },
  });

  const toggleTodo = (todo) => {
    todoMutation.mutate({
      ...todo,
      completed: !todo.completed,
    });
  };
</script>

<template>
  <div>
    <div class="overflow-hidden mb-8 bg-white rounded-lg shadow-md">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-800">待辦事項列表 (Vue Query)</h3>
        <button
          @click="refetch"
          class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          :disabled="isFetching"
        >
          <span v-if="isFetching">重新整理中...</span>
          <span v-else @click="refetch">重新整理</span>
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
        <div v-else-if="!todos?.length" class="py-8 text-center text-gray-500">沒有待辦事項</div>

        <!-- 數據列表 -->
        <ul v-else class="divide-y divide-gray-200">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="flex items-center py-3"
            :class="{ 'opacity-60': todo.completed }"
          >
            <div class="flex flex-1 items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo)"
                class="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span class="flex-1" :class="{ 'line-through text-gray-500': todo.completed }">
                {{ todo.title }}
              </span>
              <span
                v-if="todoMutation.isPending && todoMutation.variables?.id === todo.id"
                class="px-2 py-1 ml-2 text-xs text-blue-700 bg-blue-100 rounded-full"
              >
                更新中...
              </span>
            </div>
          </li>
        </ul>

        <!-- 查詢狀態展示 -->
        <div class="p-4 mt-4 text-sm bg-blue-50 rounded-md">
          <h4 class="mb-2 font-medium text-blue-700">查詢狀態:</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <span class="w-24 text-blue-600">isLoading:</span>
              <span class="font-mono">{{ isLoading }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-blue-600">isFetching:</span>
              <span class="font-mono">{{ isFetching }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-blue-600">isError:</span>
              <span class="font-mono">{{ isError }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-blue-600">isSuccess:</span>
              <span class="font-mono">{{ isSuccess }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-24 text-blue-600">status:</span>
              <span class="font-mono">{{ status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
