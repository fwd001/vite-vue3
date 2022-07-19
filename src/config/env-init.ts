import { dev } from './dev-env';

// van 环境变量 stg、 pre、 prod
const vanEnv = document.documentElement.dataset.vanEnv;
// 是否是开发环境
const isDev = import.meta.env.DEV;

// 环境变量
let envVar = '';
if (isDev) {
  envVar = dev.env;
} else {
  if (vanEnv !== 'prod') {
    envVar = `-${vanEnv || 'stg'}`;
  }
}

export { isDev, envVar };
