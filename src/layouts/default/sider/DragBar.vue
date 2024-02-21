<template>
  <div :class="getClass" :style="getDragBarStyle"></div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  defineOptions({ name: 'DargBar' });

  const props = defineProps({
    mobile: Boolean,
  });

  const { getMiniWidthNumber, getCollapsed, getCanDrag } = useMenuSetting();

  const { prefixCls } = useDesign('darg-bar');
  const getDragBarStyle = computed(() => {
    if (unref(getCollapsed)) {
      return { left: `${unref(getMiniWidthNumber)}px` };
    }
    return {};
  });

  const getClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--hide`]: !unref(getCanDrag) || props.mobile,
      },
    ];
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-darg-bar';

  .@{prefix-cls} {
    position: absolute !important;
    z-index: @side-drag-z-index!important;
    top: 0 !important;
    right: -2px !important;
    width: 2px !important;
    height: 100% !important;
    border-top: none !important;
    border-bottom: none !important;
    cursor: col-resize !important;

    &--hide {
      display: none !important;
    }

    &:hover {
      background-color: @primary-color!important;
      box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%) !important;
    }
  }
</style>
