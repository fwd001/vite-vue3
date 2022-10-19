<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'App',
  })
</script>

<script lang="ts" setup>
  import zhCN from 'ant-design-vue/es/locale/zh_CN'
  import dayjs from 'dayjs'
  dayjs.locale('cn')

  const locale = zhCN
</script>

<template>
  <a-config-provider :locale="locale">
    <div id="app-wrap">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<style scoped>
  #app-wrap {
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
