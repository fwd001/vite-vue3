<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from 'ant-design-vue'

defineOptions({
  name: 'App',
})

const locale = zhCN
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: theme.defaultAlgorithm,
      token: {
        // colorPrimary: '#00b96b',
      },
      components: {
        Button: {
          colorPrimary: '#00b96b',
        },
      },
    }"
    :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<style scoped></style>
