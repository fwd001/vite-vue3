// demo
import { haRequest } from '@/common/ha-http'

export const getAjxxSfbz = () => {
  return haRequest.request({
    url: '/es/ajxx/findAjSfbz/6309',
    method: 'get',
  })
}

export const apiList = (params: any) => {
  return haRequest.request({
    url: '/es/qwjs/queryInfo',
    method: 'post',
    data: Object.assign({}, params),
  })
}
