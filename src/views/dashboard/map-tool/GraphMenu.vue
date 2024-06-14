<template>
  <ClickOutSide
    @click-outside="hideContextMenu"
    class="menu-box"
    :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
  >
    <div class="menu-item" @click="emits('onEditLayerInfo', $event)">编辑</div>
    <div
      v-if="menuPosition.type === 'overlay' || menuPosition.type === 'military'"
      class="menu-item"
      @click="emits('onEditOverlay', $event)"
    >
      修改路径
    </div>
    <div
      v-if="menuPosition.type === 'marker'"
      class="menu-item"
      @click="emits('onMoveLayer', $event)"
    >
      移动
    </div>
    <div class="menu-item" @click="emits('onDeleteLayer', $event)">删除</div>
  </ClickOutSide>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue';
  import { ClickOutSide } from '@/components/ClickOutSide';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  // let map: any; // 总地图实例
  const emits = defineEmits(['onEditLayerInfo', 'onEditOverlay', 'onMoveLayer', 'onDeleteLayer']);

  const menuPosition = ref({
    top: -999,
    left: -999,
    type: 'marker',
  });
  function showContextMenu(x: number, y: number, type = 'marker') {
    menuPosition.value = { top: y, left: x, type: type };
  }
  function hideContextMenu() {
    if (menuPosition.value.top === -999) return;
    menuPosition.value = { top: -999, left: -999, type: 'marker' };
  }

  function mitterOn() {
    mitter.on(MEventEnum.ShowContextMenu, (data: { x: number; y: number; type?: string }) => {
      showContextMenu(data.x, data.y, data.type);
    });
    mitter.on(MEventEnum.HideContextMenu, () => {
      hideContextMenu();
    });
  }
  mitterOn();

  function mitterOff() {
    mitter.off(MEventEnum.ShowContextMenu);
    mitter.off(MEventEnum.HideContextMenu);
  }
  onBeforeUnmount(() => {
    mitterOff();
  });
</script>

<style lang="less" scoped>
  .menu-box {
    display: flex;
    position: absolute;
    z-index: 999;
    top: 39px;
    left: 30px;
    flex-direction: column;
    width: 80px;
    padding: 2px 0;
    border-radius: 3px;
    background-color: rgb(0 0 0 / 70%);
    color: #fff;

    .menu-item {
      padding-left: 5px;
      line-height: 1.7;
      cursor: pointer;

      &:hover {
        background-color: #0960bd;
      }
    }
  }
</style>
