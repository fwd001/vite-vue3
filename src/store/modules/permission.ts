import type { AppRouteRecordRaw, Menu } from '@/router/types';

import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user';
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';

import { asyncRoutes } from '@/router/routes';
import { ERROR_LOG_ROUTE } from '@/router/routes/basic';

import { filter } from '@/utils/helper/treeHelper';

import { PageEnum } from '@/enums/pageEnum';
import { ref, computed } from 'vue';

export const usePermissionStore = defineStore('app-permission', () => {
  // state
  const permCodeList = ref<string[] | number[]>([]);
  const isDynamicAddedRoute = ref(false);
  const lastBuildMenuTime = ref(0);
  const backMenuList = ref<Menu[]>([]);
  const frontMenuList = ref<Menu[]>([]);
  const staticMenuList = ref<Menu[]>([]);

  // getters
  const getBackMenuList = computed(() => backMenuList.value);
  const getFrontMenuList = computed(() => frontMenuList.value);
  const getStaticMenuList = computed(() => staticMenuList.value);
  const getLastBuildMenuTime = computed(() => lastBuildMenuTime.value);
  const getIsDynamicAddedRoute = computed(() => isDynamicAddedRoute.value);

  // actions
  function setPermCodeList(codeList: string[]) {
    permCodeList.value = codeList;
  }
  function setBackMenuList(list: Menu[]) {
    backMenuList.value = list;
    list?.length > 0 && setLastBuildMenuTime();
  }
  function setFrontMenuList(list: Menu[]) {
    frontMenuList.value = list;
  }
  function setStaticMenuList(list: Menu[]) {
    staticMenuList.value = list;
  }
  function setLastBuildMenuTime() {
    lastBuildMenuTime.value = new Date().getTime();
  }
  function setDynamicAddedRoute(added: boolean) {
    isDynamicAddedRoute.value = added;
  }
  function resetState(): void {
    isDynamicAddedRoute.value = false;
    permCodeList.value = [];
    backMenuList.value = [];
    lastBuildMenuTime.value = 0;
  }
  // 构建路由
  async function buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
    const userStore = useUserStore();
    let routes: AppRouteRecordRaw[] = [];
    // 路由过滤器 在 函数filter 作为回调传入遍历使用
    const routeFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      // 判断powerKey
      const { powerKey } = meta || {};
      if (!powerKey) return true;
      // 对资源进行判断
      return userStore.getUserInfo.resources.some((resource) => resource.val === powerKey);
    };
    const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
      const { ignoreRoute } = meta || {};
      // arr.filter 返回 true 表示该元素通过测试
      return !ignoreRoute;
    };
    /**
     * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
     * */
    const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
      if (!routes || routes.length === 0) return;
      let homePath: string = PageEnum.BASE_HOME;
      function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
        if (parentPath) parentPath = parentPath + '/';
        routes.forEach((route: AppRouteRecordRaw) => {
          const { path, children, redirect } = route;
          const currentPath = path.startsWith('/') ? path : parentPath + path;
          if (currentPath === homePath) {
            if (redirect) {
              homePath = route.redirect! as string;
            } else {
              route.meta = Object.assign({}, route.meta, { affix: true });
              throw new Error('end');
            }
          }
          children && children.length > 0 && patcher(children, currentPath);
        });
      }
      try {
        patcher(routes);
      } catch (e) {
        // 已处理完毕跳出循环
      }
      return;
    };
    // 对非一级路由进行过滤
    routes = filter(asyncRoutes, routeFilter);
    // 对一级路由再次根据角色权限过滤
    routes = routes.filter(routeFilter);
    // 将路由转换成菜单
    const menuList = transformRouteToMenu(routes, true);
    // 移除掉 ignoreRoute: true 的路由 非一级路由
    routes = filter(routes, routeRemoveIgnoreFilter);
    // 移除掉 ignoreRoute: true 的路由 一级路由；
    routes = routes.filter(routeRemoveIgnoreFilter);
    // 对菜单进行排序
    menuList.sort((a, b) => {
      return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
    });
    // 设置菜单列表
    setFrontMenuList(menuList);
    // Convert multi-level routing to level 2 routing
    // 将多级路由转换为 2 级路由
    routes = flatMultiLevelRoutes(routes);
    routes.push(ERROR_LOG_ROUTE);
    patchHomeAffix(routes);
    return routes;
  }
  return {
    // state
    permCodeList,
    isDynamicAddedRoute,
    lastBuildMenuTime,
    backMenuList,
    frontMenuList,
    staticMenuList,
    // getters
    getBackMenuList,
    getFrontMenuList,
    getStaticMenuList,
    getLastBuildMenuTime,
    getIsDynamicAddedRoute,
    // actions
    setPermCodeList,
    setBackMenuList,
    setFrontMenuList,
    setStaticMenuList,
    setLastBuildMenuTime,
    setDynamicAddedRoute,
    resetState,
    buildRoutesAction,
  };
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
