import type { LocaleSetting } from '#/config';

import { defineStore } from 'pinia';
import { store } from '@/store';

import { LOCALE_KEY } from '@/enums/cacheEnum';
import { createLocalStorage } from '@/utils/cache';
import { localeSetting } from '@/settings/localeSetting';
import { ref, computed } from 'vue';

const ls = createLocalStorage();

const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;

export const useLocaleStore = defineStore('app-locale', () => {
  // state
  const localInfo = ref<LocaleSetting>(lsLocaleSetting);

  // getters
  const getShowPicker = computed(() => !!localInfo.value?.showPicker);
  const getLocale = computed(() => localInfo.value?.locale ?? 'zh_CN');

  // actions
  function setLocaleInfo(info: Partial<LocaleSetting>) {
    localInfo.value = { ...localInfo.value, ...info };
    ls.set(LOCALE_KEY, localInfo.value);
  }
  function initLocale() {
    setLocaleInfo({
      ...localeSetting,
      ...localInfo.value,
    });
  }

  return {
    // state
    localInfo,
    // getters
    getShowPicker,
    getLocale,
    // actions
    setLocaleInfo,
    initLocale,
  };
});

// Need to be used outside the setup
export function useLocaleStoreWithOut() {
  return useLocaleStore(store);
}
