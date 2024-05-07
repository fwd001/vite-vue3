import { useRequest } from 'vue-request';
import { apiSpBmxxFindBmRyInf, apiSpBmxxFindControls } from '@/api/spider';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import { cloneDeep } from 'lodash-es';

export interface DepartPerson {
  id: number;
  name: string;
  orgId?: number;
  bmDataList?: DepartPerson[];
  yhxxList?: DepartPerson[];
  child: DepartPerson[];
}
interface Field {
  id: number;
  xzqh?: string;
  depart_level?: string;
  police_type?: string;
  xzqh_code?: string;
}

interface Child {
  id: number;
  name: string;
  field: Field;
  child: Child[];
}

export interface Group {
  id: number;
  name: string;
  field: Field;
  child: Child[];
}

// Bm部门list
export function useBmDataRequest() {
  const fieldNames = {
    label: 'name',
    value: 'id',
    children: 'child',
  };

  const filter: ShowSearchType['filter'] = (inputValue, path) => {
    return path.some((option) => option.name.indexOf(inputValue) > -1);
  };
  function forEachPerson(res: any) {
    // 组织人员数据
    const orgOption = cloneDeep(res.bmDataList || []);
    mergeInfo(orgOption);
    return { orgOption, onlyOrgOption: res.bmDataList || [] };
  }

  const { data: options, run } = useRequest(
    async (bmId: number) => {
      const res = await apiSpBmxxFindBmRyInf(bmId);
      const obj = forEachPerson(res?.data || {});
      return obj;
    },
    {
      defaultParams: [-1],
      cacheKey: 'apiSpBmxxFindBmRyInf',
      staleTime: 6 * 60 * 60 * 1000, // 60 minutes
    },
  );

  return {
    options: options,
    fieldNames,
    filter,
    run,
  };
}

// Bm部门list 特殊（绑定行政区划）Administrative Division
export function useADataRequest() {
  const fieldNamesSpc = {
    label: 'name',
    value: 'id',
    children: 'child',
  };

  const filter: ShowSearchType['filter'] = (inputValue, path) => {
    return path.some((option) => option.name.indexOf(inputValue) > -1);
  };
  function forEachPerson(res: any) {
    // 组织人员数据
    const orgOption = cloneDeep(res.tree || []);
    // formatInfo(orgOption);
    return { orgOption, onlyOrgOption: res.tree || [] };
  }

  const { data: options, run } = useRequest(
    async () => {
      const res = await apiSpBmxxFindControls();
      const obj = forEachPerson(res?.data || {});
      return obj;
    },
    {
      cacheKey: 'apiSpBmxxFindControls',
      staleTime: 6 * 60 * 60 * 1000, // 60 minutes
    },
  );

  return {
    options: options,
    fieldNamesSpc,
    filter,
    run,
  };
}

function mergeInfo(infos: DepartPerson[]) {
  infos.forEach((infoItem) => {
    let arr: DepartPerson[] = [];
    // 判断是否有部门
    if (infoItem.bmDataList?.length) {
      arr = infoItem.bmDataList.map((item) => {
        return {
          name: item.name,
          id: item.id,
          orgId: item.orgId,
          child: [],
          bmDataList: item.bmDataList,
          yhxxList: item.yhxxList,
        };
      });
    }
    // 判断是否有人员
    if (infoItem.yhxxList?.length) {
      // 将部门和人员数据合并
      arr = arr.concat(
        infoItem.yhxxList.map((item) => {
          return {
            name: item.name,
            id: item.id,
            orgId: item.orgId,
            bmDataList: item.bmDataList,
            yhxxList: item.yhxxList,
            child: [],
          };
        }),
      );
    }
    if (arr?.length) {
      mergeInfo(arr);
    }
    infoItem.child = arr || [];
  });
}

// 判断是否有行政区划代码
// function formatInfo(infos: Group[]) {
//   infos.forEach((infoItem) => {
//     let arr: Group[] = [];

//     if (infoItem.field && infoItem.field.xzqh_code) {
//       console.log('取代码', infoItem.field);
//       arr = infoItem.field.map((item) => {
//         return {
//           name: item.name,
//           id: item.id,
//           orgId: item.orgId,
//           child: [],
//           bmDataList: item.bmDataList,
//           yhxxList: item.yhxxList,
//         };
//       });
//     }

//     if (arr?.length) {
//       mergeInfo(arr);
//     }
//     infoItem.child = arr || [];
//   });
// }
