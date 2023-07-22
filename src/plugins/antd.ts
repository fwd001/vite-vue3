import type { App } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
export function setupAntd(app: App<Element>) {
  // eslint-disable-next-line no-console
  console.log('app', app)

  // 添加到全局
  // app.config.globalProperties.$antdIcons = antdIcons
}
