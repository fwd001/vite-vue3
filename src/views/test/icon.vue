<template>
  <div> 123 </div>
</template>
<script lang="ts" setup>
  // 不要继承FormItem禁用、占位符...
  defineOptions({ name: 'IconIndex', inheritAttrs: false });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-icon-picker';

  .@{prefix-cls} {
    .ant-input-group-addon {
      padding: 0 !important;
    }

    .ant-input {
      cursor: pointer !important;
    }

    &-popover {
      width: 300px !important;

      .ant-popover-inner-content {
        padding: 0 !important;
      }

      .scrollbar {
        height: 220px !important;
      }
    }
  }
</style>
