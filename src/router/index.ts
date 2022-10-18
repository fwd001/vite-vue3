import type { App } from 'vue'
/*
 * @Author: wedong.fu
 * @Date: 2022-07-18 13:07:13
 * @LastEditors: wedong.fu
 * @LastEditTime: 2022-07-18 13:13:05
 * @Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import type { RouteLocationNormalized } from 'vue-router'

// 此处由【new VueRouter】的方式修改为【createRouter】的方式 其余无变化
const router = createRouter({
  history: createWebHashHistory(), //路由模式的配置采用API调用的方式 不再是之前的字符串 此处采用的hash路由
  routes: [
    {
      path: '/',
      redirect: '/backstage/welcome',
    },
    ...routes,
  ],
})

// 检查权限
const checkRoutePower = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // eslint-disable-next-line no-console
  console.log('to', to)
  // eslint-disable-next-line no-console
  console.log('from', from)
  if (to.fullPath === '/keywords') return { path: '/user/login' }
  return true
}

export async function setupRouter(app: App) {
  // 权限守卫
  router.beforeEach(checkRoutePower)

  app.use(router)

  // 路由准备就绪后挂载APP实例
  await router.isReady()
}

export default router
