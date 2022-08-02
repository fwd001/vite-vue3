// mock demo
import { MockMethod } from 'vite-plugin-mock'
// 使⽤⾃⼰的返回数据，可以不⽤引⼊mockjs:http://mockjs.com/examples.html
import Mock, { Random } from 'mockjs'
import { createMockUrl } from './index'

const demoMock: MockMethod[] = [
  {
    url: createMockUrl('/es/qwjs/queryInfo'),
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '成功',
        data: Mock.mock({
          total: 90,
          pages: 5,
          pageSize: 20,
          'rows|20': [
            {
              sfbz: '@id',
              title: '@csentence(8, 12)',
              dataSoruce: '@string(11)',
              context: '@cparagraph(3, 4)'
            }
          ]
        })
      }
    }
  }
]

export default demoMock
