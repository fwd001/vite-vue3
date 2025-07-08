<!--
 * @Description: 右侧属性配置面板
-->
<template>
  <div class="h-100%" ref="tabsWrapRef" :style="{ '--tabs-wrap-height': height - 47 + 'px' }">
    <Tabs
      v-model:activeKey="formConfig.activeKey"
      :tabBarStyle="{ margin: 0, paddingLeft: '12px' }"
    >
      <TabPane :key="1" tab="表单">
        <FormProps />
      </TabPane>
      <TabPane :key="2" tab="控件">
        <FormItemProps />
      </TabPane>
      <TabPane :key="3" tab="栅格">
        <ComponentColumnProps />
      </TabPane>
      <TabPane :key="4" tab="组件">
        <slot v-if="slotProps" :name="slotProps.component + 'Props'"></slot>
        <ComponentProps v-else />
      </TabPane>
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import FormProps from '../components/FormProps.vue';
  import FormItemProps from '../components/FormItemProps.vue';
  import ComponentProps from '../components/ComponentProps.vue';
  import ComponentColumnProps from '../components/FormItemColumnProps.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { customComponents } from '../../../core/formItemConfig';
  import { TabPane, Tabs } from 'ant-design-vue';

  import { useElementSize } from '@vueuse/core';

  defineOptions({
    name: 'PropsPanel',
  });

  const { formConfig } = useFormDesignState();
  const tabsWrapRef = ref(null);
  const { height } = useElementSize(tabsWrapRef);
  const slotProps = computed(() => {
    return customComponents.find(
      (item) => item.component === formConfig.value.currentItem?.component,
    );
  });
</script>

<style lang="less" scoped>
  @import url('../styles/variable.less');

  :deep(.ant-tabs) {
    box-sizing: border-box;

    .top-form-wrap {
      width: 100%;
      height: var(--tabs-wrap-height);
      margin-right: 10px;
      overflow: hidden auto;
    }

    .hint-box {
      margin-top: 200px;
    }

    .ant-form-item,
    .ant-slider-with-marks {
      margin-right: 20px;
      margin-bottom: 0;
      margin-left: 10px;
    }

    .ant-form-item {
      // width: 100%;
      margin-bottom: 0;

      .ant-form-item-label {
        line-height: 2;
        vertical-align: text-top;
      }
    }

    .ant-input-number {
      width: 100%;
    }
  }
</style>
