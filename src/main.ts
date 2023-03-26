import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router/index'
import { setupMitt } from '@/utils/event-bus'
import { setupStore } from 'store'
import { setupAntd, setupAssets, setupTinymce, setupUpdater, setupDirectives } from '@/plugins'
import './style.less'
import '@/utils/polyfill'

const app = createApp(App)

function setupPlugins() {
  // 注册全局常用的 ant-design-vue 组件
  setupAntd(app)
  // 引入静态资源
  setupAssets()
  // 自定义指令
  setupDirectives(app)
  // 编辑器
  setupTinymce(app)
  // 初始化事件总线
  setupMitt(app)
  // 前端发布通知
  setupUpdater()
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app)
  // 挂载路由
  await setupRouter(app)

  app.mount('#app')
}

setupPlugins()

setupApp()
