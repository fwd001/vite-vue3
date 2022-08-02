<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'App'
  })
</script>

<script lang="ts" setup>
  // import enUS from 'ant-design-vue/es/locale/en_US';
  import zhCN from 'ant-design-vue/es/locale/zh_CN'

  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-cn'
  dayjs.locale('cn')

  const locale = zhCN
</script>

<template>
  <a-config-provider :locale="locale">
    <div id="app-wrap">
      <router-view></router-view>
      <!-- <LayoutMain></LayoutMain> -->
    </div>
  </a-config-provider>
</template>

<style scoped>
  #app-wrap {
    width: 100vw;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
