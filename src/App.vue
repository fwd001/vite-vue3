<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from 'ant-design-vue'
import { useConfigStore } from '@/store'
import axios from 'axios'
import { useRequest } from 'vue-request'

defineOptions({
  name: 'App',
})

const locale = zhCN

const configStore = useConfigStore()
// 获取config.json
const { loading: configLoading } = useRequest(
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE}config.json`)
    return res.data
  },
  {
    onSuccess(res) {
      configStore.setConfig(res)
    },
  },
)
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
    <router-view v-if="!configLoading"></router-view>
  </a-config-provider>
</template>

<style scoped></style>
