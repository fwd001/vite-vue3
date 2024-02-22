<template>
  <div :class="`${prefixCls}-dom`" :style="getDomStyle"></div>
  <div
    v-click-outside="handleClickOutside"
    :style="getWrapStyle"
    :class="[
      prefixCls,
      getMenuTheme,
      {
        open: openMenu,
        mini: getCollapsed,
      },
    ]"
    v-bind="getMenuEvents"
  >
    <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />

    <LayoutTrigger :class="`${prefixCls}-trigger`" />
    <ScrollContainer>
      <ul :class="`${prefixCls}-module`">
        <li
          :class="[
            `${prefixCls}-module__item `,
            {
              [`${prefixCls}-module__item--active`]: item.path === activePath,
            },
          ]"
          v-bind="getItemEvents(item)"
          v-for="item in menuModules"
          :key="item.path"
        >
          <SimpleMenuTag :item="item" collapseParent dot />
          <img
            v-if="item.img"
            :src="item.img"
            :class="[`${prefixCls}-module__icon`, getCollapsed ? 'w-16px h-16px' : 'w-20px h-20px']"
          />
          <Icon
            v-else
            :class="`${prefixCls}-module__icon`"
            :size="getCollapsed ? 16 : 20"
            :icon="item.icon || (item.meta && item.meta.icon)"
          />
          <p :class="`${prefixCls}-module__name`">
            {{ t(item.name) }}
          </p>
        </li>
      </ul>
    </ScrollContainer>

    <div :class="`${prefixCls}-menu-list`" ref="sideRef" :style="getMenuStyle">
      <div
        v-show="openMenu"
        :class="[
          `${prefixCls}-menu-list__title`,
          {
            show: openMenu,
          },
        ]"
      >
        <span class="text"> {{ title }}</span>
        <Icon
          :size="16"
          :icon="getMixSideFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"
          class="pushpin"
          @click="handleFixedMenu"
        />
      </div>
      <ScrollContainer :class="`${prefixCls}-menu-list__content`">
        <SimpleMenu
          :items="childrenMenus"
          :theme="getMenuTheme"
          mixSider
          @menu-click="handleMenuClick"
        />
      </ScrollContainer>
      <div
        v-show="getShowDragBar && openMenu"
        :class="`${prefixCls}-drag-bar`"
        ref="dragBarRef"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { Menu } from '@/router/types';
  import type { CSSProperties } from 'vue';
  import { computed, onMounted, ref, unref, watch } from 'vue';
  import type { RouteLocationNormalized } from 'vue-router';
  import { ScrollContainer } from '@/components/Container';
  import { SimpleMenu } from '@/components/SimpleMenu';
  import Icon from '@/components/Icon/Icon.vue';
  import { AppLogo } from '@/components/Application';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useDragLine } from './useLayoutSider';
  import { useGlobSetting } from '@/hooks/setting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGo } from '@/hooks/web/usePage';
  import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
  import vClickOutside from '@/directives/clickOutside';
  import { getChildrenMenus, getCurrentParentPath, getShallowMenus } from '@/router/menus';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import LayoutTrigger from '../trigger/index.vue';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const SimpleMenuTag = createAsyncComponent(
    () => import('@/components/SimpleMenu/src/SimpleMenuTag.vue'),
  );

  defineOptions({ name: 'LayoutMixSider' });

  let menuModules = ref<Menu[]>([]);
  const activePath = ref('');
  const childrenMenus = ref<Menu[]>([]);
  const openMenu = ref(false);
  const dragBarRef = ref(null);
  const sideRef = ref(null);
  const currentRoute = ref<RouteLocationNormalized | null>(null);

  const { prefixCls } = useDesign('layout-mix-sider');
  const go = useGo();
  const { t } = useI18n();
  const {
    getMenuWidth,
    getCanDrag,
    getCloseMixSidebarOnChange,
    getMenuTheme,
    getMixSideTrigger,
    getRealWidth,
    getMixSideFixed,
    mixSideHasChildren,
    setMenuSetting,
    getIsMixSidebar,
    getCollapsed,
  } = useMenuSetting();

  const { title } = useGlobSetting();
  const permissionStore = usePermissionStore();

  useDragLine(sideRef, dragBarRef, true);

  const getMenuStyle = computed((): CSSProperties => {
    return {
      width: unref(openMenu) ? `${unref(getMenuWidth)}px` : 0,
      left: `${unref(getMixSideWidth)}px`,
    };
  });

  const getIsFixed = computed(() => {
    /* eslint-disable-next-line */
    mixSideHasChildren.value = unref(childrenMenus).length > 0;
    const isFixed = unref(getMixSideFixed) && unref(mixSideHasChildren);
    if (isFixed) {
      /* eslint-disable-next-line */
      openMenu.value = true;
    }
    return isFixed;
  });

  const getMixSideWidth = computed(() => {
    return unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
  });

  const getDomStyle = computed((): CSSProperties => {
    const fixedWidth = unref(getIsFixed) ? unref(getRealWidth) : 0;
    const width = `${unref(getMixSideWidth) + fixedWidth}px`;
    return getWrapCommonStyle(width);
  });

  const getWrapStyle = computed((): CSSProperties => {
    const width = `${unref(getMixSideWidth)}px`;
    return getWrapCommonStyle(width);
  });

  const getMenuEvents = computed(() => {
    return !unref(getMixSideFixed)
      ? {
          onMouseleave: () => {
            setActive(true);
            closeMenu();
          },
        }
      : {};
  });

  const getShowDragBar = computed(() => unref(getCanDrag));

  onMounted(async () => {
    menuModules.value = await getShallowMenus();
  });

  // Menu changes
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    async () => {
      menuModules.value = await getShallowMenus();
    },
    {
      immediate: true,
    },
  );

  listenerRouteChange((route) => {
    currentRoute.value = route;
    setActive(true);
    if (unref(getCloseMixSidebarOnChange)) {
      closeMenu();
    }
  });

  function getWrapCommonStyle(width: string): CSSProperties {
    return {
      width,
      maxWidth: width,
      minWidth: width,
      flex: `0 0 ${width}`,
    };
  }

  // Process module menu click
  async function handleModuleClick(path: string, hover = false) {
    const children = await getChildrenMenus(path);
    if (unref(activePath) === path) {
      if (!hover) {
        if (!unref(openMenu)) {
          openMenu.value = true;
        } else {
          closeMenu();
        }
      } else {
        if (!unref(openMenu)) {
          openMenu.value = true;
        }
      }
      if (!unref(openMenu)) {
        setActive();
      }
    } else {
      openMenu.value = true;
      activePath.value = path;
    }

    if (!children || children.length === 0) {
      if (!hover) go(path);
      childrenMenus.value = [];
      closeMenu();
      return;
    }
    childrenMenus.value = children;
  }

  // Set the currently active menu and submenu
  async function setActive(setChildren = false) {
    const path = currentRoute.value?.path;
    if (!path) return;
    activePath.value = await getCurrentParentPath(path);
    // hanldeModuleClick(parentPath);
    if (unref(getIsMixSidebar)) {
      const activeMenu = unref(menuModules).find((item) => item.path === unref(activePath));
      const p = activeMenu?.path;
      if (p) {
        const children = await getChildrenMenus(p);
        if (setChildren) {
          childrenMenus.value = children;

          if (unref(getMixSideFixed)) {
            openMenu.value = children.length > 0;
          }
        }
        if (children.length === 0) {
          childrenMenus.value = [];
        }
      }
    }
  }

  function handleMenuClick(path: string) {
    go(path);
  }

  function handleClickOutside() {
    setActive(true);
    closeMenu();
  }

  function getItemEvents(item: Menu) {
    if (unref(getMixSideTrigger) === 'hover') {
      return {
        onMouseenter: () => handleModuleClick(item.path, true),
        onClick: async () => {
          const children = await getChildrenMenus(item.path);
          if (item.path && (!children || children.length === 0)) go(item.path);
        },
      };
    }
    return {
      onClick: () => handleModuleClick(item.path),
    };
  }

  function handleFixedMenu() {
    setMenuSetting({
      mixSideFixed: !unref(getIsFixed),
    });
  }

  // Close menu
  function closeMenu() {
    if (!unref(getIsFixed)) {
      openMenu.value = false;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-mix-sider';
  @width: 80px;
  .@{prefix-cls} {
    position: fixed !important;
    z-index: @layout-mix-sider-fixed-z-index!important;
    top: 0 !important;
    left: 0 !important;
    height: 100% !important;
    overflow: hidden !important;
    transition: all 0.2s ease 0s !important;
    background-color: @sider-dark-bg-color!important;

    &-dom {
      height: 100% !important;
      overflow: hidden !important;
      transition: all 0.2s ease 0s !important;
    }

    &-logo {
      display: flex !important;
      justify-content: center !important;
      height: @header-height!important;
      padding-left: 0 !important;

      img {
        width: @logo-width!important;
        height: @logo-width!important;
      }
    }

    &.light {
      .@{prefix-cls}-logo {
        border-bottom: 1px solid rgb(238 238 238) !important;
      }

      &.open {
        > .scrollbar {
          border-right: 1px solid rgb(238 238 238) !important;
        }
      }

      .@{prefix-cls}-module {
        &__item {
          color: rgb(0 0 0 / 65%) !important;
          font-weight: normal !important;

          &--active {
            background-color: unset !important;
            color: @primary-color!important;
          }

          &:not(&--active):hover {
            background-color: rgb(0 0 0 / 6%) !important;
          }
        }
      }
      .@{prefix-cls}-menu-list {
        &__content {
          box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%) !important;
        }

        &__title {
          .pushpin {
            color: rgb(0 0 0 / 35%) !important;

            &:hover {
              color: rgb(0 0 0 / 85%) !important;
            }
          }
        }
      }
    }
    @border-color: @sider-dark-lighten-bg-color!important;

    &.dark {
      &.open {
        // .@{prefix-cls}-logo {
        //   border-bottom: 1px solid @border-color!important;
        // }

        > .scrollbar {
          border-right: 1px solid @border-color!important;
        }
      }
      .@{prefix-cls}-menu-list {
        background-color: @sider-dark-bg-color!important;

        &__title {
          border-bottom: none !important;
          border-bottom: 1px solid @border-color!important;
          color: @white!important;
        }
      }
    }

    > .scrollbar {
      height: calc(100% - @header-height - 38px) !important;
    }

    &.mini &-module {
      &__name {
        display: none !important;
      }

      &__icon {
        margin-bottom: 0 !important;
      }
    }

    &-module {
      position: relative !important;
      padding-top: 1px !important;

      &__item {
        position: relative !important;
        padding: 12px 0 !important;
        transition: all 0.3s ease !important;
        color: rgb(255 255 255 / 65%) !important;
        text-align: center !important;
        cursor: pointer !important;

        &:hover {
          color: @white!important;
        }
        // &:hover,
        &--active {
          background-color: @sider-dark-darken-bg-color!important;
          color: @white!important;
          font-weight: 700 !important;

          &::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 3px !important;
            height: 100% !important;
            background-color: @primary-color!important;
          }
        }
      }

      &__icon {
        margin-bottom: 8px !important;
        transition: all 0.2s !important;
        font-size: 24px !important;
      }

      &__name {
        margin-bottom: 0 !important;
        transition: all 0.2s !important;
        font-size: 12px !important;
      }
    }

    &-trigger {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 36px !important;
      background-color: @trigger-dark-bg-color!important;
      color: rgb(255 255 255 / 65%) !important;
      font-size: 14px !important;
      line-height: 36px !important;
      text-align: center !important;
      cursor: pointer !important;
    }

    &.light &-trigger {
      border-top: 1px solid #eee !important;
      background-color: #fff !important;
      color: rgb(0 0 0 / 65%) !important;
    }

    &-menu-list {
      position: fixed !important;
      top: 0 !important;
      width: 200px;
      height: calc(100%) !important;
      transition: all 0.2s !important;
      background-color: #fff !important;

      &__title {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        height: @header-height!important;
        transition: unset !important;
        border-bottom: 1px solid rgb(238 238 238) !important;
        opacity: 0 !important;
        color: @primary-color!important;
        // margin-left: -6px!important;
        font-size: 18px !important;

        &.show {
          min-width: 130px !important;
          transition: all 0.5s ease !important;
          opacity: 1 !important;
        }

        .pushpin {
          margin-right: 6px !important;
          color: rgb(255 255 255 / 65%) !important;
          cursor: pointer !important;

          &:hover {
            color: #fff !important;
          }
        }
      }

      &__content {
        height: calc(100% - @header-height) !important;

        .scrollbar__wrap {
          height: 100% !important;
          overflow-x: hidden !important;
        }

        .scrollbar__bar.is-horizontal {
          display: none !important;
        }

        .ant-menu {
          height: 100% !important;
        }

        .ant-menu-inline,
        .ant-menu-vertical,
        .ant-menu-vertical-left {
          border-right: 1px solid transparent !important;
        }
      }
    }

    &-drag-bar {
      position: absolute !important;
      top: 50px !important;
      right: -1px !important;
      width: 1px !important;
      height: calc(100% - 50px) !important;
      border-top: none !important;
      border-bottom: none !important;
      background-color: #f8f8f9 !important;
      box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%) !important;
      cursor: ew-resize !important;
    }
  }
</style>
