import LayoutMain from '@/components/layout/layout-main.vue'
const HomeWelcome = () => import('@/views/backstage-page/welcome.vue')
const YJPage = () => import('@/views/backstage-page/key-words.vue')
const routes = [
  {
    path: '/backstage',
    name: 'layout',
    component: LayoutMain,
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
        component: YJPage,
        meta: { title: 'KeyWords' },
      },
    ],
  },
]

export default routes
