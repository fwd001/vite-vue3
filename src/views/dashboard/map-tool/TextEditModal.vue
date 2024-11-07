<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
    @register="registerModal"
    title="文本编辑"
    @ok="handleSubmit"
  >
    <div class="pr-12px">
      <BasicForm @register="registerForm">
        <template #backgroundColor="{ model, field }">
          <ColorPicker v-model:pureColor="model[field]" :size="40" format="hex8" shape="square" />
          <span>{{ model[field] }}</span>
        </template>
        <template #color="{ model, field }">
          <ColorPicker v-model:pureColor="model[field]" :size="40" format="hex8" shape="circle" />
          <span>{{ model[field] }}</span>
        </template>
      </BasicForm>
    </div>
    <template #insertFooter>
      <a-button type="primary" danger @click="handleDel">删除</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { FormSchema } from '@/components/Table';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';
  import { ToolTypeEnum } from './enum';
  import { useToolStore } from './useToolStore';

  const emit = defineEmits(['updateAttribute', 'register', 'delete']);
  let id: string;
  const toolStore = useToolStore();

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

      colProps: {
        span: 12,
      },
    },
    {
      field: 'lng',
      component: 'InputNumber',
      label: '经度',
      defaultValue: '',
      componentProps: { disabled: true, class: 'w-100%' },
      labelWidth: 50,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'content',
      component: 'InputTextArea',
      label: '内容',
      defaultValue: '',
    },
    {
      field: 'backgroundColor',
      slot: 'backgroundColor',
      label: '背景颜色',
      defaultValue: '#3388ff',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'color',
      slot: 'color',
      label: '文字颜色',
      defaultValue: '#3388ff',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'width',
      component: 'InputNumber',
      label: '盒子宽度',
      defaultValue: 0,
      componentProps: { max: 2560, min: 0 },
      colProps: {
        span: 12,
      },
    },
  ];
  const [registerModal, { closeModal, setModalProps }] = useModalInner((data) => {
    setModalProps({ title: '文本属性编辑' });
    id = data.id;
    attrToSchema(data);
  });

  const [registerForm, { setFieldsValue, validateFields }] = useForm({
    labelWidth: 80,
    schemas,
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
  });

  function attrToSchema(attr: any) {
    setFieldsValue({
      id: attr.id,
      content: attr.content,
      type: ToolTypeEnum.text,
      lat: attr.latlng[0],
      lng: attr.latlng[1],
      backgroundColor: attr.backgroundColor ?? '#fff',
      color: attr.color ?? '#333',
      width: attr.width ?? 300,
    });
  }
  const handleSubmit = async () => {
    const values = await validateFields();
    closeModal();
    emit('updateAttribute', values);
  };

  const handleDel = () => {
    toolStore.deleteTextItem(id);
    closeModal();
  };
</script>
