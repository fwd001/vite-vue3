<template>
  <BasicForm @register="register" />
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '@/components/Form';

  defineOptions({
    name: 'Example1',
  });

  const schemas: FormSchema[] = [
    {
      component: 'AutoComplete',
      label: '自动完成',
      colProps: {
        span: 24,
      },
      field: '_auto_complete_27',
      componentProps: {
        placeholder: '请输入正则表达式',
        options: [
          {
            value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
            label: '手机号码',
          },
          {
            value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
            label: '网址带端口号',
          },
        ],
      },
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'IconPicker',
      label: '图标选择器',
      colProps: {
        span: 24,
      },
      field: '_icon_picker_28',
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
        required: true,
      },
    },
    {
      component: 'Checkbox',
      label: '复选框',
      colProps: {
        span: 24,
        offset: 0,
        md: 24,
      },
      field: '_checkbox_29',
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'InputTextArea',
      label: '文本域',
      field: '_input_text_area_30',
      colProps: {
        span: 24,
      },
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'InputTextArea',
      label: '文本域',
      field: '_input_text_area_31',
      colProps: {
        span: 24,
      },
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'InputTextArea',
      label: '文本域',
      field: '_input_text_area_32',
      colProps: {
        span: 24,
      },
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'StrengthMeter',
      label: '密码强度',
      colProps: {
        span: 24,
      },
      field: '_strength_meter_24',
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'AutoComplete',
      label: '自动完成',
      colProps: {
        span: 24,
      },
      field: '_auto_complete_26',
      componentProps: {
        placeholder: '请输入正则表达式',
        options: [
          {
            value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
            label: '手机号码',
          },
          {
            value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
            label: '网址带端口号',
          },
        ],
      },
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'InputCountDown',
      label: '倒计时输入',
      colProps: {
        span: 24,
      },
      field: '_input_count_down_23',
      componentProps: {},
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
    },
    {
      component: 'Input',
      label: '输入框',
      field: '_input_25',
      colProps: {
        span: 24,
      },
      componentProps: {
        type: 'text',
      },
      itemProps: {
        labelCol: {},
        wrapperCol: {},
      },
      // @ts-ignore
      layout: 'horizontal',
      labelLayout: 'flex',
      labelWidth: 100,
      labelCol: {},
      wrapperCol: {},
    },
  ];

  const [register] = useForm({
    schemas,
  });
</script>
