import { FileSearchOutlined, HomeOutlined, MacCommandOutlined } from '@ant-design/icons-vue'
import { Recordable } from '@/types'
import { FunctionalComponent } from 'vue'
import type { AntdIconProps } from '@ant-design/icons-vue/es/components/AntdIcon'

export type NavItem = {
  name: string
  path: string
  icon?: FunctionalComponent<AntdIconProps>
  power?: string | string[]
  children?: NavItem[]
}

const navList: NavItem[] = [
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
      },
    ],
  },
]

// 将路由转为一个map 方便根据path查找路由的权限等信息
const navPathMap: Recordable<NavItem> = {}

const setNavMap = (navList: NavItem[]) => {
  navList.forEach((nav) => {
    navPathMap[nav.path] = nav
    if (nav.children) {
      setNavMap(nav.children)
    }
  })
}
setNavMap(navList)

export { navPathMap, navList }
