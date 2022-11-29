<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'UserLayout',
  components: {},
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
}
</style>
