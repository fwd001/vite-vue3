<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="属性编辑" @ok="handleSubmit">
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
        <Select ref="select" v-model:value="model[field]" style="width: 120px">
          <SelectOption
            v-for="item in pointOptions"
            :key="item.key"
            :value="`${item.image}@@@${item.width}x${item.height}`"
          >
            <div class="flex items-center"
              ><img
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
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { FormSchema } from '@/components/Table';
  import { SelectOption, Select } from 'ant-design-vue';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';
  import { ref } from 'vue';
  import { defaultIcon, iconPublicPath } from './utils';

  const emit = defineEmits(['updateAttribute', 'register']);
  const notMarker = ref(false);

  const pointOptions = [
    {
      key: 1,
      image: 'dot-blue.png',
      width: 20,
      height: 20,
      label: '蓝色',
    },
    {
      key: 2,
      image: 'dot-green.png',
      width: 20,
      height: 20,
      label: '绿色',
    },
    {
      key: 3,
      image: 'dot-red.png',
      width: 20,
      height: 20,
      label: '红色',
    },
    {
      key: 4,
      image: 'dot-mei.gif',
      width: 30,
      height: 30,
      label: '小羊',
    },
  ];

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
    {
      field: 'name',
      component: 'Input',
      label: '名称',
      defaultValue: '',
    },
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
      colProps: {
        span: 12,
      },
    },
    {
      field: 'lineColor',
      slot: 'lineColor',
      label: '轮廓颜色',
      defaultValue: '#3388ff',
      ifShow: false,
      colProps: {
        span: 12,
      },
    },
  ];
  const [registerModal, { closeModal, setModalProps }] = useModalInner((data) => {
    // console.log('弹窗获取属性', data);
    const _data = data.attr;
    notMarker.value = _data.type !== 'marker';
    setModalProps({ title: data.attr.name + '属性编辑' });
    attrToSchema(data.id, _data);
    updateSchema({
      field: 'lineColor',
      ifShow: notMarker.value,
    });
    updateSchema({
      field: 'fillColor',
      ifShow: notMarker.value,
    });
    updateSchema({
      field: 'pointIcon',
      ifShow: !notMarker.value,
    });
  });

  const [registerForm, { setFieldsValue, validateFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas,
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  function attrToSchema(id: any, attr: any) {
    setFieldsValue({ id, name: attr.name, type: attr.type });
    setFieldsValue({
      lineColor: attr.lineColor ?? '#3388ff',
      fillColor: attr.fillColor ?? '#3388ff',
      pointIcon: attr.pointIcon ?? defaultIcon,
    });
  }
  const handleSubmit = async () => {
    const values = await validateFields();
    // console.log(values);
    closeModal();
    emit('updateAttribute', values);
    // console.log('弹窗保存属性', values);
  };
</script>
