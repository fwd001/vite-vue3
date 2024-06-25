import { defHttp } from '@/utils/http/axios';
import { ListModel } from '@/api/dashboard/model/dashboardModel';
import axios from 'axios';

enum Api {
  LIST = '/echo/hello',
}

export const apiTest = (params: { name: string }) => {
  return defHttp.get<ListModel[]>({
    url: Api.LIST,
    params,
  });
};

export const apiGetLoc = (latlng: string) => {
  return axios.get<any>(`/app/api/location?point=${latlng}`);
};

export function getGeoJson(code: number) {
  return axios.get(`/public/BMgeojson/china/${code}.json`).then((res) => res.data);
}
