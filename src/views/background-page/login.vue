<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserStore } from '@/store/index'
  const userStore = useUserStore()

  const updataUser = () => {
    userStore.updataUser('login,名字')
  }
</script>

<template>
  <div>登陆</div>

  <p>测试页面,</p>
  <button @click="updataUser">修改</button>

  <h2>{{ userStore.name }}</h2>
  <h2>{{ userStore.nameLength }}</h2>
</template>

<style scoped></style>
