<template>
  <div class="layout-nav-box flex flex-col">
    <a-menu
      class="menu-box fx-base-1"
      style="padding-top: 12px"
      mode="inline"
      theme="light"
      :selectable="false"
      :inline-collapsed="props.collapsed"
      :inline-indent="24"
      :open-keys="openKeys"
      @click="menuClick">
      <template v-for="menu in navPowerList">
        <a-sub-menu v-if="menu?.children?.length" :key="`${menu.path}`">
          <template #icon>
            <component :is="menu.icon" />
          </template>
          <template #title>
            <span>{{ menu.name }}</span>
          </template>
          <a-menu-item
            v-for="sub in menu.children"
            :key="sub.path"
            :class="['ant-menu-item', { 'ant-menu-item-selected': route.path.includes(sub.path) }]">
            {{ sub.name }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          v-else
          :key="menu.path"
          :class="['ant-menu-item', { 'ant-menu-item-selected': route.path.includes(menu.path) }]">
          <template #icon>
            <component :is="menu.icon" />
          </template>
          <span>{{ menu.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
// import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { globalConfig } from '@/config'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useUserStore } from 'store'

const userStore = useUserStore()

// const { mixinPower } = useGlobalSetup();
const route = useRoute()
const router = useRouter()

interface Props {
  collapsed?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const defaultOpenKeys = ['groupon']
// const emit = defineEmits(['toggleCollapsed'])

// 只有第一次创建的时候需要自动获取当前展开的菜单 后续以用户操作为准
let pathname = location.pathname
let openKey = pathname.split('/')[1]

const openKeys = ref(defaultOpenKeys.includes(openKey) ? [openKey] : defaultOpenKeys)

const navPowerList = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let newArr: any[] = []
  globalConfig.navList.forEach((val) => {
    if (!val?.children?.length) {
      const powerType = Object.prototype.toString.call(val.power)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let powerList: any = []
      if (powerType === '[object Array]') {
        powerList = val.power
      } else {
        powerList.push(val.power)
      }
      for (let power of powerList) {
        if (!power || userStore.hasPowerbyKey?.(power)) {
          // 不需要权限或者有其中一个权限则有权限
          newArr.push(Object.assign({}, val))
        }
      }
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let children = val.children.filter((item: any) => {
      const powerType = Object.prototype.toString.call(item.power)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let powerList: any = []
      if (powerType === '[object Array]') {
        powerList = item.power
      } else {
        powerList.push(item.power)
      }
      let hasPower = false
      for (let power of powerList) {
        if (!power || userStore.hasPowerbyKey?.(power)) {
          // 不需要权限或者有其中一个权限则有权限
          hasPower = true
          break
        }
      }
      return hasPower
    })
    if (children.length) {
      let newVal = Object.assign({}, val)
      newVal.children = children
      newArr.push(newVal)
    }
  })

  return newArr
})

// 菜单点击
const menuClick = (info: { key: string }) => {
  if (route.path !== info.key) {
    router.push({
      path: info.key,
    })
  }
}
</script>
<style lang="less" scoped>
.layout-nav-box {
  background: @bg-main;
  height: 100vh;
  width: 180px;
}
</style>
