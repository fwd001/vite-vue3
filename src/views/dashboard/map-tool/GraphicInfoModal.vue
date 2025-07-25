<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="modalTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #lineColor="{ model, field }">
        <ColorPicker
          v-model:pureColor="model[field]"
          show-alpha
          :size="40"
          format="hex"
          shape="circle"
        />
        <span>{{ model[field] }}</span>
      </template>
      <template #fillColor="{ model, field }">
        <ColorPicker
          v-model:pureColor="model[field]"
          show-alpha
          :size="40"
          format="hex"
          shape="circle"
        />
        <span>{{ model[field] }}</span>
      </template>
      <template #pointIcon="{ model, field }">
        <Select v-model:value="model[field]" style="width: 120px">
          <SelectOption
            v-for="item in pointOptions"
            :key="item.key"
            :value="`${item.image}@@@${item.width}x${item.height}`"
          >
            <div class="flex items-center">
              <img
                width="16"
                height="16"
                class="block mr-8px"
                :src="iconPublicPath + item.image"
                alt="icon"
              />
              {{ item.label }}
            </div>
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import type { FormSchema } from '@/components/Table';
  import { SelectOption, Select } from 'ant-design-vue';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';
  import { defaultIcon, iconPublicPath } from './utils';

  // 事件定义
  const emits = defineEmits<{
    updateAttribute: [values: AttributeValues];
    register: any[];
  }>();

  // 类型定义
  interface PointOption {
    key: number;
    image: string;
    width: number;
    height: number;
    label: string;
  }

  interface AttributeValues {
    id: string;
    type: string;
    name: string;
    pointIcon?: string;
    fillColor?: string;
    lineColor?: string;
  }

  // 图标选项
  const pointOptions: PointOption[] = [
    { key: 1, image: 'dot-blue.png', width: 20, height: 20, label: '蓝色' },
    { key: 2, image: 'dot-green.png', width: 20, height: 20, label: '绿色' },
    { key: 3, image: 'dot-red.png', width: 20, height: 20, label: '红色' },
    { key: 4, image: 'dot-mei.gif', width: 30, height: 30, label: '小羊' },
  ];

  // 控制表单字段显示
  const isMarker = ref(true);
  const modalTitle = ref('属性编辑');

  // 表单 schema 配置
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: 'ID',
      defaultValue: '',
      componentProps: { disabled: true },
    },
    {
      field: 'type',
      component: 'Input',
      label: '类型',
      defaultValue: '',
      componentProps: { disabled: true },
    },
    { field: 'name', component: 'Input', label: '名称', defaultValue: '' },
    {
      field: 'pointIcon',
      slot: 'pointIcon',
      label: '图标',
      defaultValue: defaultIcon,
      ifShow: false,
    },
    {
      field: 'fillColor',
      slot: 'fillColor',
      label: '填充颜色',
      defaultValue: '#3388ff',
      ifShow: false,
      colProps: { span: 12 },
    },
    {
      field: 'lineColor',
      slot: 'lineColor',
      label: '轮廓颜色',
      defaultValue: '#3388ff',
      ifShow: false,
      colProps: { span: 12 },
    },
  ];

  // 弹窗注册与数据初始化
  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    (data: { id: string; attr: AttributeValues }) => {
      const attr = data.attr;
      isMarker.value = attr.type === 'marker';
      modalTitle.value = attr.name + '属性编辑';
      setModalProps({ title: modalTitle.value });
      setFormFields(data.id, attr);
      // 控制字段显示
      updateSchema({ field: 'lineColor', ifShow: !isMarker.value });
      updateSchema({ field: 'fillColor', ifShow: !isMarker.value });
      updateSchema({ field: 'pointIcon', ifShow: isMarker.value });
    },
  );

  // 表单注册
  const [registerForm, { setFieldsValue, validateFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas,
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
    actionColOptions: { span: 24 },
  });

  // 设置表单初始值
  function setFormFields(id: string, attr: AttributeValues) {
    setFieldsValue({
      id,
      name: attr.name,
      type: attr.type,
      lineColor: attr.lineColor ?? '#3388ff',
      fillColor: attr.fillColor ?? '#3388ff',
      pointIcon: attr.pointIcon ?? defaultIcon,
    });
  }

  // 表单提交
  async function handleSubmit() {
    const values = await validateFields();
    closeModal();
    emits('updateAttribute', values as AttributeValues);
  }
</script>
