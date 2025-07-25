import type { LockInfo } from '#/store';

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { LOCK_INFO_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { useUserStore } from './user';

export const useLockStore = defineStore('app-lock', () => {
  // state
  const lockInfo = ref<Nullable<LockInfo>>(Persistent.getLocal(LOCK_INFO_KEY));

  // getters
  const getLockInfo = computed(() => lockInfo.value);

  // actions
  function setLockInfo(info: LockInfo) {
    lockInfo.value = Object.assign({}, lockInfo.value, info);
    Persistent.setLocal(LOCK_INFO_KEY, lockInfo.value, true);
  }
  function resetLockInfo() {
    Persistent.removeLocal(LOCK_INFO_KEY, true);
    lockInfo.value = null;
  }
  // Unlock
  async function unLock(password?: string) {
    const userStore = useUserStore();
    if (lockInfo.value?.pwd === password) {
      resetLockInfo();
      return true;
    }
    const tryLogin = async () => {
      try {
        if (userStore.getUserInfo) {
          resetLockInfo();
        }
        return userStore.getUserInfo;
      } catch (error) {
        return false;
      }
    };
    return await tryLogin();
  }

  return {
    // state
    lockInfo,
    // getters
    getLockInfo,
    // actions
    setLockInfo,
    resetLockInfo,
    unLock,
  };
});
