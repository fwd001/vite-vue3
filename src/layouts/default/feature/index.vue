<template>
  <LayoutLockPage />
  <BackTop v-if="getUseOpenBackTop" :target="getTarget" />
  <SettingDrawer
    v-if="getIsFixedSettingDrawer && (!getShowMultipleTab || getFullContent)"
    :class="prefixCls"
  />
  <SessionTimeoutLogin v-if="getIsSessionTimeout" />
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { BackTop } from 'ant-design-vue';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useUserStoreWithOut } from '@/store/modules/user';

  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  import SessionTimeoutLogin from '@/views/sys/login/SessionTimeoutLogin.vue';

  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';

  defineOptions({ name: 'LayoutFeatures' });

  const LayoutLockPage = createAsyncComponent(() => import('@/views/sys/lock/index.vue'));
  const SettingDrawer = createAsyncComponent(() => import('@/layouts/default/setting/index.vue'));

  const getTarget = () => document.body;

  const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
    useRootSetting();
  const userStore = useUserStoreWithOut();
  const { prefixCls } = useDesign('setting-drawer-feature');
  const { getShowHeader } = useHeaderSetting();

  const getIsSessionTimeout = computed(() => userStore.getSessionTimeout);

  const getIsFixedSettingDrawer = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return !unref(getShowHeader) || unref(getFullContent);
    }
    return settingButtonPosition === SettingButtonPositionEnum.FIXED;
  });

  const { getShowMultipleTab } = useMultipleTabSetting();
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-drawer-feature';

  .@{prefix-cls} {
    display: flex !important;
    position: absolute !important;
    z-index: 10 !important;
    top: 45% !important;
    right: 0 !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 10px !important;
    border-radius: 6px 0 0 6px !important;
    background-color: @primary-color!important;
    color: @white!important;
    cursor: pointer !important;

    svg {
      width: 1em !important;
      height: 1em !important;
    }
  }
</style>
