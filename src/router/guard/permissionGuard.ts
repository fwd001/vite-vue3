import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { useGlobSetting } from '@/hooks/setting';

import { PageEnum } from '@/enums/pageEnum';
import { useUserStoreWithOut } from '@/store/modules/user';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isDevMode } from '@/utils/env';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const AUTH_PAGE = PageEnum.AUTH_PAGE;

const whitePathList: PageEnum[] = [LOGIN_PATH, AUTH_PAGE];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getToken;
    const { authorizeHref, clientApiUrl } = useGlobSetting();
    // 可直接进入白名单
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    // token 或用户不存在
    if (!token) {
      // 无需许可即可访问。 您需要将路由meta.ignoreAuth设置为true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: AUTH_PAGE,
        query: { code: 'dev123' },
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      if (isDevMode()) {
        next(redirectData);
        return;
      } else {
        next(redirectData);
        // todo 正式有后端的项目用下面逻辑!!
        // location.href = `${clientApiUrl}${authorizeHref}`;
        console.log('authorizeHref, clientApiUrl', authorizeHref, clientApiUrl);

        return next(false);
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    const routes = await permissionStore.buildRoutesAction();

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    permissionStore.setDynamicAddedRoute(true);

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
