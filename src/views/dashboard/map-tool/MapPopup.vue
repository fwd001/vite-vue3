<!-- 地图弹窗 -->
<template>
  <Transition name="bounce">
    <div
      v-if="visible"
      ref="el"
      :class="['absolute top-0 left-0 p-12px rd-6px cursor-move', !isMove && 'move-animation']"
      :style="{
        '--p-x': `${position.x}px`,
        '--p-y': `${position.y}px`,
        backgroundColor: props.backgroundColor,
        transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
      }"
      @dblclick.self="emits('dblclick')"
      @mousedown.self="handleMouseDown"
    >
      <div class="relative">
        <div
          :class="[
            'close c-#000 hover:bg-#0081ff hover:c-[#fff] top-4px right-4px text-14px w-24px h-24px mt-4px  rd-4px ',
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
  import { ref, onBeforeUnmount, reactive, onUnmounted } from 'vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { useElementSize, useEventListener, useThrottleFn, watchDebounced } from '@vueuse/core';

  const visible = ref(true);

  interface Props {
    latlng: [number, number];
    width?: number;
    height?: number;
    placement?: string;
    offsetTop?: number;
    offsetLeft?: number;
    closeClass?: string;
    backgroundColor?: string;
    map: any;
    mapWrap: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 0,
    width: 0,
    placement: 'top',
    offsetTop: 0,
    backgroundColor: '#fff',
    offsetLeft: 0,
    closeClass: '',
  });

  const emits = defineEmits(['updateLatlng', 'dblclick']);

  const el = ref();

  const { width: wW, height: wH } = useElementSize(el);

  const position = reactive({
    x: -9999,
    y: -9999,
  });

  const isMove = ref(false);
  // 地图被拖动
  mitter.on(MEventEnum.MapDragAndZoom, () => {
    if (!visible.value) return;
    toMapXY();
  });
  // watch(
  //   props.mapWrap,
  //   () => {
  //     toMapXY();
  //   },
  //   {
  //     immediate: true,
  //   },
  // );
  watchDebounced(
    [wW, wH],
    () => {
      toMapXY();
    },
    { debounce: 100, maxWait: 1000 },
  );
  function toMapXY() {
    if (!props.mapWrap) {
      return;
    }
    const _mapWrap = {
      width: props.mapWrap.width,
      height: props.mapWrap.height,
    };
    const point = latLng2Point({
      map: props.map,
      mapWrap: _mapWrap,
      latlng: props.latlng,
    });

    let left = point.left;
    let top = point.top;
    const width = props.width || wW.value;
    const height = props.height || wH.value;

    if (props.placement === 'left') {
      left = left - width;
      top = top - height / 2;
    } else if (props.placement === 'top') {
      top = top - height;
      left = left - width / 2;
    } else if (props.placement === 'right') {
      top = top - height / 2;
    } else if (props.placement === 'bottom') {
      left = left - width / 2;
    }

    position.x = left;
    position.y = top;
  }

  function latLng2Point(data: {
    map: any;
    latlng: [number, number];
    mapWrap: { width: number; height: number };
  }) {
    const map = data.map;
    const center = map?.getCenter();
    const mapWrap = data.mapWrap;
    const originPoint = map.latLngToLayerPoint(data.latlng.map((v) => Number(v)));
    const centerPoint = map.latLngToLayerPoint([center.lat, center.lng]);

    return {
      left: mapWrap.width / 2 - (centerPoint.x - originPoint.x) + props.offsetLeft,
      top: mapWrap.height / 2 - (centerPoint.y - originPoint.y) + props.offsetTop,
    };
  }

  function point2LatLng(data: {
    map: any;
    point: { left: number; top: number };
    mapWrap: { width: number; height: number };
  }) {
    const center = data.map?.getCenter();
    const mapWrap = data.mapWrap;

    // Calculate the centerPoint in layer coordinates
    const centerPoint = data.map.latLngToLayerPoint([center.lat, center.lng]);

    // Derive the target point in layer coordinates
    const targetPoint = {
      x: centerPoint.x + (data.point.left - mapWrap.width / 2),
      y: centerPoint.y + (data.point.top - mapWrap.height / 2),
    };

    // Convert the target point back to geographical coordinates (lat, lng)
    const latlng = data.map.layerPointToLatLng(BM.point(targetPoint.x, targetPoint.y));

    return [latlng.lat, latlng.lng];
  }

  function open() {
    toMapXY();
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  function handleMouseDown(e) {
    if (e.buttons === 2) return;
    isMove.value = true;

    const startX = e.pageX - position.x;
    const startY = e.pageY - position.y;
    const handleDrap = useThrottleFn((ev) => {
      position.x = ev.pageX - startX;
      position.y = ev.pageY - startY;
    }, 16);
    // useEventListener 返回一个注销函数
    const removeMouseMove = useEventListener(document, 'mousemove', handleDrap);
    const removeMouseup = useEventListener(document, 'mouseup', () => {
      isMove.value = false;

      let left = position.x;
      let top = position.y;

      const width = props.width || wW.value;
      const height = props.height || wH.value;
      if (props.placement === 'left') {
        left = left + width;
        top = top + height / 2;
      } else if (props.placement === 'top') {
        top = top + height;
        left = left + width / 2;
      } else if (props.placement === 'right') {
        top = top + height / 2;
      } else if (props.placement === 'bottom') {
        left = left + width / 2;
      }
      const latlng = point2LatLng({
        map: props.map,
        point: {
          left,
          top,
        },
        mapWrap: props.mapWrap,
      });

      emits('updateLatlng', latlng);
      removeMouseMove();
      removeMouseup();
    });
    e.preventDefault();
  }

  onUnmounted(() => {
    mitter.off(MEventEnum.MapDragAndZoom);
    mitter.off(MEventEnum.MapMounted);
  });

  defineExpose({
    open,
    close,
  });

  onBeforeUnmount(() => {
    close();
  });
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

  .avp-wrap {
    width: 100%;
    height: 100%;
    border-radius: 1px solid #000;
    border-radius: 6px;
    background-color: rgba(#fff, 0.9);
    backdrop-filter: blur(5px);
  }

  .close {
    position: absolute;
    z-index: 1;
    transition: all 200ms ease-in-out;
    cursor: pointer;
  }

  /* fade样式 */
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

  /* bounce样式 */
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
