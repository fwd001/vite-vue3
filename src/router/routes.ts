/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteRecordRaw } from 'vue-router'
// 路由配置 和以前一样
let routes: RouteRecordRaw[] = []

const modulesFiles = import.meta.glob('./routes/*.ts', { eager: true }) // vite

for (const key in modulesFiles) {
  if (Object.prototype.hasOwnProperty.call(modulesFiles, key)) {
    const element: any = modulesFiles[key]
    routes = routes.concat(element.default)
  }
}

export default routes
