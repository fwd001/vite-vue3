import type { AppRouteModule } from '@/router/types';
import { useGlobSetting } from '@/hooks/setting';
import { LAYOUT } from '@/router/constant';

const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue');
const { dictionaryUrl } = useGlobSetting();

const iframe: AppRouteModule = {
  path: '/log',
  name: 'Log',
  component: LAYOUT,
  redirect: '/log/index',
  meta: {
    orderNo: 10,
    icon: 'pajamas:log',
    title: '系统基本设置',
  },
  children: [
    {
      path: 'index',
      name: 'LogIndex',
      component: IFrame,
      meta: {
        frameSrc: dictionaryUrl,
        title: '数据字典',
        powerKey: 'DataDictionary',
      },
    },
  ],
};

export default iframe;
