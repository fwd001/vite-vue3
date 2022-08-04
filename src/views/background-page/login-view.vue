<script setup lang="ts">
  // import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from 'store/index'
  const userStore = useUserStore()
  const router = useRouter()

  const updataUser = () => {
    userStore.updataUser('login,名字')
  }
  const toWelecomView = () => {
    router.push({ path: '/backstage/welcome' })
  }
</script>

<template>
  <div>登陆</div>

  <p>测试页面,</p>
  <button @click="updataUser">修改</button>

  <button @click="toWelecomView">toWelecomView</button>
  <h2>{{ userStore.name }}</h2>
  <h2>{{ userStore.nameLength }}</h2>
</template>

<style scoped></style>
