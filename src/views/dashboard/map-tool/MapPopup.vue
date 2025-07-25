<!-- 地图弹窗 -->
<template>
  <Transition name="bounce">
    <div
      v-if="visible"
      ref="popupEl"
      :class="['absolute top-0 left-0 p-12px rd-6px cursor-move', !isDragging && 'move-animation']"
      :style="popupStyle"
      @dblclick="emit('dblclick')"
      @mousedown="onMouseDown"
    >
      <div class="relative">
        <div
          :class="[
            'close c-#000 hover:bg-#0081ff hover:c-[#fff] top-4px right-4px text-14px w-24px h-24px mt-4px rd-4px',
            closeClass,
          ]"
          @click="close"
        >
          <close-outlined />
        </div>
        <div class="text-12px c-#2483DF c-#333">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
  import { ref, onBeforeUnmount, reactive, onUnmounted, computed } from 'vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { useElementSize, useEventListener, useThrottleFn, watchDebounced } from '@vueuse/core';

  // Props 类型定义
  interface MapPopupProps {
    latlng: [number, number];
    width?: number;
    height?: number;
    placement?: 'top' | 'left' | 'right' | 'bottom';
    offsetTop?: number;
    offsetLeft?: number;
    closeClass?: string;
    backgroundColor?: string;
    map: any;
    mapWrap: { width: number; height: number };
  }

  const props = withDefaults(defineProps<MapPopupProps>(), {
    height: 0,
    width: 0,
    placement: 'top',
    offsetTop: 0,
    backgroundColor: '#fff',
    offsetLeft: 0,
    closeClass: '',
  });

  const emit = defineEmits<{
    (e: 'updateLatlng', latlng: [number, number]): void;
    (e: 'dblclick'): void;
  }>();

  const visible = ref(true);
  const popupEl = ref<HTMLElement | null>(null);
  const { width: elWidth, height: elHeight } = useElementSize(popupEl);

  // 弹窗像素坐标
  const position = reactive({ x: -9999, y: -9999 });
  const isDragging = ref(false);

  // 计算弹窗样式
  const popupStyle = computed(() => ({
    '--p-x': `${position.x}px`,
    '--p-y': `${position.y}px`,
    backgroundColor: props.backgroundColor,
    transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
  }));

  // 监听地图拖拽/缩放事件，重新定位弹窗
  mitter.on(MEventEnum.MapDragAndZoom, () => {
    if (visible.value) updatePosition();
  });

  // 弹窗尺寸变化时重新定位
  watchDebounced([elWidth, elHeight], updatePosition, { debounce: 100, maxWait: 1000 });

  // 经纬度转像素点
  function latLngToPoint({
    map,
    latlng,
    mapWrap,
  }: {
    map: any;
    latlng: [number, number];
    mapWrap: { width: number; height: number };
  }) {
    const center = map?.getCenter();
    const originPoint = map.latLngToLayerPoint(latlng.map(Number));
    const centerPoint = map.latLngToLayerPoint([center.lat, center.lng]);
    return {
      left: mapWrap.width / 2 - (centerPoint.x - originPoint.x) + props.offsetLeft,
      top: mapWrap.height / 2 - (centerPoint.y - originPoint.y) + props.offsetTop,
    };
  }

  // 像素点转经纬度
  function pointToLatLng({
    map,
    point,
    mapWrap,
  }: {
    map: any;
    point: { left: number; top: number };
    mapWrap: { width: number; height: number };
  }): [number, number] {
    const center = map?.getCenter();
    const centerPoint = map.latLngToLayerPoint([center.lat, center.lng]);
    const targetPoint = {
      x: centerPoint.x + (point.left - mapWrap.width / 2),
      y: centerPoint.y + (point.top - mapWrap.height / 2),
    };
    const latlng = map.layerPointToLatLng(BM.point(targetPoint.x, targetPoint.y));
    return [latlng.lat, latlng.lng];
  }

  // 根据经纬度和配置计算弹窗像素坐标
  function updatePosition() {
    if (!props.mapWrap) return;
    const { width, height } = props.mapWrap;
    const point = latLngToPoint({
      map: props.map,
      mapWrap: { width, height },
      latlng: props.latlng,
    });
    let left = point.left;
    let top = point.top;
    const w = props.width || elWidth.value;
    const h = props.height || elHeight.value;
    switch (props.placement) {
      case 'left':
        left -= w;
        top -= h / 2;
        break;
      case 'top':
        top -= h;
        left -= w / 2;
        break;
      case 'right':
        top -= h / 2;
        break;
      case 'bottom':
        left -= w / 2;
        break;
    }
    position.x = left;
    position.y = top;
  }

  // 打开弹窗
  function open() {
    updatePosition();
    visible.value = true;
  }
  // 关闭弹窗
  function close() {
    visible.value = false;
  }

  // 拖拽弹窗
  function onMouseDown(e: MouseEvent) {
    if (e.buttons === 2) return;
    isDragging.value = true;
    const startX = e.pageX - position.x;
    const startY = e.pageY - position.y;
    const onDrag = useThrottleFn((ev: MouseEvent) => {
      position.x = ev.pageX - startX;
      position.y = ev.pageY - startY;
    }, 16);
    // 监听鼠标移动和松开
    const removeMouseMove = useEventListener(document, 'mousemove', onDrag);
    const removeMouseUp = useEventListener(document, 'mouseup', () => {
      isDragging.value = false;
      // 计算拖拽后新的经纬度
      let left = position.x;
      let top = position.y;
      const w = props.width || elWidth.value;
      const h = props.height || elHeight.value;
      switch (props.placement) {
        case 'left':
          left += w;
          top += h / 2;
          break;
        case 'top':
          top += h;
          left += w / 2;
          break;
        case 'right':
          top += h / 2;
          break;
        case 'bottom':
          left += w / 2;
          break;
      }
      const latlng = pointToLatLng({
        map: props.map,
        point: { left, top },
        mapWrap: props.mapWrap,
      });
      emit('updateLatlng', latlng);
      removeMouseMove();
      removeMouseUp();
    });
    e.preventDefault();
  }

  onUnmounted(() => {
    mitter.off(MEventEnum.MapDragAndZoom);
  });

  defineExpose({ open, close });

  onBeforeUnmount(close);
</script>
<style lang="less" scoped>
  @keyframes bounce-in {
    0% {
      transform: translate3d(var(--p-x), var(--p-y), 0) scale(0);
    }

    50% {
      transform: translate3d(var(--p-x), var(--p-y), 0) scale(1.25);
    }

    100% {
      transform: translate3d(var(--p-x), var(--p-y), 0) scale(1);
    }
  }

  .close {
    position: absolute;
    z-index: 1;
    transition: all 200ms ease-in-out;
    cursor: pointer;
  }

  .fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in 0.3s;
  }

  .bounce-leave-active {
    animation: bounce-in 0.3s reverse;
  }

  .move-animation {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }
</style>
