<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UserLayout',
})
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
}
</style>
