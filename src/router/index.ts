/*
 * @Author: wedong.fu
 * @Date: 2022-07-18 13:07:13
 * @LastEditors: wedong.fu
 * @LastEditTime: 2022-07-18 13:13:05
 * @Description: 
 */
import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import routes from "./routes";
const HomeLogin = () => import('@/views/home/login.vue');


// 此处由【new VueRouter】的方式修改为【createRouter】的方式 其余无变化
const router = createRouter({
  history: createWebHashHistory(), //路由模式的配置采用API调用的方式 不再是之前的字符串 此处采用的hash路由
  routes: [
    {
      path: "/",
      redirect: "/welcome",
    },
    {
      path: '/login',
      name: 'HomeLogin',
      component: HomeLogin,
      meta: { title: '登陆' },
    },
    ...routes,
  ],
});

// 检查权限
// const checkRoutePower = (to: RouteLocationNormalized) => {};

// // 权限守卫
// router.beforeEach((to) => checkRoutePower(to));

export default router
