<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
defineOptions({
  name: 'App',
})

const locale = zhCN
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<style scoped></style>
