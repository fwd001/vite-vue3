<template>
  <!-- 地图 -->
  <div id="bigemap-3d"></div>
  <!-- 工具按钮 -->
  <div class="fixed bottom-12px right-12px c-#333 z-999">
    <button @click="onBack2Right()">回正</button>
    <button v-if="isDev" type="button" @click="getMapViewport">获取地图信息</button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { long } from '@/types';
  import './map.less';

  bmgl.Config.HTTP_URL = 'http://172.16.11.13:3000';
  const isDev = import.meta.env.DEV;

  let map: any; // 总地图实例
  let ele14lite: any; // 电子12图层 放大其他国家使用

  onMounted(() => {
    init();
    clickFn();
  });

  function init() {
    map = new bmgl.Viewer('bigemap-3d', { mapId: 'bigemap.2zqq2slg', requestRenderMode: false });
    const oldLite = map.imageryLayers.get(0);

    ele14lite = new bmgl.ImageryLayer(
      new bmgl.UrlTemplateImageryProvider({
        url: '/tiles/{z}/{x}/{y}.png',
      }),
    );

    map.imageryLayers.remove(oldLite, false);
    map.imageryLayers.add(ele14lite);

    map.camera.setView({
      destination: bmgl.Cartesian3.fromDegrees(
        103.87747930927914,
        26.036832280492735,
        19147549.697734643,
      ),
      orientation: {
        heading: 6.275795414461852,
        pitch: -1.5691482970665795,
        roll: 0,
      },
    });
  }

  const getCenterInfo = () => {
    // 获取最新的位置
    const info: {
      destination?: {
        lat?: number;
        lng?: number;
        height?: number;
      };
      orientation?: {
        heading?: number;
        pitch?: number;
        roll?: number;
      };
    } = {};
    const poi = bmgl.Cartographic.fromCartesian(map.camera.position);
    info.destination = {
      lat: bmgl.Math.toDegrees(poi.latitude),
      lng: bmgl.Math.toDegrees(poi.longitude),
      height: poi.height,
    };
    info.orientation = {
      heading: map.camera.heading,
      pitch: map.camera.pitch,
      roll: map.camera.roll,
    };

    return info;
  };

  function getMapViewport() {
    // 获取最新的位置
    const info = getCenterInfo();
    // document.querySelector('.info').innerHTML = '当前相机的位置:' + info.join('  ')
    // localStorage.setItem('cameraPosition', JSON.stringify(view))
    console.log('center [纬度，经度]:::', [info?.destination?.lat, info?.destination?.lng]);
    console.log('center height:::', info?.destination?.height);
    console.log('center orientation:::', info?.orientation);
    return info;
  }

  function clickFn() {
    const scene = map.scene;
    const handler = new bmgl.ScreenSpaceEventHandler(scene.canvas);
    const ellipsoid = scene.globe.ellipsoid; //得到当前三维场景的椭球体

    // 二 LEFT_CLICK
    handler.setInputAction(function (movement: any) {
      const cartesian = map.camera.pickEllipsoid(movement.position, ellipsoid); // movement.endPosition
      let poi: { lng?: long; lat?: long; height?: number } = {};
      if (cartesian) {
        // 将笛卡尔坐标转换为地理坐标
        var cartographic = bmgl.Cartographic.fromCartesian(cartesian);
        const lng = bmgl.Math.toDegrees(cartographic.longitude);
        const lat = bmgl.Math.toDegrees(cartographic.latitude);

        poi.lng = Number(lng);
        poi.lat = Number(lat);
        poi.height = Math.ceil(map.camera.positionCartographic.height);
        // 获取相机高度
      } else {
        poi.lng = undefined;
        poi.lat = undefined;
        poi.height = 0;
      }
      console.log('poi', poi);
    }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
  }

  function onBack2Right() {
    const info = getCenterInfo();
    map.camera.setView({
      destination: bmgl.Cartesian3.fromDegrees(
        info.destination?.lng,
        info.destination?.lat,
        info.destination?.height,
      ),
      orientation: {
        roll: 0,
      },
    });
  }

  // function clearAll() {
  //   map?.entities?.removeAll();
  //   map?.scene?.primitives?.remove(model3d);
  // }
</script>

<style lang="less" scoped>
  #bigemap-3d {
    width: 100%;
    height: 100%;
    // border: 1px solid #000;
  }
</style>
