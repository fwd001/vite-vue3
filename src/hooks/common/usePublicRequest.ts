import { useRequest } from 'vue-request';
import { apiSpGetAreaTree } from '@/api/spider';
// 公共配置请求
export function usePubRequest() {
  const { data: areaTree, run: getAreaTree } = useRequest(
    async (params) => {
      const res = await apiSpGetAreaTree(params);
      return res.data?.list || [];
    },
    {
      manual: true,
      cacheKey: (params) => {
        if (params && params[0].id) {
          return `apiSpGetAreaTree-${params[0].ids?.toString?.()}`;
        }
        return '';
      },
      staleTime: 6 * 60 * 60 * 1000, // 60 minutes
    },
  );
  return { areaTree, getAreaTree };
}
