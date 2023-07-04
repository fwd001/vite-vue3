// mock demo
import { MockMethod } from 'vite-plugin-mock'
// 使⽤⾃⼰的返回数据，可以不⽤引⼊mockjs:http://mockjs.com/examples.html
import Mock from 'mockjs'
import { createMockUrl } from './tool'

const demoMock: MockMethod[] = [
  {
    url: createMockUrl('/v1/list'),
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '成功',
        data: Mock.mock({
          total: 90,
          pages: 5,
          pageSize: 20,
          'list|20': [
            {
              id: '@id',
              title: '@csentence(8, 12)',
              dataSoruce: '@string(11)',
              context: '@cparagraph(3, 4)',
            },
          ],
        }),
      }
    },
  },

  {
    url: createMockUrl('/es/qwjs/queryInfo'),
    method: 'post',
    response: () => {
      return {
        code: '0',
        message: '成功',
        data: Mock.mock({
          total: 90,
          pages: 5,
          pageSize: 20,
          data: {
            id: '@id',
            title: '@csentence(8, 12)',
            dataSoruce: '@string(11)',
            context: '@cparagraph(3, 4)',
          },
        }),
      }
    },
  },
]

export default demoMock
