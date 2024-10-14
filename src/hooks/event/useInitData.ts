import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

// 选项字典

export function useInitData() {
  function get() {
    console.log('useInitData::', globSetting);
  }
  return { get };
}
