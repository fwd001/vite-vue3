<template>
  <PageWrapper dense contentFullHeight>
    <VFormDesign />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import VFormDesign from './components/VFormDesign/index.vue';

  defineOptions({
    name: 'Design',
  });
</script>

<style lang="less" scoped></style>
