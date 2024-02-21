import { MockMethod } from 'vite-plugin-mock';
import { data as callbackResult } from './callback.api';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'lhcz',
      realName: 'LHCZ Admin',
      avatar: '',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}
export default [
  {
    url: '/dev-api/client/callback',
    statusCode: 200,
    method: 'get',
    response: () => {
      return callbackResult;
    },
  },
  {
    url: '/dev-api/client/logout',
    statusCode: 200,
    method: 'get',
    response: () => {
      return {};
    },
  },
] as MockMethod[];
