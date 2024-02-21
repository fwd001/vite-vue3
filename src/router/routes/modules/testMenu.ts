import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const routers: AppRouteModule = {
  path: '/test',
  name: 'Test',
  component: LAYOUT,
  redirect: '/test/index',
  meta: {
    icon: 'ant-design:copyright-circle-outlined',
    title: '测试',
    orderNo: 3,
  },
  children: [
    {
      path: 'index',
      name: 'IconIndex',
      component: () => import('@/views/test/icon.vue'),
      meta: {
        title: 'Icon',
        icon: 'ant-design:check-circle-outlined',
        ignoreAuth: true,
      },
    },
    {
      path: 'index2',
      name: 'TestIndex2',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '测试菜单2',
        icon: 'ant-design:thunderbolt-outlined',
        ignoreAuth: true,
      },
    },
  ],
};

export default routers;
