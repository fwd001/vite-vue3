<!--
 * @Description: 表单项组件，支持动态渲染、异步属性、布局自适应等
-->
<template>
  <Col v-bind="colPropsComputed">
    <FormItem v-bind="formItemProps">
      <!-- 标签及帮助信息 -->
      <template #label v-if="!formItemProps.hiddenLabel && schema.component !== 'Divider'">
        <Tooltip>
          <span>{{ schema.label }}</span>
          <template #title v-if="schema.helpMessage">
            <span>{{ schema.helpMessage }}</span>
          </template>
          <Icon v-if="schema.helpMessage" class="ml-5" icon="ant-design:question-circle-outlined" />
        </Tooltip>
      </template>

      <!-- 自定义插槽渲染 -->
      <slot
        v-if="schema.componentProps?.slotName"
        :name="schema.componentProps.slotName"
        v-bind="schema"
      ></slot>

      <!-- 分割线组件 -->
      <Divider
        v-else-if="schema.component === 'Divider' && schema.label && !formItemProps.hiddenLabel"
      >
        {{ schema.label }}
      </Divider>

      <!-- 动态表单项渲染 -->
      <div>
        <component
          class="v-form-item-wrapper"
          :is="componentItem"
          v-bind="{ ...cmpProps, ...asyncProps }"
          :schema="schema"
          :style="schema.width ? { width: schema.width } : {}"
          @change="handleChange"
          @click="handleClick(schema)"
        />
      </div>

      <!-- 按钮类控件显示label -->
      <span v-if="schema.component === 'Button'">{{ schema.label }}</span>
    </FormItem>
  </Col>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Tooltip, FormItem, Divider, Col } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { componentMap } from '../../core/formItemConfig';
  import { IVFormComponent, IFormConfig } from '../../typings/v-form-component';
  import { asyncComputed } from '@vueuse/core';
  import { handleAsyncOptions } from '../../utils';
  import { omit } from 'lodash-es';
  import { useFormModelState } from '../../hooks/useFormDesignState';

  // ===================== 类型定义 =====================
  interface Props {
    formData?: Record<string, any>;
    schema: IVFormComponent;
    formConfig: IFormConfig;
  }
  const props = withDefaults(defineProps<Props>(), {
    formData: () => ({}),
  });

  const emit = defineEmits<{
    (e: 'update:form-data', value: Record<string, any>): void;
    (e: 'change', value: any): void;
  }>();

  // ===================== 依赖状态与方法 =====================
  // 表单数据状态与操作
  const { formModel: formData1, setFormModel } = useFormModelState();

  // ===================== 计算属性 =====================

  // 计算列属性（布局相关）
  const colPropsComputed = computed(() => {
    const { colProps = {} } = props.schema;
    return colProps;
  });

  // 计算FormItem属性（布局、校验等）
  const formItemProps = computed(() => {
    const { formConfig } = props;
    let { field, required, rules, labelCol, wrapperCol, hiddenLabel, itemProps } = props.schema;
    const { colon } = formConfig;

    // 处理labelCol
    labelCol = labelCol
      ? labelCol
      : formConfig.layout === 'horizontal'
        ? formConfig.labelLayout === 'flex'
          ? { style: `width:${formConfig.labelWidth}px` }
          : formConfig.labelCol
        : {};

    // 处理wrapperCol
    wrapperCol = wrapperCol
      ? wrapperCol
      : formConfig.layout === 'horizontal'
        ? formConfig.labelLayout === 'flex'
          ? { style: 'width:auto;flex:1' }
          : formConfig.wrapperCol
        : {};

    // 横向flex布局样式
    const style =
      formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex'
        ? { display: 'flex' }
        : {};

    // 先处理 itemProps，过滤掉 validateTrigger: false
    const safeItemProps = { ...itemProps };
    if (safeItemProps.validateTrigger === false) {
      delete safeItemProps.validateTrigger;
    }

    // 合并属性
    const newConfig = {
      name: field,
      style: { ...style },
      colon,
      required,
      rules,
      labelCol,
      wrapperCol,
      hiddenLabel,
      ...safeItemProps,
    };

    // 优先itemProps中的配置
    if (!itemProps?.labelCol?.span) {
      newConfig.labelCol = labelCol;
    }
    if (!itemProps?.wrapperCol?.span) {
      newConfig.wrapperCol = wrapperCol;
    }
    if (!itemProps?.rules) {
      newConfig.rules = rules;
    }

    return newConfig;
  });

  // 计算当前渲染的组件
  const componentItem = computed(() => componentMap.get(props.schema.component as string));

  // ===================== 异步属性处理 =====================
  // 处理options、treeData等异步属性（如远程下拉、树形数据等）
  const asyncProps = asyncComputed(async () => {
    let { options, treeData } = props.schema.componentProps ?? {};
    if (options) options = await handleAsyncOptions(options);
    if (treeData) treeData = await handleAsyncOptions(treeData);
    return {
      options,
      treeData,
    };
  });

  // ===================== 同步属性处理 =====================
  // 处理除异步外的其他属性（如value、checked、disabled等）
  const cmpProps = computed(() => {
    const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
    const { field } = props.schema;
    let { disabled, ...attrs } = omit(props.schema.componentProps, ['options', 'treeData']) ?? {};
    disabled = props.formConfig.disabled || disabled;
    return {
      ...attrs,
      disabled,
      [isCheck ? 'checked' : 'value']: formData1.value[field!],
    };
  });

  // ===================== 事件处理 =====================

  /**
   * 处理点击事件（如按钮自定义事件）
   * @param schema 当前表单项schema
   */
  function handleClick(schema: IVFormComponent) {
    if (schema.component === 'Button' && schema.componentProps?.handle) {
      emit(schema.componentProps.handle, null);
    }
  }

  /**
   * 处理表单项变更
   * @param e 事件对象或新值
   */
  function handleChange(e: any) {
    const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
    const target = e ? e.target : null;
    const value = target ? (isCheck ? target.checked : target.value) : e;
    setFormModel(props.schema.field!, value);
    emit('change', value);
  }
</script>

<style lang="less" scoped>
  .ml-5 {
    margin-left: 5px;
  }

  // form字段中的标签有ant-col，不能使用width:100%
  :deep(.ant-col) {
    width: auto;
  }

  .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 20px;
  }
</style>
