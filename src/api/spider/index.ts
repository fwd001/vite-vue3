import { originHttp } from '@/utils/http/axios';
import { long } from '#/base';

enum Api {
  OptionsByYWLX = '/spider/flxx/options',
  AreaTree = '/spider/area/tree',
}

// 字典列表
export const apiGetOptions = (params: { ywlx: string; pid: number }) => {
  return originHttp.post({
    url: Api.OptionsByYWLX,
    params,
  });
};

// 选择区域
export function apiSpGetAreaTree(params: { ids: long[] }) {
  return originHttp.post({
    url: Api.AreaTree,
    params,
  });
}

// 组织结构
export const apiSpBmxxFindBmRyInf = (bmId: number) => {
  return originHttp.get({
    url: `/spider/bmxx/findBmRyInf/${bmId}`,
  });
};

//管辖pcs
export const apiSpBmxxFindControls = () => {
  return originHttp.get({
    url: '/spider/bmxx/findBmxxTree',
  });
};
