<script setup>
  import { ref, onMounted } from 'vue';
  import axios from '../apiClient';

  // 狀態定義
  const todos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 獲取數據
  const fetchTodos = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get('/todos');
      todos.value = response.data;
    } catch (err) {
      error.value = `獲取數據失敗: ${err.message}`;
    } finally {
      loading.value = false;
    }
  };

  // 更新狀態
  const toggleTodo = async (todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(`/todos/${todo.id}`, updatedTodo);

      // 更新本地數據
      const index = todos.value.findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
    } catch (err) {
      alert(`更新失敗: ${err.message}`);
    }
  };

  // 元件掛載時加載數據
  onMounted(fetchTodos);
</script>

<template>
  <div>
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-800">待辦事項列表</h3>
        <button
          @click="fetchTodos"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          重新整理
        </button>
      </div>
      <div class="p-4">
        <!-- 加載狀態 -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-md">
          {{ error }}
        </div>

        <!-- 空狀態 -->
        <div v-else-if="todos.length === 0" class="text-center py-8 text-gray-500"
          >沒有待辦事項</div
        >

        <!-- 數據列表 -->
        <ul v-else class="divide-y divide-gray-200">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="py-3 flex items-center"
            :class="{ 'opacity-60': todo.completed }"
          >
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo)"
              class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
            />
            <span class="flex-1" :class="{ 'line-through text-gray-500': todo.completed }">
              {{ todo.title }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
