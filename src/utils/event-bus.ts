import mitt, { Emitter } from 'mitt'
import type { App } from 'vue'
import { MEventEnum } from '@/enum/mitter'

// 总线导出
export const mitter: Emitter<Record<MEventEnum, unknown>> = mitt()

export function setupMitt(app: App<Element>) {
  /**
   * 初始化事件总线
   * 1.使用provide提供
   * 2.挂载到this上
   */
  app.provide('$EventBus', mitter)
  // 添加到全局
  app.config.globalProperties.$EventBus = mitter
}
