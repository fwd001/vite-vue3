import { defineComponent, reactive, ref, getCurrentInstance } from 'vue';
import { Modal } from 'ant-design-vue';
import type { IFormConfig } from '../../typings/v-form-component';
import type { IAnyObject } from '../../typings/base-type';
import type { IVFormMethods } from '../../hooks/useVFormMethods';
import type { IToolbarMethods } from '../../typings/form-type';
import VFormCreate from '../VFormCreate/index.vue';
import { formatRules } from '../../utils';
import JsonModal from '../VFormDesign/components/JsonModal.vue';

export default defineComponent({
  name: 'VFormPreview',
  components: {
    JsonModal,
    VFormCreate,
    Modal,
  },
  setup() {
    const instance = getCurrentInstance();
    const jsonModal = ref<IToolbarMethods | null>(null);

    const state = reactive<{
      formModel: IAnyObject;
      visible: boolean;
      formConfig: IFormConfig;
      fApi: IVFormMethods;
    }>({
      formModel: {},
      formConfig: {} as IFormConfig,
      visible: false,
      fApi: {} as IVFormMethods,
    });

    /**
     * 显示Json数据弹框
     * @param jsonData
     */
    const showModal = (jsonData: IFormConfig) => {
      formatRules(jsonData.schemas);
      state.formConfig = jsonData as any;
      state.visible = true;
    };

    /**
     * 获取表单数据
     * @return {Promise<void>}
     */
    const handleCancel = () => {
      state.visible = false;
      state.formModel = {};
    };

    const handleGetData = async () => {
      const _data = await state.fApi.submit?.();
      jsonModal.value?.showModal?.(_data);
    };

    const onSubmit = (_data: IAnyObject) => {
      // 提交处理逻辑
    };

    // 暴露方法给外部调用
    if (instance) {
      instance.exposed = {
        showModal,
        jsonModal,
      };
    }

    return () => (
      <Modal
        title="预览(支持布局)"
        open={state.visible}
        onOk={handleGetData}
        onCancel={handleCancel}
        okText="获取数据"
        cancelText="关闭"
        style="top: 20px"
        destroyOnClose={true}
        width={900}
      >
        <VFormCreate
          formConfig={state.formConfig as any}
          v-model:fApi={state.fApi}
          v-model:formModel={state.formModel}
          onSubmit={onSubmit}
        >
          {{
            slotName: ({ formModel, field }: { formModel: IAnyObject; field: string }) => (
              <a-input placeholder="我是插槽传递的输入框" v-model:value={formModel[field]} />
            ),
          }}
        </VFormCreate>
        <JsonModal ref={jsonModal} />
      </Modal>
    );
  },
});
