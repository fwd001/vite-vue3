/**
 * 数据处理类，可以根据项目自行配置
 */
import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions } from './types'

export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig
}
