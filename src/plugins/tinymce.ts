import type { App } from 'vue'
import Editor from '@tinymce/tinymce-vue'

export function setupTinymce(app: App<Element>) {
  app.component('TinymceEditor', Editor)
}
