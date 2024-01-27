import { defHttp } from '@/utils/http/axios';
import { ListModel } from '@/api/dashboard/model/analysisModel';

enum Api {
  LIST = '/es/qwjs/queryInfo',
}

export const apiList = (data: { query: string }) => {
  return defHttp.post<ListModel[]>({
    url: Api.LIST,
    data,
  });
};
