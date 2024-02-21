<template>
  <!-- 地图 -->
  <div id="bigemap-global" ref="bigeMapRef"></div>
  <!-- 工具按钮 -->
  <div class="fixed bottom-12px right-12px c-#333 z-999">
    <button @click="map.zoomOut()">-</button>
    <button @click="map.zoomIn()">+</button>
    <button v-if="isDev" type="button" @click="getMapViewport">获取地图信息</button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import './map.less';

  const copyText = ref('');
  const { copy } = useClipboard({ source: copyText });

  let map: any; // 总地图实例
  let ele18lite: any; // 电子图层
  // let layerGroup: any; // 其他东西图层

  const bigeMapRef = ref(null);

  const isDev = import.meta.env.DEV;

  if (BM) BM.Config.HTTP_URL = 'http://172.16.11.13:3000';

  onMounted(() => {
    init();
    clickFn();
    mitterOn();
  });

  function getGridLayerExtend(data: { url: string }) {
    return {
      createTile: function (coords: any) {
        const tile = new Image(256, 256);
        const src = data.url;
        tile.src = src.replace('{x}', coords.x).replace('{y}', coords.y).replace('{z}', coords.z);
        tile.onerror = () => {
          tile.src = '/images/empty.png';
        };
        return tile;
      },
    };
  }

  function init() {
    console.log('map init:::');
    map = BM.map('bigemap-global', null, {
      center: [38.79519830468467, 116.63085937500001],
      minZoom: 1,
      zoom: 3,
      maxZoom: 7,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      trackResize: true,
      renderer: BM.svg(),
    });

    // 电子地图
    const gridLayer = BM.GridLayer.extend(
      getGridLayerExtend({
        url: '/tiles/{z}/{x}/{y}.png',
      }),
    );

    ele18lite = new gridLayer();

    ele18lite.addTo(map);

    // layerGroup = BM.featureGroup([], { zIndex: 11 }).addTo(map);
  }

  // 清除地图上绘制的所有内容,还原一些值为默认状态
  // const clearAll = () => {
  //   layerGroup?.clearLayers();
  //   map?.closePopup();
  // };

  function clickFn() {
    // 缩放事件
    // map.on('zoom', function (evt: { type: string; target: { _zoom: number } }) {
    //   if (evt.type === 'zoom') {
    //   }
    // });
    // map.on('move', function () {});
    // 地图单击事件
    map.on('click', function (e: any) {
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;
      const zoom = map.getZoom();
      // 经度：西经：w 东经：e 纬度：北纬：n 南纬：s
      copyText.value = `${lat}, ${lng}`;
      copy();
      console.log('map click zoom:::', zoom);
      console.log('map click [纬度，经度]:::', [lat, lng]);
    });
  }
  function getMapViewport() {
    const center = map?.getCenter();
    const zoom = map.getZoom();
    console.log('map zoom:::', zoom);
    console.log('center [纬度，经度]:::', [center.lat, center.lng]);
  }

  function mitterOn() {}

  function mitterOff() {}
  onBeforeUnmount(() => {
    mitterOff();
  });
</script>

<style lang="less" scoped>
  #bigemap-global {
    width: 100%;
    height: 100%;
    // border: 1px solid #000;
  }
</style>
<style>
  .bigemap-draw-section {
    top: 150px;
  }
</style>
