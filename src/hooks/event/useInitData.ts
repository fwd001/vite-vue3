import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

// 选项字典

export function useInitData() {
  console.log('globSetting::', globSetting);
}
