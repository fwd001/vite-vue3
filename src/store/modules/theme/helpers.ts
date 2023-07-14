// import type { GlobalThemeOverrides } from 'naive-ui'
import { cloneDeep } from 'lodash-es'
import { themeSetting } from '@/settings'
import { EnumStorageKey } from '@/enum'
import { getThemeColor, getColorPalette, setLocal, getLocal, removeLocal } from '@/utils'

/** 初始化主题配置 */
export function initThemeSettings() {
  const isProd = import.meta.env.PROD
  // 生产环境才缓存主题配置，本地开发实时调整配置更改配置的json
  const storageSettings = getThemeSettings()
  if (isProd && storageSettings) {
    return storageSettings
  }

  const themeColor = getThemeColor() || themeSetting.themeColor
  const info = themeSetting.isCustomizeInfoColor
    ? themeSetting.otherColor.info
    : getColorPalette(themeColor, 7)
  const otherColor = { ...themeSetting.otherColor, info }
  const setting = cloneDeep({ ...themeSetting, themeColor, otherColor })
  return setting
}

/** 获取naive的主题颜色 */
// export function getNaiveThemeOverrides(colors: Record<ColorType, string>): GlobalThemeOverrides {
//   const { primary, success, warning, error } = colors

//   const info = themeSetting.isCustomizeInfoColor ? colors.info : getColorPalette(primary, 7)

//   const themeColors = getThemeColors([
//     ['primary', primary],
//     ['info', info],
//     ['success', success],
//     ['warning', warning],
//     ['error', error],
//   ])

//   const colorLoading = primary

//   return {
//     common: {
//       ...themeColors,
//     },
//     LoadingBar: {
//       colorLoading,
//     },
//   }
// }

/** 获取缓存中的主题配置 */
function getThemeSettings() {
  return getLocal<Theme.Setting>(EnumStorageKey['theme-settings'])
}

/** 获取缓存中的主题配置 */
export function setThemeSettings(settings: Theme.Setting) {
  return setLocal(EnumStorageKey['theme-settings'], settings)
}

/** 清除缓存配置 */
export function clearThemeSettings() {
  removeLocal(EnumStorageKey['theme-settings'])
}
