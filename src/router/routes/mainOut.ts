/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '@/router/types';

// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('@/views/dashboard/index.vue'),
  //   meta: {
  //     title: '数据大屏',
  //     ignoreAuth: true,
  //   },
  // },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
