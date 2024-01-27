import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';
import Mock from 'mockjs';

export default [
  {
    url: '/basic-api/es/qwjs/queryInfo',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess(
        Mock.mock({
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
      );
    },
  },
] as MockMethod[];
