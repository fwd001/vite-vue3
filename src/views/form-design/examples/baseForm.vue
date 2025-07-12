<template>
  <div><BasicForm @register="register" /> <button @click="onSubmit">提交</button></div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '@/components/Form';

  // const schemas: FormSchema[] = [
  //   {
  //     field: 'field1',
  //     component: 'Input',
  //     label: '字段1',
  //     span: 8,
  //     // colProps: {
  //     //   span: 8,
  //     // },
  //     componentProps: {
  //       placeholder: '自定义placeholder',
  //       onChange: (_e: any) => {
  //         //
  //       },
  //     },
  //   },
  //   {
  //     field: 'field2',
  //     component: 'Input',
  //     label: '字段2',
  //     span: 8,
  //     // colProps: {
  //     //   span: 8,
  //     // },
  //   },
  // ];

  const [register, { getFieldsValue }] = useForm({
    schemas: [
      {
        component: 'InputCountDown',
        label: '倒计时输入',
        colProps: {
          span: 24,
        },
        field: '_input_count_down_1',
        componentProps: {},
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
        field: '_icon_picker_2',
        componentProps: {},
        itemProps: {
          labelCol: {},
          wrapperCol: {},
        },
      },
      {
        component: 'Checkbox',
        label: '复选框',
        colProps: {
          span: 24,
        },
        field: '_checkbox_3',
        itemProps: {
          labelCol: {},
          wrapperCol: {},
        },
      },
      {
        component: 'Input',
        label: '输入框',
        field: '_input_4',
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
      },
      {
        component: 'Radio',
        label: '单选框',
        field: '_radio_5',
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
        component: 'MonthPicker',
        label: '月份选择',
        field: '_month_picker_6',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请选择月份',
        },
        itemProps: {
          labelCol: {},
          wrapperCol: {},
        },
      },
      {
        component: 'Switch',
        label: '开关',
        field: '_switch_7',
        colProps: {
          span: 24,
        },
        componentProps: {},
        itemProps: {
          labelCol: {},
          wrapperCol: {},
        },
      },
    ],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    showActionButtonGroup: false,
  });

  function onSubmit() {
    const value = getFieldsValue();
    console.log('value', value);
  }
</script>
