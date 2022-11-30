import { FileSearchOutlined, HomeOutlined, MacCommandOutlined } from '@ant-design/icons-vue'
const navList = [
  {
    name: '首页',
    path: '/index',
    icon: HomeOutlined,
  },
  {
    name: '查询',
    path: '/keywords',
    icon: FileSearchOutlined,
  },
  {
    name: '分组管理',
    path: 'groupon',
    icon: MacCommandOutlined,
    children: [
      {
        name: 'fwd-demo',
        path: '/groupon/fwd-demo',
        power: '',
      },
    ],
  },
]

// 将路由转为一个map 方便根据path查找路由的权限等信息
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navPathMap: any = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setNavMap = (arr: any[]) => {
  arr.forEach((nav) => {
    navPathMap[nav.path] = nav
    if (nav.children) {
      setNavMap(nav.children)
    }
  })
}
setNavMap(navList)

export { navPathMap, navList }
