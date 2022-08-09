import { MainLayout } from '@/layouts'
const HomeWelcome = () => import('@/views/backstage-page/welcome.vue')
const KeyWords = () => import('@/views/backstage-page/KeyWords.vue')
const routes = [
  {
    path: '/backstage',
    name: 'layout',
    component: MainLayout,
    children: [
      {
        path: 'welcome',
        name: 'HomeWelcome',
        component: HomeWelcome,
        meta: { title: '欢迎' },
      },
      {
        path: 'keywords',
        name: 'KeyWords',
        component: KeyWords,
        meta: { title: 'KeyWords' },
      },
    ],
  },
]

export default routes
