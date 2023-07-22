import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // 进度条样式
import type { Router } from 'vue-router'
import { useTitle } from '@vueuse/core'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// const defaultRoutePath = '/index'

export function createRouterGuards(router: Router) {
  // to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext
  router.beforeEach(async (to, _, next) => {
    NProgress.start() // start progress bar
    // eslint-disable-next-line no-console
    console.log('to', to)
    if (to.fullPath === '/user/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  })

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  router.afterEach((to: any, _from, _failure) => {
    useTitle(to.meta.title)
    NProgress.done() // finish progress bar
  })

  router.onError((error) => {
    // eslint-disable-next-line no-console
    console.log(error, '路由错误')
  })
}
