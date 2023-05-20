import type { App } from 'vue'
import Antd from 'ant-design-vue'

// https://www.antdv.com/docs/vue/getting-started-cn#按需加载
// import 'ant-design-vue/es/message/style/css' //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
// import 'ant-design-vue/es/notification/style/css'
// import 'ant-design-vue/es/modal/style/css'

export function setupAntd(app: App<Element>) {
  app.use(Antd)
  // 添加到全局
  // app.config.globalProperties.$antdIcons = antdIcons
}
