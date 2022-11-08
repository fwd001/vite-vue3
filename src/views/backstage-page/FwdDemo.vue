<template>
  <div class="fwd-demo-wrap">
    test:
    {{ msg }}
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({ name: 'FwdDemo' })
</script>
<script setup lang="ts">
  import { ref } from 'vue'
  const msg = ref('message 0.3')
</script>
<style lang="less">
  .fwd-demo-wrap {
    background-color: #fff;
    padding: 20px;
  }
</style>
