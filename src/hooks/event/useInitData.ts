import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

// 选项字典

export function useInitData() {
  function get() {
    console.log('globSetting::', globSetting);
  }
  return { get };
}
