import type { ProjectConfig, MenuSetting } from '#/config';
import type { BeforeMiniState, ApiAddress } from '#/store';

import { defineStore } from 'pinia';
import { store } from '@/store';

import { ThemeEnum } from '@/enums/appEnum';
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY, API_ADDRESS } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { resetRouter } from '@/router';
import { deepMerge } from '@/utils';
import setting from '@/settings/projectSetting';
import { ref, computed } from 'vue';

let timeId: TimeoutHandle;

export const useAppStore = defineStore('app', () => {
  // state
  const darkMode = ref<ThemeEnum>();
  const pageLoading = ref(false);
  const projectConfig = ref<ProjectConfig | null>(Persistent.getLocal(PROJ_CFG_KEY));
  const beforeMiniInfo = ref<BeforeMiniState>({});

  // getters
  const getPageLoading = computed(() => pageLoading.value);
  const getDarkMode = computed(() => {
    return (
      darkMode.value ||
      localStorage.getItem(APP_DARK_MODE_KEY) ||
      setting.menuSetting.theme ||
      darkMode
    );
  });
  const getBeforeMiniInfo = computed(() => beforeMiniInfo.value);
  const getProjectConfig = computed(() => projectConfig.value || ({} as ProjectConfig));
  const getHeaderSetting = computed(() => getProjectConfig.value.headerSetting);
  const getMenuSetting = computed(() => getProjectConfig.value.menuSetting);
  const getTransitionSetting = computed(() => getProjectConfig.value.transitionSetting);
  const getMultiTabsSetting = computed(() => getProjectConfig.value.multiTabsSetting);
  const getApiAddress = computed(() => JSON.parse(localStorage.getItem(API_ADDRESS) || '{}'));

  // actions
  function setPageLoading(loading: boolean): void {
    pageLoading.value = loading;
  }
  function setDarkMode(mode: ThemeEnum): void {
    darkMode.value = mode;
    localStorage.setItem(APP_DARK_MODE_KEY, mode);
  }
  function setBeforeMiniInfo(state: BeforeMiniState): void {
    beforeMiniInfo.value = state;
  }
  function setProjectConfig(config: DeepPartial<ProjectConfig>): void {
    projectConfig.value = deepMerge(projectConfig.value || {}, config) as ProjectConfig;
    Persistent.setLocal(PROJ_CFG_KEY, projectConfig.value);
  }
  function setMenuSetting(setting: Partial<MenuSetting>): void {
    if (!projectConfig.value) return;
    projectConfig.value.menuSetting = deepMerge(projectConfig.value.menuSetting, setting);
    Persistent.setLocal(PROJ_CFG_KEY, projectConfig.value);
  }
  async function resetAllState() {
    resetRouter();
    Persistent.clearAll();
  }
  async function setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // Prevent flicker
      timeId = setTimeout(() => {
        setPageLoading(loading);
      }, 50);
    } else {
      setPageLoading(loading);
      clearTimeout(timeId);
    }
  }
  function setApiAddress(config: ApiAddress): void {
    localStorage.setItem(API_ADDRESS, JSON.stringify(config));
  }

  return {
    // state
    darkMode,
    pageLoading,
    projectConfig,
    beforeMiniInfo,
    // getters
    getPageLoading,
    getDarkMode,
    getBeforeMiniInfo,
    getProjectConfig,
    getHeaderSetting,
    getMenuSetting,
    getTransitionSetting,
    getMultiTabsSetting,
    getApiAddress,
    // actions
    setPageLoading,
    setDarkMode,
    setBeforeMiniInfo,
    setProjectConfig,
    setMenuSetting,
    resetAllState,
    setPageLoadingAction,
    setApiAddress,
  };
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
