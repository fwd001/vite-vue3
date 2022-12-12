<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'FwdDemo' })
</script>

<template>
  <div class="page-wrap">
    <span>test:</span>
    <span>{{ msg }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('message 0.3')
</script>
<style lang="less"></style>
