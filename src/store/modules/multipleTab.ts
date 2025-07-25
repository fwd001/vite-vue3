import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';

import { useGo, useRedo } from '@/hooks/web/usePage';
import { Persistent } from '@/utils/cache/persistent';

import { PageEnum } from '@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { getRawRoute } from '@/utils';
import { MULTIPLE_TABS_KEY } from '@/enums/cacheEnum';

import projectSetting from '@/settings/projectSetting';
import { ref, computed } from 'vue';

export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

function handleGotoPage(router: Router) {
  const go = useGo(router);
  go(unref(router.currentRoute).fullPath, true);
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
};

const cacheTab = projectSetting.multiTabsSetting.cache;

export const useMultipleTabStore = defineStore('app-multiple-tab', () => {
  // state
  const cacheTabList = ref<Set<string>>(new Set());
  const tabList = ref<RouteLocationNormalized[]>(cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : []);
  const lastDragEndIndex = ref<number>(0);

  // getters
  const getTabList = computed(() => tabList.value);
  const getCachedTabList = computed(() => Array.from(cacheTabList.value));
  const getLastDragEndIndex = computed(() => lastDragEndIndex.value);

  // actions
  async function updateCacheTab() {
    const cacheMap: Set<string> = new Set();
    for (const tab of tabList.value) {
      const item = getRawRoute(tab);
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) continue;
      const name = item.name as string;
      cacheMap.add(name);
    }
    cacheTabList.value = cacheMap;
  }
  async function refreshPage(router: Router) {
    const { currentRoute } = router;
    const route = unref(currentRoute);
    const name = route.name;
    const findTab = getCachedTabList.value.find((item) => item === name);
    if (findTab) {
      cacheTabList.value.delete(findTab);
    }
    const redo = useRedo(router);
    await redo();
  }
  function clearCacheTabs(): void {
    cacheTabList.value = new Set();
  }
  function resetState(): void {
    tabList.value = [];
    clearCacheTabs();
  }
  function goToPage(router: Router) {
    const go = useGo(router);
    const len = tabList.value.length;
    const { path } = unref(router.currentRoute);
    let toPath: PageEnum | string = PageEnum.BASE_HOME;
    if (len > 0) {
      const page = tabList.value[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }
    path !== toPath && go(toPath as PageEnum, true);
  }
  async function addTab(route: RouteLocationNormalized) {
    const { path, name, fullPath, params, query, meta } = getRawRoute(route);
    if (
      path === PageEnum.ERROR_PAGE ||
      path === PageEnum.BASE_LOGIN ||
      !name ||
      [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
    ) {
      return;
    }
    let updateIndex = -1;
    const tabHasExits = tabList.value.some((tab, index) => {
      updateIndex = index;
      return (
        decodeURIComponent(tab.fullPath || tab.path) === decodeURIComponent(fullPath || path)
      );
    });
    if (tabHasExits) {
      const curTab = toRaw(tabList.value)[updateIndex];
      if (!curTab) {
        return;
      }
      curTab.params = params || curTab.params;
      curTab.query = query || curTab.query;
      curTab.fullPath = fullPath || curTab.fullPath;
      tabList.value.splice(updateIndex, 1, curTab);
    } else {
      const dynamicLevel = meta?.dynamicLevel ?? -1;
      if (dynamicLevel > 0) {
        const realPath = meta?.realPath ?? '';
        if (
          tabList.value.filter((e) => (e.meta?.realPath ?? '') === realPath).length >= dynamicLevel
        ) {
          const index = tabList.value.findIndex((item) => item.meta.realPath === realPath);
          index !== -1 && tabList.value.splice(index, 1);
        }
      }
      tabList.value.push(route);
    }
    updateCacheTab();
    cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, tabList.value);
  }
  async function closeTab(tab: RouteLocationNormalized, router: Router) {
    const close = (route: RouteLocationNormalized) => {
      const { fullPath, meta: { affix } = {} } = route;
      if (affix) {
        return;
      }
      const index = tabList.value.findIndex((item) => item.fullPath === fullPath);
      index !== -1 && tabList.value.splice(index, 1);
    };
    const { currentRoute, replace } = router;
    const { path } = unref(currentRoute);
    if (path !== tab.path) {
      close(tab);
      updateCacheTab();
      return;
    }
    let toTarget: RouteLocationRaw = {};
    const index = tabList.value.findIndex((item) => item.path === path);
    if (index === 0) {
      if (tabList.value.length === 1) {
        toTarget = PageEnum.BASE_HOME;
      } else {
        const page = tabList.value[index + 1];
        toTarget = getToTarget(page);
      }
    } else {
      const page = tabList.value[index - 1];
      toTarget = getToTarget(page);
    }
    close(currentRoute.value);
    await replace(toTarget);
  }
  async function closeTabByKey(key: string, router: Router) {
    const index = tabList.value.findIndex((item) => (item.fullPath || item.path) === key);
    if (index !== -1) {
      await closeTab(tabList.value[index], router);
      const { currentRoute, replace } = router;
      const isActivated = tabList.value.findIndex((item) => {
        return item.fullPath === currentRoute.value.fullPath;
      });
      if (isActivated === -1) {
        let pageIndex;
        if (index > 0) {
          pageIndex = index - 1;
        } else if (index < tabList.value.length - 1) {
          pageIndex = index + 1;
        } else {
          pageIndex = -1;
        }
        if (pageIndex >= 0) {
          const page = tabList.value[index - 1];
          const toTarget = getToTarget(page);
          await replace(toTarget);
        }
      }
    }
  }
  async function sortTabs(oldIndex: number, newIndex: number) {
    const currentTab = tabList.value[oldIndex];
    tabList.value.splice(oldIndex, 1);
    tabList.value.splice(newIndex, 0, currentTab);
    lastDragEndIndex.value = lastDragEndIndex.value + 1;
  }
  async function closeLeftTabs(route: RouteLocationNormalized, router: Router) {
    const index = tabList.value.findIndex((item) => item.path === route.path);
    if (index > 0) {
      const leftTabs = tabList.value.slice(0, index);
      const pathList: string[] = [];
      for (const item of leftTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      await bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }
  async function closeRightTabs(route: RouteLocationNormalized, router: Router) {
    const index = tabList.value.findIndex((item) => item.fullPath === route.fullPath);
    if (index >= 0 && index < tabList.value.length - 1) {
      const rightTabs = tabList.value.slice(index + 1, tabList.value.length);
      const pathList: string[] = [];
      for (const item of rightTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      await bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }
  async function closeAllTab(router: Router) {
    tabList.value = tabList.value.filter((item) => item?.meta?.affix ?? false);
    clearCacheTabs();
    goToPage(router);
  }
  async function closeOtherTabs(route: RouteLocationNormalized, router: Router) {
    const closePathList = tabList.value.map((item) => item.fullPath);
    const pathList: string[] = [];
    for (const path of closePathList) {
      if (path !== route.fullPath) {
        const closeItem = tabList.value.find((item) => item.fullPath === path);
        if (!closeItem) {
          continue;
        }
        const affix = closeItem?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(closeItem.fullPath);
        }
      }
    }
    await bulkCloseTabs(pathList);
    updateCacheTab();
    Persistent.setLocal(MULTIPLE_TABS_KEY, tabList.value, true);
    handleGotoPage(router);
  }
  async function bulkCloseTabs(pathList: string[]) {
    tabList.value = tabList.value.filter((item) => !pathList.includes(item.fullPath));
  }
  async function setTabTitle(title: string, route: RouteLocationNormalized) {
    const findTab = getTabList.value.find((item) => item === route);
    if (findTab) {
      findTab.meta.title = title;
      await updateCacheTab();
    }
  }
  async function updateTabPath(fullPath: string, route: RouteLocationNormalized) {
    const findTab = getTabList.value.find((item) => item === route);
    if (findTab) {
      findTab.fullPath = fullPath;
      findTab.path = fullPath;
      await updateCacheTab();
    }
  }

  return {
    // state
    cacheTabList,
    tabList,
    lastDragEndIndex,
    // getters
    getTabList,
    getCachedTabList,
    getLastDragEndIndex,
    // actions
    updateCacheTab,
    refreshPage,
    clearCacheTabs,
    resetState,
    goToPage,
    addTab,
    closeTab,
    closeTabByKey,
    sortTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTab,
    closeOtherTabs,
    bulkCloseTabs,
    setTabTitle,
    updateTabPath,
  };
});

// Need to be used outside the setup
export function useMultipleTabWithOutStore() {
  return useMultipleTabStore(store);
}
