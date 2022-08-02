const navList = [
  {
    name: '首页',
    path: '/welcome',
    icon: 'HomeOutlined'
  },
  {
    name: '杨j需求',
    path: '/yj',
    icon: 'BoxPlotOutlined'
  },
  {
    name: '分组管理',
    path: 'groupon',
    icon: 'ShopOutlined',
    children: [
      {
        name: '网格仓信息管理',
        path: '/groupon/warehouse',
        power: 'warehouse.page.list'
      },
      {
        name: 'fwd-demo',
        path: '/groupon/fwd-demo',
        power: ''
      },
      {
        name: 'leyong-demo',
        path: '/groupon/leyong-demo',
        power: ''
      }
    ]
  }
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
