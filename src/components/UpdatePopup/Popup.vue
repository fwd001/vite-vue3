<!--
  更新提示弹窗组件
  
  组件职责：
  - 仅负责更新提示的 UI 展示与用户交互
  - 提供友好的更新提示界面
  
  触发机制：
  - `index.ts` 在检测到新版本后调用 `window.__showUpdatePrompt(cb)` 显示此弹窗
  - 用户点击"立即更新"按钮后执行回调函数（通常是刷新页面）
  
  设计说明：
  - 使用固定定位，显示在页面底部中央
  - 采用深色主题，确保在各种背景下都有良好的可见性
-->
<template>
  <!-- 更新提示弹窗容器 -->
  <div v-if="visible" class="update-box">
    <!-- 提示文本 -->
    <div class="p-0 m-0">检测到新版本，点击刷新加载最新内容。</div>
    <!-- 更新按钮 -->
    <button @click="refresh">立即更新</button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  /**
   * 弹窗显示状态
   * true: 显示弹窗
   * false: 隐藏弹窗
   */
  const visible = ref(false);

  /**
   * 用户确认更新后的回调函数
   * 由版本检测模块传入，通常用于刷新页面
   */
  let onConfirm: (() => void) | null = null;

  /**
   * 将触发函数注册到全局 Window 对象
   *
   * 此函数由版本检测模块（index.ts）调用，用于显示更新提示弹窗
   *
   * @param cb - 用户确认更新后执行的回调函数（通常是刷新页面）
   *
   * @example
   * ```ts
   * window.__showUpdatePrompt(() => {
   *   window.location.reload();
   * });
   * ```
   */
  window.__showUpdatePrompt = (cb: () => void) => {
    visible.value = true;
    onConfirm = cb;
  };

  /**
   * 处理用户点击"立即更新"按钮
   *
   * 执行流程：
   * 1. 隐藏弹窗
   * 2. 执行传入的回调函数（通常是刷新页面以加载新版本）
   */
  function refresh(): void {
    visible.value = false;
    onConfirm?.();
  }
</script>

<style scoped>
  /**
   * 更新提示弹窗容器样式
   * 
   * 设计特点：
   * - 固定定位在页面底部中央
   * - 深色背景，确保可见性
   * - 圆角设计，提升视觉体验
   * - 阴影效果，增强层次感
   */
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

  /**
   * 更新按钮样式
   * 
   * 设计特点：
   * - 蓝色主题，与提示文本形成对比
   * - 悬停时颜色加深，提供交互反馈
   * - 防止文字换行，保持按钮紧凑
   */
  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: #3470ff;
    color: white;
    white-space: nowrap;
    cursor: pointer;
  }

  /**
   * 按钮悬停效果
   * 颜色加深，提供视觉反馈
   */
  button:hover {
    background: #4d82ff;
  }
</style>
