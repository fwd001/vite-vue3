import { RoleEnum } from '@/enums/roleEnum';

export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number;
    // 标题
    title: string;
    // 动态路由级别
    dynamicLevel?: number;
    // 动态路由的真实路径（为了性能）
    realPath?: string;
    // 是否忽略权限
    ignoreAuth?: boolean;
    // 角色信息
    roles?: RoleEnum[];
    // 是否不缓存
    ignoreKeepAlive?: boolean;
    // 是否固定在标签页上
    affix?: boolean;
    // 标签页上的图标
    icon?: string;
    // 标签页上的图片
    img?: string;
    frameSrc?: string;
    // 当前页面的过渡效果名称
    transitionName?: string;
    // 路由是否已动态添加
    hideBreadcrumb?: boolean;
    // 隐藏子菜单
    hideChildrenInMenu?: boolean;
    // 携带参数
    carryParam?: boolean;
    // 用于内部标记单级菜单
    single?: boolean;
    // 当前激活的菜单
    currentActiveMenu?: string;
    // 从不显示在标签页上
    hideTab?: boolean;
    // 从不显示在菜单中
    hideMenu?: boolean;
    isLink?: boolean;
    // 仅为菜单构建
    ignoreRoute?: boolean;
    // 隐藏子菜单的路径
    hidePathForChildren?: boolean;
    // 权限key
    powerKey?: string;
  }
}
