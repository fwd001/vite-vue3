<!--
  职责：仅负责更新提示的 UI 与用户交互。
  触发入口：`index.ts` 在检测到新版本后调用 `window.__showUpdatePrompt(cb)`。
-->
<template>
  <div v-if="visible" class="update-box">
    <div class="p-0 m-0">检测到新版本，点击刷新加载最新内容。</div>
    <button @click="refresh">立即更新</button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const visible = ref(false);
  let onConfirm: (() => void) | null = null;

  // 将触发函数注册到全局，在版本检测（index.ts）中调用以显示此弹窗
  window.__showUpdatePrompt = (cb: () => void) => {
    visible.value = true;
    onConfirm = cb;
  };

  function refresh(): void {
    visible.value = false;
    onConfirm?.();
  }
</script>

<style scoped>
  .update-box {
    display: flex;
    position: fixed;
    bottom: 16px;
    left: 50%;
    align-items: center;
    padding: 12px 20px;
    transform: translateX(-50%);
    border-radius: 8px;
    background: #333;
    box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
    color: white;
    gap: 10px;
  }

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: #3470ff;
    color: white;
    cursor: pointer;
    white-space: nowrap;
  }

  button:hover {
    background: #4d82ff;
  }
</style>
