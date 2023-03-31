// demo
import { http } from '@/utils'
import { RequestEnum } from '@/enum'

export const getAjxxSfbz = () => {
  return http.request({
    url: '/es/ajxx/findAjSfbz/6309',
    method: RequestEnum.GET,
  })
}

export const apiList = (params: { query: string }) => {
  return http.request({
    url: '/es/qwjs/queryInfo',
    method: RequestEnum.POST,
    data: params,
  })
}
