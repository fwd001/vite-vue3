import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const about: AppRouteModule = {
  path: '/map',
  name: 'Map',
  component: LAYOUT,
  redirect: '/map/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:heat-map-outlined',
    title: '地图',
    orderNo: 10000,
  },
  children: [
    {
      path: 'index',
      name: 'MapPage',
      component: () => import('@/views/map/index.vue'),
      meta: {
        title: '地图',
        icon: 'simple-icons:aboutdotme',
        hideMenu: true,
        ignoreAuth: true,
      },
    },
  ],
};

export default about;
