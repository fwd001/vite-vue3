<template>
  <ClickOutSide @click-outside="hideMenu" class="menu-box" :style="menuStyle">
    <div class="menu-item" @click="emitEditLayerInfo">编辑</div>
    <div
      v-if="menuType === 'overlay' || menuType === 'military'"
      class="menu-item"
      @click="emitEditOverlay"
    >
      修改路径
    </div>
    <div v-if="menuType === 'marker'" class="menu-item" @click="emitMoveLayer"> 移动 </div>
    <div class="menu-item" @click="emitDeleteLayer">删除</div>
  </ClickOutSide>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref, computed } from 'vue';
  import { ClickOutSide } from '@/components/ClickOutSide';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';

  // 菜单类型
  interface MenuType {
    top: number;
    left: number;
    type: 'marker' | 'overlay' | 'military' | string;
  }

  const emits = defineEmits<{
    (e: 'onEditLayerInfo', event: MouseEvent): void;
    (e: 'onEditOverlay', event: MouseEvent): void;
    (e: 'onMoveLayer', event: MouseEvent): void;
    (e: 'onDeleteLayer', event: MouseEvent): void;
  }>();

  // 菜单位置与类型
  const menu = ref<MenuType>({
    top: -999,
    left: -999,
    type: 'marker',
  });

  // 计算属性：菜单样式
  const menuStyle = computed(() => ({
    top: `${menu.value.top}px`,
    left: `${menu.value.left}px`,
  }));

  // 计算属性：菜单类型
  const menuType = computed(() => menu.value.type);

  // 显示菜单
  function showMenu(x: number, y: number, type: MenuType['type'] = 'marker') {
    menu.value = { top: y, left: x, type };
  }
  // 隐藏菜单
  function hideMenu() {
    if (menu.value.top === -999) return;
    menu.value = { top: -999, left: -999, type: 'marker' };
  }

  // 事件触发方法
  function emitEditLayerInfo(e: MouseEvent) {
    emits('onEditLayerInfo', e);
    hideMenu();
  }
  function emitEditOverlay(e: MouseEvent) {
    emits('onEditOverlay', e);
    hideMenu();
  }
  function emitMoveLayer(e: MouseEvent) {
    emits('onMoveLayer', e);
    hideMenu();
  }
  function emitDeleteLayer(e: MouseEvent) {
    emits('onDeleteLayer', e);
    hideMenu();
  }

  // mitt 事件注册
  function registerMitt() {
    mitter.on(
      MEventEnum.ShowContextMenu,
      (data: { x: number; y: number; type?: MenuType['type'] }) => {
        showMenu(data.x, data.y, data.type);
      },
    );
    mitter.on(MEventEnum.HideContextMenu, hideMenu);
  }
  registerMitt();

  // mitt 事件注销
  function unregisterMitt() {
    mitter.off(MEventEnum.ShowContextMenu);
    mitter.off(MEventEnum.HideContextMenu);
  }
  onBeforeUnmount(unregisterMitt);
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
