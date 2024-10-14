import {
  App,
  notification as gNotification,
  message as gMessage,
  Modal as gModal,
} from 'ant-design-vue';

import type { ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { isString } from '@/utils/is';

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

export function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled class="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled class="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled class="modal-icon-info" />;
  } else {
    return <CloseCircleFilled class="modal-icon-error" />;
  }
}

export function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div innerHTML={`<div>${content as string}</div>`}></div>;
  } else {
    return content;
  }
}

const getBaseOptions = () => {
  return {
    okText: '确认',
    centered: true,
  };
};

export function createModalOptions(
  options: ModalOptionsPartial,
  icon: string,
): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

gNotification.config({
  placement: 'topRight',
  duration: 3,
});

/**
 * @description: message setup环境使用
 */
export function useMessage() {
  const { message = gMessage, modal = gModal, notification = gNotification } = App.useApp() || {};

  /**^
   * @description: Create confirmation box
   */
  function createConfirm(options: ModalOptionsEx) {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt: ModalFuncProps = {
      centered: true,
      icon: getIcon(iconType),
      ...options,
      content: renderContent(options),
    };
    return modal?.confirm(opt);
  }

  function createSuccessModal(options: ModalOptionsPartial) {
    return modal.success(createModalOptions(options, 'success'));
  }

  function createErrorModal(options: ModalOptionsPartial) {
    return modal.error(createModalOptions(options, 'error'));
  }

  function createInfoModal(options: ModalOptionsPartial) {
    return modal.info(createModalOptions(options, 'info'));
  }

  function createWarningModal(options: ModalOptionsPartial) {
    return modal.warning(createModalOptions(options, 'warning'));
  }
  return {
    message,
    notification,
    modal,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}

/**
 * @description: message 非setup环境使用
 */
export function useMessageWithOut() {
  const notification = gNotification;
  const modal = gModal;
  const message = gMessage;
  function createSuccessModal(options: ModalOptionsPartial) {
    return modal.success(createModalOptions(options, 'success'));
  }
  /**^
   * @description: Create confirmation box
   */
  function createConfirm(options: ModalOptionsEx) {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt: ModalFuncProps = {
      centered: true,
      icon: getIcon(iconType),
      ...options,
      content: renderContent(options),
    };
    return modal?.confirm(opt);
  }

  function createErrorModal(options: ModalOptionsPartial) {
    return modal.error(createModalOptions(options, 'error'));
  }

  function createInfoModal(options: ModalOptionsPartial) {
    return modal.info(createModalOptions(options, 'info'));
  }

  function createWarningModal(options: ModalOptionsPartial) {
    return modal.warning(createModalOptions(options, 'warning'));
  }
  return {
    message,
    notification,
    modal,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
