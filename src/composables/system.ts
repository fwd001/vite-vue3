import UAParser from 'ua-parser-js'

interface AppInfo {
  /** 项目名称 */
  name: string
  /** 项目标题 */
  title: string
  /** 项目描述 */
  desc: string
}

/** 项目信息 */
export function useAppInfo(): AppInfo {
  const { VITE_APP_NAME: name, VITE_APP_TITLE: title, VITE_APP_DESC: desc } = import.meta.env

  return {
    name,
    title,
    desc,
  }
}

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser()
  const result = parser.getResult()
  return result
}
