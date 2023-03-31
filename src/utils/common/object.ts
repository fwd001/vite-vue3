/* eslint-disable @typescript-eslint/no-explicit-any */
/** 设置对象数据 */
export function objectAssign<T extends Record<string, any>>(target: T, source: Partial<T>) {
  Object.assign(target, source)
}
