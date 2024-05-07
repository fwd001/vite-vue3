import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const zdrManage: AppRouteModule = {
  path: '/list',
  name: 'List',
  component: LAYOUT,
  redirect: '/list/manage',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ph:table-duotone',
    title: 'LIST管理',
    orderNo: 2,
  },
  children: [
    {
      path: 'manage',
      name: 'ListManage',
      component: () => import('@/views/list/manage/index.vue'),
      meta: {
        title: 'LIST管理',
        icon: 'simple-icons:aboutdotme',
        hideMenu: true,
        // 权限key
        powerKey: 'listManage',
        // ignoreAuth: true,
      },
    },
  ],
};

export default zdrManage;
