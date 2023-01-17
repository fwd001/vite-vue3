/* eslint-disable @typescript-eslint/no-explicit-any */
import 'axios'
/**
 * 自定义扩展axios模块
 * @author Maybe
 */
declare module 'axios' {
  // interface AxiosRequestConfig {}
  interface AxiosHeaders {
    Authorization?: string
    'Content-Type'?: string
  }
  interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }

  type Recordable<T = any> = Record<string, T>
}
