/*
 * @Author: wedong.fu
 * @Date: 2022-07-18 13:07:13
 * @LastEditors: wedong.fu
 * @LastEditTime: 2022-07-18 13:13:05
 * @Description:
 */
import 'nprogress/css/nprogress.css' // 进度条样式
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './router-guards'
import routes from './routes'

// 此处由【new VueRouter】的方式修改为【createRouter】的方式 其余无变化
const router = createRouter({
  history: createWebHistory(), //路由模式的配置采用API调用的方式 不再是之前的字符串 此处采用的hash路由
  routes: [
    {
      path: '/',
      redirect: '/backstage/welcome',
    },
    ...routes,
    {
      path: '/404',
      name: 'NotFound',
      meta: {
        title: 'Page not found',
      },
      component: () => import('@/views/NotFound.vue'),
    },
    // 所有未定义路由，全部重定向到404页
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
    },
  ],
})

export async function setupRouter(app: App) {
  // 权限守卫
  createRouterGuards(router)

  app.use(router)

  // 路由准备就绪后挂载APP实例
  await router.isReady()
}

export default router
