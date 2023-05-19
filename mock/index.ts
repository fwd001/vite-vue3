const isMock = false

// 创建mockurl
const createMockUrl = (url = '') => {
  if (isMock) {
    return `/api${url}`
  } else {
    return `/no-mock${url}`
  }
}
export { createMockUrl }
