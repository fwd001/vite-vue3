import { UserLayout } from '@/layouts/index'
const Login = () => import('@/pages/user/Login.vue')

const routes = [
  {
    path: '/user',
    name: 'UserLayout',
    component: UserLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: '登录' },
      },
    ],
  },
]

export default routes
