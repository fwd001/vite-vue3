import { UserLayout } from '@/layouts/index'
const HomeLogin = () => import('@/views/user/LoginView.vue')

const routes = [
  {
    path: '/user',
    name: 'UserLayout',
    component: UserLayout,
    children: [
      {
        path: '/login',
        name: 'HomeLogin',
        component: HomeLogin,
        meta: { title: '登录' },
      },
    ],
  },
]

export default routes
