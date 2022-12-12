// demo
import { http } from '@/utils/http/http'

export const getAjxxSfbz = () => {
  return http.request({
    url: '/es/ajxx/findAjSfbz/6309',
    method: 'get',
  })
}

export const apiList = (params: { query: string }) => {
  return http.request({
    url: '/es/qwjs/queryInfo',
    method: 'post',
    data: Object.assign({}, params),
  })
}
