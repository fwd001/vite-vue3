import { useIntervalFn } from '@vueuse/core';
import { isDevMode } from '../../utils/env';

/**
 * 模块职责
 * - 仅负责“检测是否有新版本”与“触发全局弹窗回调”。
 * - UI 展示与用户交互由 `Popup.vue` 实现并在运行时挂载 `window.__showUpdatePrompt`。
 */

/**
 * 可感知页面可见性的轮询定时器。
 * @param cbFn 轮询任务（建议幂等，能被立即触发一次）
 * @param time 轮询间隔（毫秒）
 */
export const superInterval = (cbFn: Fn, time: number = 10 * 1000): void => {
  const { pause, resume } = useIntervalFn(cbFn, time, { immediate: false });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden === false) {
      // 切回当前页面
      cbFn();
      resume?.();
    } else {
      // 切回后台
      pause?.();
    }
  });

  if (document.hidden === false) {
    // 切回当前页面
    cbFn();
    resume?.();
  }
};

// 定期检测构建版本是否变化：与本地记录的 app_version 对比
let __isFirstRun: boolean = true;

interface VersionInfo {
  version: string;
}

/**
 * 拉取 `version.json` 并与本地版本对比，若不同则触发更新提示。
 */
function checkForUpdates(): void {
  if (isDevMode()) return;

  const currentVersion: string | null = localStorage.getItem('app_version');
  const publicPath: string = import.meta.env.VITE_PUBLIC_PATH || '/';
  fetch(`${publicPath}version.json`, { cache: 'no-cache' })
    .then((res) => res.json() as Promise<VersionInfo>)
    .then((data) => {
      const newVersion: string = data.version;
      if (!currentVersion || __isFirstRun) {
        localStorage.setItem('app_version', newVersion);
        __isFirstRun = false;
      } else if (currentVersion !== newVersion) {
        // 由 `Popup.vue` 挂载的全局更新提示
        __showUpdatePrompt?.(() => {
          localStorage.setItem('app_version', newVersion);
          window.location.reload();
        });
      }
    })
    .catch((e) => {
      console.warn('版本检查失败!');
      console.error(e);
    });
}

/**
 * 初始化更新检测（建议在应用挂载后调用）。
 */
export const setup = (): void => {
  // 检测间隔优先读取运行时配置，其次默认 10s
  const intervalMs: number = window.__bizConfig__?.VITE_UPDATE_INTERVAL ?? 10 * 1000;
  superInterval(checkForUpdates, intervalMs);
};
// 测试定时器
// superInterval(() => {
//   console.log('测试打印');
// }, 2 * 1000);
