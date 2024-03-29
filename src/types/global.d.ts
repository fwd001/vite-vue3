//声明window上自定义属性
declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventBus: any
}

/** 通用类型 */
declare namespace Common {
  /**
   * 策略模式
   * [状态, 为true时执行的回调函数]
   */
  type StrategyAction = [boolean, () => void]
}

/** 构建时间 */
declare const PROJECT_BUILD_TIME: string
