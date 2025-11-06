# Web 应用版本更新弹窗（Vue 3 + TypeScript）

基于 `@vueuse/core` 与 `fetch` 定期轮询 `version.json`，当检测到新版本时显示更新提示并可主动刷新页面。

## 使用

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { setup as updateAppInit } from './components/UpdatePopup';

const app = createApp(App);
app.mount('#app');

// 初始化版本更新检测
updateAppInit();
```

## 生成 version.json（示例）

可在打包后生成 `dist/version.json`，内容形如：

```json
{ "version": "2025-11-06T08:00:00.000Z" }
```

或编写打包钩子生成：

```js
// 伪代码：在 closeBundle 阶段写入 dist/version.json
const version = { version: new Date().toISOString() };
```

## 全局类型（已内置于 src/global.d.ts）

```ts
declare global {
  type Fn = (...args: any[]) => void;

  interface Window {
    __bizConfig__?: {
      VITE_PUBLIC_PATH?: string;
      VITE_UPDATE_INTERVAL: number;
      [key: string]: unknown;
    };

    __showUpdatePrompt?: (cb: () => void) => void;
  }

  let __showUpdatePrompt: (cb: () => void) => void;
}
export {};
```

## 配置项

- `window.__bizConfig__.VITE_UPDATE_INTERVAL`：轮询间隔（毫秒），默认 `10000`。
- `import.meta.env.VITE_PUBLIC_PATH`：`version.json` 所在的公共路径，默认 `'/'`。

## 行为说明

- 页面可见时开始轮询，切到后台暂停，切回前台立即触发一次并恢复轮询。
- 新版本出现时调用 `window.__showUpdatePrompt(cb)` 显示提示；点击确认会执行回调：
  1. 写入最新版本到 `localStorage('app_version')`
  2. 刷新页面以载入新构建
