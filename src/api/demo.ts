// demo
import { haRequest } from '@/utils/http'

export const getAjxxSfbz = () => {
  return haRequest.request({
    url: '/es/ajxx/findAjSfbz/6309',
    method: 'get',
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiList = (params: any) => {
  return haRequest.request({
    url: '/es/qwjs/queryInfo',
    method: 'post',
    data: Object.assign({}, params),
  })
}
