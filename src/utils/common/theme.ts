import { EnumStorageKey } from '@/enum/common'

/**
 * 缓存主题颜色
 * @param color
 */
export function setThemeColor(color: string) {
  window.localStorage.setItem(EnumStorageKey['theme-color'], color)
}

/**
 * 获取缓存的主题颜色
 */
export function getThemeColor() {
  return window.localStorage.getItem(EnumStorageKey['theme-color'])
}

/**
 * 缓存语言
 * @param lang
 */
export function setLocale(lang: string) {
  window.localStorage.setItem('locale', lang)
}

/**
 * 获取缓存语言
 * @param lang
 */
export function getLocale() {
  return window.localStorage.getItem('locale')
}
