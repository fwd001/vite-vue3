<template>
  <div class="layout-nav-box fx fx-v">
    <div class="nav-top fx fx-justify-center fx-align-center">
      <div class="nav-top-logo fx-1">
        <span v-if="!props.collapsed" class="logo-box">xxms</span>
      </div>
      <MenuUnfoldOutlined
        v-if="props.collapsed"
        :class="['collapsed-icon fx-n', { 'collapsed-icon-hide': props.collapsed }]"
        @click="() => emit('toggleCollapsed')" />
      <MenuFoldOutlined
        v-else
        :class="['collapsed-icon fx-n', { 'collapsed-icon-hide': props.collapsed }]"
        @click="() => emit('toggleCollapsed')" />
    </div>
    <a-menu
      class="menu-box fx-base-1"
      mode="inline"
      theme="dark"
      :selectable="false"
      :inline-collapsed="props.collapsed"
      :inline-indent="24"
      :default-open-keys="openKeys"
      @click="menuClick">
      <template v-for="menu in navPowerList">
        <a-menu-item
          v-if="!menu.children"
          :key="`${menu.path}`"
          :class="[{ 'ant-menu-item-selected': $route.path.includes(menu.path) }]">
          <template #icon>
            <component :is="proxy?.$antdIcons[menu.icon]" />
          </template>
          <span>{{ menu.name }}</span>
        </a-menu-item>
        <a-sub-menu v-else :key="menu.path">
          <template #icon>
            <component :is="proxy?.$antdIcons[menu.icon]" />
          </template>
          <template #title>
            <span>{{ menu.name }}</span>
          </template>
          <a-menu-item
            v-for="sub in menu.children"
            :key="sub.path"
            :class="[{ 'ant-menu-item-selected': $route.path.includes(sub.path) }]">
            {{ sub.name }}
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
  import { globalConfig } from '@/config'
  import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, getCurrentInstance, withDefaults } from 'vue'

  // const { mixinPower } = useGlobalSetup();
  const route = useRoute()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { proxy }: any = getCurrentInstance()

  interface Props {
    collapsed?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
  })
  const emit = defineEmits(['toggleCollapsed'])

  // 只有第一次创建的时候需要自动获取当前展开的菜单 后续以用户操作为准
  let hash = location.hash
  let openKey = hash.split('/')[1]

  const openKeys = ref(openKey ? [openKey] : [])

  const navPowerList = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newArr: any[] = []
    globalConfig.navList.forEach((val) => {
      if (!val.children) {
        newArr.push(Object.assign({}, val))
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
          if (!power) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menuClick = (info: any) => {
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
  }

  .menu-box {
    overflow: auto;
  }
  .nav-top {
    width: 100%;
    height: 44px;
    font-size: 20px;
    line-height: 44px;
    .nav-top-logo {
      padding-left: 16px;
      .logo-box {
        width: 72px;
        font-size: 18px;
        color: #fff;
      }
    }
    .collapsed-icon {
      position: relative;
      left: -4px;
      width: 20px;
      height: 20px;
      font-size: 18px;
      color: #fff;
      transition: left 500ms 100ms;
    }
    .collapsed-icon-hide {
      left: -29px;
    }
  }
</style>
