/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt, { Emitter } from 'mitt';
import type { App } from 'vue';

// 示例导出
export const mitter: Emitter<any> = mitt();

// vue安装导出
export default {
  install: (app: App) => {
    /**
     * 初始化事件总线
     * 1.使用provide提供
     * 2.挂载到this上
     */
    app.provide('$EventBus', mitter);
    // 添加到全局
    app.config.globalProperties.$EventBus = mitter;
  },
};
