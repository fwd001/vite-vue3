// 全息档案 Holographic Archives
import Request from "./request";
/*
为什么要创建 axios 的实例（instance）
当我们从 axios 模块中导入对象时，使用的实例是默认的实例
当给该实例设置一些默认配置时，这些配置就被固定下俩了
但是后续开发中，某些配置可能会不太一样
比如某些请求需要使用特定的 baseURL 或者 timeout 或者 content-Type 等
这个时候，我们就可以创建新的实例，并且传入属于该实例的配置信息
*/

/*
 一般情况下，只需创建一个实例
 什么时候需要创建多个实例？
 比如baseURL不同，且在这个baseURL下请求多次，这个时候创建一个公用的请求实例能够提升代码的可维护性
 */
console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL);


 export const haRequest = new Request({
  baseURL: '/proxy',
  timeout: 1000 * 60 * 1,
});

