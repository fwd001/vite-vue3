import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import antd from '@/common/ant-design'
import mitt from '@/common/event-bus'
import { createPinia } from 'pinia'
import './style.less'
import '@/common/polyfill'
import '@/assets/css/public.less'
import '@/assets/css/common.less'
import Editor from '@tinymce/tinymce-vue'

const app = createApp(App)
app.component('TinymceEditor', Editor)
app.use(router)
app.use(createPinia())
app.use(antd)
app.use(mitt)

app.mount('#app')
