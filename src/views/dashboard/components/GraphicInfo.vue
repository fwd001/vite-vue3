<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="属性编辑" @ok="handleSubmit">
    <BasicForm
      @register="registerForm"
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 24 }"
    />
    <div class="flex justify-center items-center">
      <span class="m-l-1rem m-r-1rem">轮廓颜色</span>
      <color-picker
        v-model:pureColor="lineColor"
        show-alpha
        :size="40"
        format="hex"
        shape="circle"
      />
      <span class="m-l-1rem m-r-1rem">填充颜色</span>
      <color-picker
        v-model:pureColor="fillColor"
        show-alpha
        :size="40"
        format="hex"
        shape="circle"
      />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { FormSchema } from '@/components/Table';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';
  import { ref } from 'vue';

  const lineColor = ref('#fff');
  const fillColor = ref('#f00');
  const emit = defineEmits(['updateAttribute', 'register']);
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
  ];
  const [registerModal, { closeModal, setModalProps }] = useModalInner((data) => {
    // console.log('弹窗获取属性', data);
    const _data = data.attr;
    if (_data.lineColor) {
      lineColor.value = _data.lineColor;
      delete _data.lineColor;
    } else {
      lineColor.value = '#3388ff';
    }
    if (_data.fillColor) {
      fillColor.value = _data.fillColor;
      delete _data.fillColor;
    } else {
      fillColor.value = '#3388ff';
    }
    setModalProps({ title: data.attr.name + '属性编辑' });
    attrToSchema(data.id, _data);
  });

  const [registerForm, { setFieldsValue, validateFields, appendSchemaByField }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  function attrToSchema(id: any, attr: any) {
    setFieldsValue({ id, name: attr.name, type: attr.type });
    for (const key in attr) {
      if (key !== 'name' && key !== 'type') {
        appendSchemaByField(
          {
            field: key,
            label: key,
            show: true,
            component: 'Input',
          },
          key,
        );
      }
    }
  }
  const handleSubmit = async () => {
    const values = await validateFields();
    console.log(values);
    closeModal();
    values.lineColor = lineColor.value;
    values.fillColor = fillColor.value;
    emit('updateAttribute', values);
    // console.log('弹窗保存属性', values);
  };
</script>
