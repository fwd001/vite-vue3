import type { App } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import '' // 插入上传图片插件

export function setupTinymce(app: App<Element>) {
  app.component('TinymceEditor', Editor)
  // 添加到全局
  // app.config.globalProperties.$antdIcons = antdIcons
}
