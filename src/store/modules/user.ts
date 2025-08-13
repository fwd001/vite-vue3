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
import { h, ref, computed } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { isDevMode } from '@/utils/env';

export const useUserStore = defineStore('app-user', () => {
  // state
  const userInfo = ref<Nullable<AurhorizeCodeResultModel>>(null);
  const token = ref<string | undefined>(undefined);
  const roleList = ref<RoleEnum[]>([]);
  const sessionTimeout = ref<boolean>(false);
  const lastUpdateTime = ref<number>(0);

  // getters
  const getUserInfo = computed(
    () => userInfo.value || getAuthCache<AurhorizeCodeResultModel>(USER_INFO_KEY) || {},
  );
  const getToken = computed(() => token.value || getAuthCache<string>(TOKEN_KEY));
  const getRoleList = computed(() =>
    roleList.value.length > 0 ? roleList.value : getAuthCache<RoleEnum[]>(ROLES_KEY),
  );
  const getSessionTimeout = computed(() => !!sessionTimeout.value);
  const getLastUpdateTime = computed(() => lastUpdateTime.value);

  // actions
  function setToken(info: string | undefined) {
    token.value = info ? info : '';
    setAuthCache(TOKEN_KEY, info);
  }
  function setRoleList(list: RoleEnum[]) {
    roleList.value = list;
    setAuthCache(ROLES_KEY, list);
  }
  function setUserInfo(info: AurhorizeCodeResultModel | null) {
    userInfo.value = info;
    lastUpdateTime.value = new Date().getTime();
    setAuthCache(USER_INFO_KEY, info);
  }
  function setSessionTimeout(flag: boolean) {
    sessionTimeout.value = flag;
  }
  function resetState() {
    userInfo.value = null;
    token.value = '';
    roleList.value = [];
    sessionTimeout.value = false;
  }
  async function login(
    params: AurhorizeCodeParamsModel & { goHome?: boolean; mode?: ErrorMessageMode },
  ): Promise<AurhorizeCodeResultModel | null> {
    try {
      const { goHome = true, ...loginParams } = params;
      const { data } = await aurhorizeCode(loginParams);
      const { token: tk } = data;
      if (tk) {
        setUserInfo(data ?? null);
        setToken(tk);
      }
      return afterLoginAction(goHome, loginParams.state);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async function afterLoginAction(
    goHome?: boolean,
    path = '/',
  ): Promise<AurhorizeCodeResultModel | null> {
    if (!getToken.value) return null;
    const user = getUserInfo.value;
    if (sessionTimeout.value) {
      setSessionTimeout(false);
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
        if (!stateIsEmpty(path)) {
          path = decodeURIComponent(path || '');
        } else {
          path = PageEnum.BASE_HOME;
        }
        router.replace(path);
      }
    }
    return user;
  }
  async function logout(goLogin = false) {
    const { authorizeHref, clientApiUrl } = useGlobSetting();
    if (getToken.value) {
      try {
        await doLogout();
      } catch {
        console.log('注销Token失败');
      }
    }
    setToken(undefined);
    setSessionTimeout(false);
    setUserInfo(null);
    if (isDevMode()) {
      goLogin && router.push(PageEnum.AUTH_PAGE);
    } else {
      location.href = `${clientApiUrl}${authorizeHref}`;
    }
  }
  function confirmLoginOut() {
    const { createConfirm } = useMessage();
    createConfirm({
      iconType: 'warning',
      title: () => h('span', '温馨提示'),
      content: () => h('span', '是否确认退出系统？'),
      onOk: async () => {
        await logout(true);
      },
    });
  }

  return {
    // state
    userInfo,
    token,
    roleList,
    sessionTimeout,
    lastUpdateTime,
    // getters
    getUserInfo,
    getToken,
    getRoleList,
    getSessionTimeout,
    getLastUpdateTime,
    // actions
    setToken,
    setRoleList,
    setUserInfo,
    setSessionTimeout,
    resetState,
    login,
    afterLoginAction,
    logout,
    confirmLoginOut,
  };
});

function stateIsEmpty(state: unknown): boolean {
  return [undefined, 'null', null, ''].includes(state as any);
}

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
