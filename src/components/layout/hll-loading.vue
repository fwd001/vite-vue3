<template>
  <span class="hll-loading">
    <span class="loading-icon"></span>
    <span class="loading-circle"></span>
  </span>
</template>

<style lang="less" scoped>
  .hll-loading {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    .loading-icon {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('@/assets/img/loading_icon.png') no-repeat;
      background-size: 100%;
    }
    .loading-circle {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('@/assets/img/loading_circle.png') no-repeat center;
      background-size: 86%;
      animation: hll-ani-loading 1s infinite linear;
    }
    @keyframes hll-ani-loading {
      0% {
        transform: rotate(0deg);
        transform-origin: center;
      }
      100% {
        transform: rotate(359deg);
        transform-origin: center;
      }
    }
  }
</style>
