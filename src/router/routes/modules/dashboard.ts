import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const routers: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:dashboard-outlined',
    title: '数据大屏1',
    orderNo: 1,
  },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '数据大屏1',
        hideMenu: true,
        ignoreAuth: true,
      },
    },
  ],
};

export default routers;
