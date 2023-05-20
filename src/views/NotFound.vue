<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NotFound',
})
const router = useRouter()
function goBackHome() {
  router.replace('/')
}
</script>

<template>
  <a-result class="not-found-wrap" status="404" title="404" sub-title="抱歉，您访问的页面不存在。">
    <template #extra>
      <a-button type="primary" @click="goBackHome">返回首页</a-button>
    </template>
  </a-result>
</template>

<style lang="less" scoped></style>
