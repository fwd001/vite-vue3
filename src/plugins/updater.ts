/**
 * 前端项目发布更新通知
 */
import { h } from 'vue'
import { notification, Button } from 'ant-design-vue'
import { mitter } from '@/plugins/event-bus'
import { MEventEnum } from '@/enum/mitter'

interface Options {
  time?: number
}

class Updater {
  // 存储第一次值也就是script 的hash 信息
  oldScript: string[]
  // 获取新的值 也就是新的script 的hash信息
  newScript: string[]
  timer?: NodeJS.Timer
  constructor(options?: Options) {
    this.oldScript = []
    this.newScript = []
    // 初始化
    this.init()
    //轮询
    this.timing(options?.time)
  }

  async init() {
    const html: string = await this.getHtml()
    this.oldScript = this.parserScript(html)
  }

  async getHtml() {
    const html = await fetch('/').then((res) => res.text()) // 读取index html
    return html
  }

  parserScript(html: string) {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi) // script正则
    return html.match(reg) as string[] // 匹配script标签
  }

  compare(oldArr: string[], newArr: string[]) {
    const base = oldArr.length
    const arr = Array.from(new Set(oldArr.concat(newArr)))
    // 如果新旧 length 一样无更新
    if (arr.length === base) {
      mitter.emit(MEventEnum.PageNoUpdate)
    } else {
      // 否则通知更新
      mitter.emit(MEventEnum.PageUpdate)
    }
  }

  timing(time = 10000) {
    // 轮询
    this.timer = setInterval(async () => {
      const newHtml = await this.getHtml()
      this.newScript = this.parserScript(newHtml)
      this.compare(this.oldScript, this.newScript)
    }, time)
  }
  offNotification() {
    clearInterval(this.timer)
    this.timer = undefined
  }
}

export function setupUpdater() {
  if (import.meta.env.VITE_RELEASE_NOTICE === 'false') return
  const time = isNaN(Number(import.meta.env.VITE_RELEASE_DETECTION_DURATION))
    ? undefined
    : Number(import.meta.env.VITE_RELEASE_DETECTION_DURATION)
  // 实例化该类
  const up = new Updater({
    time: time,
  })
  const key = `update-${Date.now()}`
  const notifiWidth = 180

  //  mitter.on(MEventEnum.PageNoUpdate, () => {
  //    console.log('未更新')
  //  })

  mitter.on(MEventEnum.PageUpdate, () => {
    notification.open({
      message: '通知',
      description: '页面有更新！',
      duration: 0,
      key,
      placement: 'bottomRight',
      style: {
        width: `${notifiWidth}px`,
      },
      onClose: () => {
        up.offNotification()
      },
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => {
              location.reload()
            },
          },
          { default: () => '刷新' },
        ),
    })
  })
}
