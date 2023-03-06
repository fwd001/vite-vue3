/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'ant-design-vue'
import { isString } from '@/utils/is/'
import { isUrl } from '@/utils/util'
import { setObjToUrlParams } from '@/utils/urlUtils'
import { RequestEnum, ContentTypeEnum } from '@/enum/httpEnum'
import { joinTimestamp, formatRequestDate } from './helper'
import { AxiosTransform } from './axiosTransform'
import type { Result, RequestOptions } from './types'
import { useUserStore } from 'store'

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      isShowErrorMessage = true,
    } = options
    const isUrlStr = isUrl(config.url as string)

    config.isShowErrorMessage = isShowErrorMessage

    if (!isUrlStr && joinPrefix) {
      config.url = `${config.url}`
    }

    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (config.headers?.['Content-Type'] === ContentTypeEnum.FORM_DATA) {
          config.data = data
          config.params = params
        } else {
          if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
            config.data = data
            config.params = params
          } else {
            config.data = params
            config.params = undefined
          }
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }

    return config
  },
}

class Request {
  // axios 实例
  public instance: AxiosInstance
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = {
    baseURL: '',
    timeout: 60000,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
  }

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 一般会请求拦截里面加token
        const token = sessionStorage.getItem('token') || ''
        config.headers!.Authorization = token
        return config
      },
      (err: any) => {
        return Promise.reject(err)
      },
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code = '0', msg = '服务发生错误！' } = response.data
        // token 失效
        if (code === 'AU0000') {
          if (import.meta.env.DEV) {
            const store = useUserStore()
            store.logout()
            throw response.data
          }
          location.href = import.meta.env.VITE_AUTHORIZE_HREF
        }
        // 业务错误处理
        if (code !== '0') {
          if (response.config.isShowErrorMessage) {
            message.error(msg)
          }
          return Promise.reject(response.data)
        }
        // 二进制文件流响应处理
        if (response.config.responseType === 'blob') {
          const encodeFileName = response.headers['content-disposition']
            ?.split(';')?.[1]
            ?.split('=')?.[1]
          const type = response.headers['content-type'] as string
          const fileName = decodeURIComponent(encodeFileName)

          if (encodeFileName) {
            return {
              msg: '成功',
              code,
              data: {
                fileName,
                type,
                blob: response.data,
              },
            }
          } else {
            throw response
          }
        }

        // 直接返回res，当然你也可以只返回res.data
        return response.data
      },
      (err: any) => {
        // 这里用来处理http常见错误，进行全局提示
        let msg = '网络连接失败！'
        switch (err?.response?.status) {
          case 400:
            msg = '请求错误(400)'
            break
          case 401:
            msg = '未授权，请重新登录(401)'
            // 这里可以做清空storage并跳转到登录页的操作
            break
          case 403:
            msg = '拒绝访问(403)'
            break
          case 404:
            msg = '请求出错(404)'
            break
          case 408:
            msg = '请求超时(408)'
            break
          case 500:
            msg = '服务器错误(500)'
            break
          case 501:
            msg = '服务未实现(501)'
            break
          case 502:
            msg = '网络错误(502)'
            break
          case 503:
            msg = '服务不可用(503)'
            break
          case 504:
            msg = '网络超时(504)'
            break
          case 505:
            msg = 'HTTP版本不受支持(505)'
            break
          default:
            msg = `连接出错(${err.response?.status || '500'})!`
        }
        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        message.error(msg)
        return Promise.reject(err.response)
      },
    )
  }

  // 定义请求方法
  public request<T = any>(
    config: AxiosRequestConfig,
    options: RequestOptions = {},
  ): Promise<Result<T>> {
    const cf = transform.beforeRequestHook?.(config, options) || {}
    return this.instance.request(cf)
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.delete(url, config)
  }
}

export default Request
