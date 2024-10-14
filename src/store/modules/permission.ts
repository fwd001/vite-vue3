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

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number;
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[];
  // 菜单列表
  frontMenuList: Menu[];
  staticMenuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
    staticMenuList: [],
  }),
  getters: {
    getBackMenuList(state): Menu[] {
      return state.backMenuList;
    },
    getFrontMenuList(state): Menu[] {
      return state.frontMenuList;
    },
    getStaticMenuList(state): Menu[] {
      return state.staticMenuList;
    },
    getLastBuildMenuTime(state): number {
      return state.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(state): boolean {
      return state.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setStaticMenuList(list: Menu[]) {
      this.staticMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },

    // 构建路由
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
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
      this.setFrontMenuList(menuList);

      // Convert multi-level routing to level 2 routing
      // 将多级路由转换为 2 级路由
      routes = flatMultiLevelRoutes(routes);

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
