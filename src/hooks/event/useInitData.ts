import { apiGetOptions } from '@/api/spider/index';
import { useRequest } from 'vue-request';
import { useDictionaryStore, OptionI, ListType } from '@/store/modules/dictionary';
import { useXsDictionaryStore, xsListType } from '@/store/modules/xsdictionary';
import { useQbDictionaryStore, qbListType } from '@/store/modules/qbdictionary';
import { resultI } from './model/initModel';
import { useOrgTreeOptionStore } from '@/store/modules/orgTree';

import { useGlobSetting } from '@/hooks/setting';

const { zdrYWLX, qbYWLX, xsYWLX } = useGlobSetting();

// 选项字典
function loopChildren(arr: resultI[]): OptionI[] {
  return arr.map((child: resultI) => {
    return {
      label: child.mc,
      value: child.id,
      bh: child.bh,
      content: child.value,
      children: child.list ? loopChildren(child.list) : [],
    };
  }) as OptionI[];
}

export function useInitData() {
  const orgTreeStore = useOrgTreeOptionStore();

  // 调用字典方法
  const intelligenceDictionaryStore = useDictionaryStore();
  const qbDictionaryStore = useQbDictionaryStore();
  const xsDictionaryStore = useXsDictionaryStore();
  // 部门用户树
  orgTreeStore.requestOrgOption();
  // 选项字典
  useRequest(
    async (params: { ywlx: string; pid: number }) => {
      const res = await apiGetOptions(params);
      const data = res.data?.list || [];
      return data.map((item: resultI) => {
        const list = item.list ? loopChildren(item.list) : [];
        return {
          id: item.id,
          bh: item.bh,
          value: item.value,
          list: list,
        };
      });
    },
    {
      defaultParams: [{ ywlx: zdrYWLX, pid: 0 }],
      onSuccess: (res) => {
        res.forEach((item: { bh: ListType['type']; list: OptionI[] }) => {
          intelligenceDictionaryStore.setList(item.bh, item.list);
        });
      },
    },
  );

  // QB字典
  useRequest(
    async (params: { ywlx: string; pid: number }) => {
      const res = await apiGetOptions(params);
      const data = res.data?.list || [];
      return data.map((item: resultI) => {
        const list = item.list ? loopChildren(item.list) : [];
        return {
          id: item.id,
          bh: item.bh,
          value: item.value,
          list: list,
        };
      });
    },
    {
      defaultParams: [{ ywlx: qbYWLX, pid: 0 }],
      onSuccess: (res) => {
        res.forEach((item: { bh: qbListType['type']; list: OptionI[] }) => {
          qbDictionaryStore.setList(item.bh, item.list);
        });
      },
    },
  );

  // XS字典
  useRequest(
    async (params: { ywlx: string; pid: number }) => {
      const res = await apiGetOptions(params);
      const data = res.data?.list || [];
      return data.map((item: resultI) => {
        const list = item.list ? loopChildren(item.list) : [];
        return {
          id: item.id,
          bh: item.bh,
          value: item.value,
          list: list,
        };
      });
    },
    {
      defaultParams: [{ ywlx: xsYWLX, pid: 0 }],
      onSuccess: (res) => {
        res.forEach((item: { bh: xsListType['type']; list: OptionI[] }) => {
          xsDictionaryStore.setList(item.bh, item.list);
        });
      },
    },
  );
}
