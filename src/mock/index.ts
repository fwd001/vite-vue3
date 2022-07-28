import { globalConfig } from "@/config/index";

// 创建mockurl
const createMockUrl = (url: string = "") => {
  if (globalConfig?.isMock) {
    return `/api${url}`;
  } else {
    return `/no-mock${url}`;
  }
};
export { createMockUrl };
