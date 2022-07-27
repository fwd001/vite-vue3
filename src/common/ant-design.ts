import type { App } from "vue";
import "ant-design-vue/es/message/style/css";

import * as antdIcons from "@ant-design/icons-vue";

export default {
  install: (app: App) => {
    // 添加到全局
    app.config.globalProperties.$antdIcons = antdIcons;
  },
};
