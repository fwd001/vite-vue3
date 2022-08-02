import { globalConfig } from '@/config/index'

// 创建mockurl
const createMockUrl = (url = '') => {
  if (globalConfig?.isMock) {
    return `/api${url}`
  } else {
    return `/no-mock${url}`
  }
}
export { createMockUrl }
