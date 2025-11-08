import { useIntervalFn } from '@vueuse/core';
import { isDevMode } from '../../utils/env';

/**
 * 更新检测模块
 *
 * 模块职责：
 * - 仅负责"检测是否有新版本"与"触发全局弹窗回调"
 * - UI 展示与用户交互由 `Popup.vue` 实现并在运行时挂载 `window.__showUpdatePrompt`
 *
 * 工作流程：
 * 1. 定期轮询检查 `version.json` 文件
 * 2. 对比当前版本与远程版本
 * 3. 发现新版本时触发更新提示弹窗
 */

/**
 * 可感知页面可见性的智能轮询定时器
 *
 * 特性：
 * - 当页面切换到后台时自动暂停轮询，节省资源
 * - 当页面切回前台时立即执行一次任务并恢复轮询
 * - 支持自定义轮询间隔
 *
 * @param cbFn - 轮询任务回调函数（建议幂等，能被立即触发一次）
 * @param time - 轮询间隔（毫秒），默认 10 秒
 * @returns void
 *
 * @example
 * ```ts
 * superInterval(() => {
 *   console.log('执行轮询任务');
 * }, 5000); // 每 5 秒执行一次
 * ```
 */
export const superInterval = (cbFn: Fn, time: number = 10 * 1000): void => {
  const { pause, resume } = useIntervalFn(cbFn, time, { immediate: false });

  // 监听页面可见性变化，实现智能暂停/恢复
  document.addEventListener('visibilitychange', () => {
    if (document.hidden === false) {
      // 页面切回前台：立即执行一次任务并恢复轮询
      cbFn();
      resume?.();
    } else {
      // 页面切到后台：暂停轮询以节省资源
      pause?.();
    }
  });

  // 初始化时，如果页面可见则立即执行一次并启动轮询
  if (document.hidden === false) {
    cbFn();
    resume?.();
  }
};

/**
 * 版本信息接口
 * 对应 `version.json` 文件的数据结构
 */
interface VersionInfo {
  /** 版本标识符（通常为时间戳或 Git Hash） */
  version: string;
}

/**
 * 检查应用是否有新版本可用
 *
 * 工作流程：
 * 1. 从远程服务器拉取 `version.json` 文件
 * 2. 对比当前构建时注入的版本与远程版本
 * 3. 如果版本不同，触发更新提示弹窗
 *
 * 注意：
 * - 开发环境下自动跳过检查
 * - 首次运行时会将远程版本设置为当前版本
 * - 使用 `cache: 'no-cache'` 确保获取最新版本信息
 *
 * @returns void
 */
function checkForUpdates(): void {
  // 开发环境跳过版本检查
  if (isDevMode()) return;

  // 从 Window 对象获取当前构建时注入的版本信息
  const currentVersion: string | undefined = window.__app_version;
  // 获取公共路径配置，用于构建正确的版本文件 URL
  const publicPath: string = import.meta.env.VITE_PUBLIC_PATH || '/';

  // 拉取远程版本信息（禁用缓存以确保获取最新版本）
  fetch(`${publicPath}version.json`, { cache: 'no-cache' })
    .then((res) => res.json() as Promise<VersionInfo>)
    .then((data) => {
      const newVersion: string = data.version;

      if (!currentVersion) {
        // 首次运行：更新 Window 上的版本信息，不触发更新提示
        window.__app_version = newVersion;
      } else if (currentVersion !== newVersion) {
        // 检测到新版本：触发更新提示弹窗
        __showUpdatePrompt?.(() => {
          // 用户确认更新后，刷新页面加载新版本
          window.location.reload();
        });
      }
    })
    .catch((e) => {
      // 版本检查失败时的错误处理（不影响应用正常运行）
      console.warn('版本检查失败!');
      console.warn(e);
    });
}

/**
 * 初始化应用更新检测功能
 *
 * 功能说明：
 * - 启动智能轮询定时器，定期检查新版本
 * - 轮询间隔可通过 `window.__bizConfig__.VITE_UPDATE_INTERVAL` 配置
 * - 默认轮询间隔为 10 秒
 *
 * 使用建议：
 * - 应在应用挂载后调用，避免阻塞首屏渲染
 * - 建议在 `main.ts` 中调用
 *
 * @returns void
 *
 * @example
 * ```ts
 * import { setup as updateAppInit } from './components/UpdatePopup';
 *
 * createApp(App).mount('#app');
 * updateAppInit(); // 初始化更新检测
 * ```
 */
export const setup = (): void => {
  // 检测间隔优先读取运行时配置，其次使用默认值 10 秒
  const intervalMs: number = window.__bizConfig__?.VITE_UPDATE_INTERVAL ?? 10 * 1000;
  // 启动智能轮询定时器
  superInterval(checkForUpdates, intervalMs);
};

// 以下为测试代码，生产环境请删除
// superInterval(() => {
//   console.log('测试打印');
// }, 2 * 1000);
