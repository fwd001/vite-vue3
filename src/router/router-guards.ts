import NProgress from 'nprogress' // progress bar
import type { Router } from 'vue-router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const defaultRoutePath = '/dashboard/welcome'

export function createRouterGuards(router: Router) {
  router.beforeEach(async (to, _, next) => {
    NProgress.start() // start progress bar
    // eslint-disable-next-line no-console
    console.log('to', to)
    if (to.fullPath === '/keywords') {
      next({ path: '/user/login' })
    } else {
      next()
    }
  })

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  router.afterEach((to, from, failure) => {
    NProgress.done() // finish progress bar
  })

  router.onError((error) => {
    // eslint-disable-next-line no-console
    console.log(error, '路由错误')
  })
}
