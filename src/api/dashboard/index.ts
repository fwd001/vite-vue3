import { defHttp } from '@/utils/http/axios';
import { ListModel } from '@/api/dashboard/model/dashboardModel';

enum Api {
  LIST = '/echo/hello',
}

export const apiTest = (params: { name: string }) => {
  return defHttp.get<ListModel[]>({
    url: Api.LIST,
    params,
  });
};
