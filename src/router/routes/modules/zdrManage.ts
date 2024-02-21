import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const zdrManage: AppRouteModule = {
  path: '/zdr',
  name: 'Zdr',
  component: LAYOUT,
  redirect: '/zdr/manage',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:aboutdotme',
    title: '重点人',
    orderNo: 2,
  },
  children: [
    {
      path: 'manage',
      name: 'ZDRManage',
      component: () => import('@/views/zdr/manage/index.vue'),
      meta: {
        title: '重点人管理',
        icon: 'simple-icons:aboutdotme',
        hideMenu: true,
        powerKey: 'zdrManage',
        // ignoreAuth: true,
      },
    },
  ],
};

export default zdrManage;
