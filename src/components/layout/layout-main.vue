<!-- 为所有页面套个壳，处理公共逻辑 -->
<template>
  <div class="layout-main-box fx">
    <LayoutNav
      class="content-nav fx-n"
      :collapsed="collapsed"
      @toggle-collapsed="toggleCollapsed"
    />
    <div class="content-box fx fx-0-1 fx-v">
      <LayoutHeader class="fx-n"></LayoutHeader>

      <div class="content-view-box flex-basis-1">
        <!-- 优先加载完用户权限和用户信息，再加载页面 -->
        <div v-if="isReady" id="content-view" class="content-view">
          <a-spin :spinning="false">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </a-spin>
        </div>
      </div>
    </div>

    <!-- 复制占位input -->
    <input id="copyContentEle" class="copy-input" type="text" :value="copyContent" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'Main'
  })
</script>
<script lang="ts" setup>
  import LayoutNav from '@/components/layout/layout-nav.vue'
  import LayoutHeader from '@/components/layout/layout-header.vue'
  import { RouterView } from 'vue-router'
  import { getQueryString } from '@/common'
  import { computed, onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { globalConfig } from '@/config'

  // 侧边菜单栏是否为mini开关
  const collapsed = ref(false)
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  const loadMask = computed(() => {
    return false
  })
  const loadOpacity = computed(() => {
    return false
  })

  const copyContent = computed(() => {
    return false
  })

  const isReady = computed(() => {
    return true
  })

  onBeforeMount(async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  })
</script>

<style lang="less" scoped>
  @import url('@/assets/css/theme.less');
  .layout-main-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: @bg-tint;
  }
  .content-nav {
    height: 100%;
  }
  .content-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .content-view-box {
    position: relative;
    // padding-left: 15px;
    padding-right: 0;
    overflow: hidden;
  }
  .content-view {
    width: 100%;
    height: 100%;
    // padding: 15px 15px 15px 0;
    overflow: auto;
  }

  .copy-input {
    position: fixed;
    top: -200px;
    left: 0;
  }
</style>
