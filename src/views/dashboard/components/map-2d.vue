<template>
  <!-- 地图 -->
  <div id="bigemap-global" ref="bigeMapRef"></div>
  <MapTool />
</template>

<script setup lang="ts">
  import MapTool from '../map-tool/index.vue';
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { usePsMapStore } from '@/store/modules/psMap';
  import './map.less';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { useLatlon2Addr } from '../hooks/useLatlon2Addr';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGlobSetting } from '@/hooks/setting';

  // import { useXZQHRender } from '@/views/dashboard/ps/hooks/useXZQHRender';
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

  const mapStore = usePsMapStore();
  const { l2Addr } = useLatlon2Addr();
  const { message } = useMessage();
  const { mapConfHttpUrl, dridUrl } = useGlobSetting();

  const copyText = ref('');
  const { copy } = useClipboard({ source: copyText });

  let map: any; // 总地图实例
  let ele18lite: any; // 电子图层
  let layerGroup: any; // 其他东西图层

  const bigeMapRef = ref(null);

  if (BM) BM.Config.HTTP_URL = mapConfHttpUrl;

  onMounted(() => {
    init();
    eventFn();
    mitterOn();
    // markersRender();
  });

  function getGridLayerExtend(data: { url: string }) {
    return {
      createTile: function (coords: any) {
        const tile = new Image(256, 256);
        const src = data.url;
        tile.src = src.replace('{x}', coords.x).replace('{y}', coords.y).replace('{z}', coords.z);
        tile.onerror = () => {
          tile.src = publicPath + 'images/empty.png';
        };
        return tile;
      },
    };
  }

  function init() {
    map = BM.map('bigemap-global', null, {
      center: [43.858296779161854, 87.21496514976026],
      minZoom: 3,
      zoom: 7,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      trackResize: true,
      // renderer: BM.svg(),
    });

    // 电子地图自定义渲染
    const gridLayer = BM.GridLayer.extend(
      getGridLayerExtend({
        url: dridUrl,
      }),
    );

    ele18lite = new gridLayer();
    ele18lite.addTo(map);

    layerGroup = BM.featureGroup([]);
    layerGroup.addTo(map);
    mitter.emit(MEventEnum.MapMounted, { map, layerGroup });
  }

  // 清除地图上绘制的所有内容,还原一些值为默认状态
  // const clearAll = () => {
  //   layerGroup?.clearLayers();
  //   map?.closePopup();
  // };

  function eventFn() {
    // 缩放事件
    map.on('zoom', function (evt: { type: string; target: { _zoom: number } }) {
      if (evt.type === 'zoom') {
        mapStore.setZoom(evt.target._zoom);
      }
    });
    // 地图单击事件
    map.on('click', async function (e: any) {
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;
      // const zoom = map.getZoom();
      // 经度：西经：w 东经：e 纬度：北纬：n 南纬：s
      mapStore.setLatlng([lng, lat]);
      copyText.value = `${lng}, ${lat}`;
      copy();
      // console.log('map click zoom:::', zoom);
      // console.log('map click [纬度，经度]:::', [lat, lng]);
      message.success(`经纬度：${[lng, lat]?.join(',')}`);
      // 打印地址
      const addrArr = await l2Addr([lng, lat]);
      addrArr && message.success(addrArr?.join(','));
    });
  }
  // function getMapViewport() {
  //   const center = map?.getCenter();
  //   const zoom = map.getZoom();
  //   console.log('map zoom:::', zoom);
  //   console.log('center [纬度，经度]:::', [center.lat, center.lng]);
  // }

  // 聚合点
  // function markersRender() {
  //   //登陆聚合对象
  //   let markers = new BM.MarkerClusterGroup({
  //     showCoverageOnHover: false, //不显示边界
  //     zoomToBoundsOnClick: true, //点击放大到对应位置
  //     removeOutsideVisibleBounds: false,
  //     animate: false, //动画
  //     maxClusterRadius: 100, //缩放半径,
  //     disableClusteringAtZoom: null, //在指定级别以下禁用缩放
  //     //使用定义的图标来显示
  //     // iconCreateFunction: function (cluster) {
  //     //   var markers = cluster.getAllChildMarkers();

  //     //   // BM.icon({iconUrl:'http://www.bigemap.com/mapoffline/marker/2.png'})
  //     //   return BM.divIcon({
  //     //     html: `<div class="icon">${markers.length}</div>`,
  //     //     iconSize: BM.point(40, 40)
  //     //   });
  //     // }
  //   });
  //   // BM.marker([i*5,j*5],{icon:BM.icon({iconUrl:'http://www.bigemap.com/mapoffline/marker/'+20+'.png'})}).addTo(map);
  //   let markersList: any[] = [];
  //   //生成2000个点推入标记数组
  //   function populate() {
  //     for (let i = 0; i < 2000; i++) {
  //       let m = new BM.marker(getRandomLatLng(map), {
  //         icon: BM.icon({
  //           iconUrl: '/public/BM/marker/2.png',
  //         }),
  //       });
  //       markersList.push(m);
  //       markers.addLayer(m);
  //     }
  //     return false;
  //   }
  //   //根据当前的范围生成随机的点
  //   function getRandomLatLng(map) {
  //     let bounds = map.getBounds(),
  //       southWest = bounds.getSouthWest(),
  //       northEast = bounds.getNorthEast(),
  //       lngSpan = northEast.lng - southWest.lng,
  //       latSpan = northEast.lat - southWest.lat;
  //     return new BM.LatLng(
  //       southWest.lat + latSpan * Math.random(),
  //       southWest.lng + lngSpan * Math.random(),
  //     );
  //   }
  //   //对聚合的实例添加点击事件
  //   markers.on('clusterclick', function (a) {
  //     console.log('cluster' + a.layer.getAllChildMarkers().length);
  //   });
  //   //对标注添加一个点击事件
  //   markers.on('click', function (a) {
  //     alert('marker ' + a.layer);
  //   });
  //   populate();
  //   layerGroup.addLayer(markers);
  // }

  function mitterOn() {}
  mitterOn();
  function mitterOff() {}
  onBeforeUnmount(() => {
    mitterOff();
  });
</script>

<style lang="less" scoped></style>
