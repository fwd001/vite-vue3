<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
    @register="onRegisterModal"
    title="文本编辑"
    @ok="onSubmit"
  >
    <div class="pr-12px">
      <BasicForm @register="onRegisterForm">
        <!-- 背景颜色选择器插槽 -->
        <template #backgroundColor="{ model, field }">
          <ColorPicker v-model:pureColor="model[field]" :size="40" format="hex8" shape="square" />
          <span>{{ model[field] }}</span>
        </template>
        <!-- 文字颜色选择器插槽 -->
        <template #color="{ model, field }">
          <ColorPicker v-model:pureColor="model[field]" :size="40" format="hex8" shape="circle" />
          <span>{{ model[field] }}</span>
        </template>
      </BasicForm>
    </div>
    <template #insertFooter>
      <a-button type="primary" danger @click="onDelete">删除</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import type { FormSchema } from '@/components/Table';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';
  import { ToolTypeEnum } from './enum';
  import { useToolStore } from './useToolStore';

  // 事件声明
  const emit = defineEmits<{
    updateAttribute: [value: TextAttr];
    register: any[];
    delete: any[];
  }>();

  // 文本属性类型定义
  interface TextAttr {
    id: string;
    type: ToolTypeEnum;
    lat: number;
    lng: number;
    content: string;
    backgroundColor: string;
    color: string;
    width: number;
  }

  let textId = '';
  const toolStore = useToolStore();

  // 表单结构定义
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: '唯一编号',
      defaultValue: '',
      componentProps: { disabled: true },
    },
    {
      field: 'type',
      component: 'Input',
      label: '类型',
      show: false,
      defaultValue: ToolTypeEnum.text,
      componentProps: { disabled: true },
    },
    {
      field: 'lat',
      component: 'InputNumber',
      label: '纬度',
      defaultValue: '',
      componentProps: { disabled: true },
      colProps: { span: 12 },
    },
    {
      field: 'lng',
      component: 'InputNumber',
      label: '经度',
      defaultValue: '',
      componentProps: { disabled: true, class: 'w-100%' },
      labelWidth: 50,
      colProps: { span: 12 },
    },
    {
      field: 'content',
      component: 'InputTextArea',
      label: '内容',
      defaultValue: '',
      componentProps: { rows: 5 },
    },
    {
      field: 'backgroundColor',
      slot: 'backgroundColor',
      label: '背景颜色',
      defaultValue: '#3388ff',
      colProps: { span: 12 },
    },
    {
      field: 'color',
      slot: 'color',
      label: '文字颜色',
      defaultValue: '#3388ff',
      colProps: { span: 12 },
    },
    {
      field: 'width',
      component: 'InputNumber',
      label: '盒子宽度',
      defaultValue: 0,
      componentProps: { max: 2560, min: 0 },
      colProps: { span: 12 },
    },
  ];

  // Modal注册与数据回填
  const [onRegisterModal, { closeModal, setModalProps }] = useModalInner(
    (data: Partial<TextAttr> & { latlng?: [number, number] }) => {
      setModalProps({ title: '文本属性编辑' });
      textId = data.id ?? '';
      fillFormFromAttr(data);
    },
  );

  // 表单注册
  const [onRegisterForm, { setFieldsValue, validateFields }] = useForm({
    labelWidth: 80,
    schemas,
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
  });

  // 属性数据回填到表单
  function fillFormFromAttr(attr: Partial<TextAttr> & { latlng?: [number, number] }) {
    setFieldsValue({
      id: attr.id ?? '',
      content: attr.content ?? '',
      type: ToolTypeEnum.text,
      lat: attr.latlng?.[0] ?? 0,
      lng: attr.latlng?.[1] ?? 0,
      backgroundColor: attr.backgroundColor ?? '#ffffff',
      color: attr.color ?? '#333333',
      width: attr.width ?? 300,
    });
  }

  // 提交表单
  async function onSubmit() {
    const values = (await validateFields()) as TextAttr;
    closeModal();
    emit('updateAttribute', values);
  }

  // 删除文本项
  function onDelete() {
    toolStore.removeTextItem(textId);
    closeModal();
  }
</script>
