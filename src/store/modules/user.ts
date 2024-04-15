import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { AurhorizeCodeParamsModel, AurhorizeCodeResultModel } from '@/api/sys/model/userModel';
import { doLogout, aurhorizeCode } from '@/api/sys/user';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { isDevMode } from '@/utils/env';

interface UserState {
  userInfo: Nullable<AurhorizeCodeResultModel>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): AurhorizeCodeResultModel {
      return state.userInfo || getAuthCache<AurhorizeCodeResultModel>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: AurhorizeCodeResultModel | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: AurhorizeCodeParamsModel & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<AurhorizeCodeResultModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        const { data } = await aurhorizeCode(loginParams);

        const { token } = data;
        if (token) {
          this.setUserInfo(data ?? null);
          this.setToken(token);
          // router.replace(path);
        }
        return this.afterLoginAction(goHome, loginParams.state);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean, path = '/'): Promise<AurhorizeCodeResultModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = this.getUserInfo;

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();

          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }

        if (goHome) {
          if (stateIsEmpty(path) === false) {
            path = decodeURIComponent(path || '');
          }
          await router.replace(stateIsEmpty(path) ? PageEnum.BASE_HOME : path);
        }
      }
      return userInfo;
    },

    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      const { authorizeHref, clientApiUrl } = useGlobSetting();

      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);

      if (isDevMode()) {
        goLogin && router.push(PageEnum.AUTH_PAGE);
      } else {
        location.href = `${clientApiUrl}${authorizeHref}`;
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提示'),
        content: () => h('span', '是否确认退出系统？'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

function stateIsEmpty(state: unknown): boolean {
  return [undefined, 'null', null, ''].includes(state as any);
}

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
