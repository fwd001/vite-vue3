import type { App } from 'vue'
import { setupEllipsisDirective } from '@/directives/ellipsis'

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 权限控制指令（演示）
  setupEllipsisDirective(app)
}
