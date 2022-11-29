import { MainLayout } from '@/layouts'
const HomeWelcome = () => import('@/views/backstage-page/Index.vue')
const KeyWords = () => import('@/views/backstage-page/KeyWords.vue')
const FwdDemo = () => import('@/views/backstage-page/FwdDemo.vue')
const routes = [
  {
    path: '/',
    name: 'layout',
    component: MainLayout,
    children: [
      {
        path: '/index',
        name: 'HomeWelcome',
        component: HomeWelcome,
        meta: { title: '欢迎' },
      },
      {
        path: 'keywords',
        name: 'KeyWords',
        component: KeyWords,
        meta: { title: '关键词' },
      },
      {
        path: '/groupon/fwd-demo',
        name: 'FwdDemo',
        component: FwdDemo,
        meta: { title: 'FwdDemo' },
      },
    ],
  },
]

export default routes
