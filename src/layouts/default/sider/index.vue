<template>
  <MixSider v-if="getIsMixSidebar" />
  <Sider v-else />
</template>

<script lang="ts" setup>
  import Sider from './LayoutSider.vue';
  import MixSider from './MixSider.vue';

  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  defineOptions({ name: 'SiderWrapper' });

  const { getIsMixSidebar } = useMenuSetting();
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sider-wrapper';

  .@{prefix-cls} {
    .ant-drawer-body {
      height: 100vh !important;
      padding: 0 !important;
    }

    .ant-drawer-header-no-title {
      display: none !important;
    }
  }
</style>
