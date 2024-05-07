import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const routers: AppRouteModule = {
  path: '/test',
  name: 'Test',
  component: LAYOUT,
  redirect: '/test/index',
  meta: {
    icon: 'file-icons:test-js',
    title: '测试',
    orderNo: 3,
  },
  children: [
    {
      path: 'index',
      name: 'IconIndex',
      component: () => import('@/views/test/icon.vue'),
      meta: {
        title: 'Icon测试',
        icon: 'mingcute:test-tube-fill',
        ignoreAuth: true,
      },
    },
    {
      path: 'index2',
      name: 'TestIndex2',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '测试页面',
        icon: 'lucide:test-tubes',
        ignoreAuth: true,
      },
    },
  ],
};

export default routers;
