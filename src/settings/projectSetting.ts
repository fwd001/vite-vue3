import type { ProjectConfig } from '#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '@/enums/menuEnum';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '@/enums/appEnum';
import {
  SIDE_BAR_BG_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from './designSetting';

// ! 在更改后需要清除浏览器缓存
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,

  // 是否显示主题切换按钮
  showDarkModeToggle: true,

  // `设置`按钮位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // 权限模式
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // 权限相关缓存存储在sessionStorage或localStorage中
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 颜色
  themeColor: APP_PRESET_COLOR_LIST[0],

  // 网站灰色模式，可能在哀悼日期开启
  grayMode: false,

  // 色弱模式
  colorWeak: false,

  // 是否取消菜单、顶部、多标签页显示，可能嵌入其他系统中
  fullContent: false,

  // 内容模式
  contentMode: ContentEnum.FULL,

  // 是否显示logo
  showLogo: true,

  // 是否显示页脚
  showFooter: false,

  // 头部配置
  headerSetting: {
    // 头部背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 固定在顶部
    fixed: true,
    // 是否显示顶部
    show: true,
    // 主题
    theme: ThemeEnum.LIGHT,
    // 是否启用锁定页面功能
    useLockPage: true,
    // 是否显示全屏按钮
    showFullScreen: true,
    // 是否显示文档按钮
    showDoc: true,
    // 是否显示通知按钮
    showNotice: true,
    // 是否显示菜单搜索
    showSearch: false,
    showApi: false,
  },

  // 菜单配置
  menuSetting: {
    // 侧边栏菜单背景颜色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 是否固定左侧菜单
    fixed: true,
    // 菜单折叠
    collapsed: false,
    // 当响应式布局隐藏侧边栏时
    siderHidden: false,
    // 折叠菜单时是否显示菜单名称
    collapsedShowTitle: false,
    // 是否可以拖拽
    // 仅限于左侧菜单开启时，在菜单右侧有一个拖拽条
    canDrag: false,
    // 是否显示无DOM
    show: true,
    // 是否隐藏DOM
    hidden: false,
    // 菜单宽度
    menuWidth: 210,
    // 菜单模式
    mode: MenuModeEnum.INLINE,
    // 菜单类型
    type: MenuTypeEnum.SIDEBAR,
    // 菜单主题
    theme: ThemeEnum.DARK,
    // 分割菜单
    split: false,
    // 顶部菜单布局
    topMenuAlign: 'center',
    // 折叠触发位置
    trigger: TriggerEnum.HEADER,
    // 是否启用手风琴模式，仅显示一个菜单
    accordion: true,
    // 切换页面关闭菜单
    closeMixSidebarOnChange: false,
    // 模块打开方法 ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 固定展开菜单
    mixSideFixed: false,
  },

  // 多标签
  multiTabsSetting: {
    cache: false,
    // 启用
    show: true,
    // 是否可以拖拽排序标签
    canDrag: true,
    // 启用快速操作
    showQuick: true,
    // 是否显示刷新按钮
    showRedo: true,
    // 是否显示折叠按钮
    showFold: true,
    // 自动折叠
    autoCollapse: false,
  },

  // 过渡设置
  transitionSetting: {
    // 是否开启页面切换动画
    // 禁用状态也会禁用页面加载
    enable: true,

    // 路由基本切换动画
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 是否开启页面切换加载
    // 仅在enable=true时开启
    openPageLoading: true,

    // 是否开启顶部进度条
    openNProgress: false,
  },

  // 是否启用KeepAlive缓存最好在开发时关闭，否则每次都需要清除缓存
  openKeepAlive: true,

  // 自动屏幕锁定时间，0不锁定屏幕。单位分钟，默认0
  lockTime: 0,

  // 是否显示面包屑
  showBreadCrumb: true,

  // 是否显示面包屑图标
  showBreadCrumbIcon: false,

  // 使用错误处理插件
  useErrorHandle: false,

  // 是否开启返回顶部
  useOpenBackTop: true,

  // 是否可以嵌入iframe页面
  canEmbedIFramePage: true,

  // 切换接口时是否删除未关闭的消息并进行通知
  closeMessageOnSwitch: true,

  // 是否取消在切换界面时已发送但未响应的http请求。
  // 如果启用，我想要覆盖单个接口。可以在单独的接口中设置
  removeAllHttpPending: false,
};

export default setting;
