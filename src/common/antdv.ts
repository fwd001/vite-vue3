/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConfigProvider,
  Button,
  DatePicker,
  Dropdown,
  Menu,
  Tooltip,
  Tag,
  Cascader,
  Form,
  Select,
  SelectOption,
  Input,
  Row,
  Col,
  Popover,
  TimePicker,
  Radio,
  Modal,
} from 'ant-design-vue';
import type { App } from 'vue';
import 'ant-design-vue/es/message/style';
import 'ant-design-vue/es/modal/style';

import * as antdIcons from '@ant-design/icons-vue';

const antdInit = (app: App) => {
  app.use(DatePicker);
  app.use(Button);
  app.use(Dropdown);
  app.use(Menu);
  app.use(Tooltip);
  app.use(Tag);
  app.use(Cascader);
  app.use(Form);
  app.use(Select);
  app.use(SelectOption);
  app.use(Input);
  app.use(Row);
  app.use(Col);
  app.use(Popover);
  app.use(ConfigProvider);
  app.use(TimePicker);
  app.use(Radio);
  app.use(Modal);
};

export default {
  install: (app: App) => {
    antdInit(app);
    // 添加到全局
    app.config.globalProperties.$antdIcons = antdIcons;
  },
};
