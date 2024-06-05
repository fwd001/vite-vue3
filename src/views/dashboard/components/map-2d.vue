<template>
  <!-- 地图 -->
  <div id="bigemap-global" ref="bigeMapRef"></div>
  <!-- 按钮 -->
  <div class="mapCtrl absolute bottom-12px right-12px c-#333 z-999">
    <button class="mapBtn" v-if="isDev" type="button" @click="resetMap">
      <Icon icon="iconamoon:home-fill" />
    </button>
    <button class="mapBtn" @click="map.zoomOut()"><Icon icon="iconamoon:sign-minus-bold" /></button>
    <button class="mapBtn" @click="map.zoomIn()"><Icon icon="iconamoon:sign-plus-bold" /></button>
  </div>
  <!-- 地图控件：左-->
  <div class="mapCtrl_left">
    <!--坐标显示-->
    <div class="mapPosition">
      <span> {{ mapPosition.x }},{{ mapPosition.y }}</span>
    </div>
  </div>
  <!-- 图层面板开关 -->
  <button
    :class="[
      showPanel ? 'mapPanelBtnOn' : 'mapPanelBtn',
      'flex justify-center items-center cursor-pointer',
    ]"
    @click="showPanel = !showPanel"
  >
    <Icon :size="26" :icon="showPanel ? 'ri:expand-left-line' : 'fluent:toolbox-24-regular'" />
  </button>
  <!-- 图层面板 -->
  <div v-if="showPanel" class="mapCtrl_panel">
    <!-- POI搜索框：未完成！建议结合地图服务器提供POI检索功能使用 -->
    <div class="bg-#fff p-1 w-84 b-#a3a3a3 b-b-1 font-sans flex">
      <input
        type="text"
        id="search_data"
        placeholder="搜地点"
        class="w61.5 mx-1 bg-#f3f3f3 b-dark flex"
      />
      <button
        class="bg-#0960bd c-#fff b-#a3a3a3 b-1 w-16.5 h6 text-sm b-rd-1"
        title="点击定位"
        @click="locateTo(location.x, location.y)"
      >
        <Icon icon="iconamoon:search-duotone" />搜索
      </button>
    </div>
    <!-- 经纬度定位 -->
    <div class="bg-#fff p1 w84 b-#a3a3a3 b-b-1 font-sans">
      <span class="w-2">经度:</span>
      <input class="w-22 mx-1 bg-#f3f3f3 b-dark" type="text" v-model="location.x" />
      <span class="w-2">纬度:</span>
      <input class="w-22 mx-1 bg-#f3f3f3 b-dark" type="text" v-model="location.y" />
      <button
        class="bg-#0960bd c-#fff b-#a3a3a3 b-1 w-16.5 h6 text-sm b-rd-1"
        title="点击定位"
        @click="locateTo(location.x, location.y)"
      >
        <Icon icon="iconamoon:location-pin-bold" />定位
      </button>
    </div>
    <div v-if="false" class="flex w-84 h-9.4/10 relative bg-#fff">
      <!-- 图层列表 -->
      <div class="w-74.5 p-2 max-h-2xl overflow-y-auto relative">
        <LyrList ref="LyrListDom" @goto-feature="gotoFeature" />
      </div>
    </div>
    <!-- 标绘工具 -->
    <div class="flex absolute bg-#ffffff00">
      <MapTool
        ref="mapToolRef"
        @add-draw-to-panel="addDrawToPanel"
        @remove-draw-from-panel="removeDrawFromPanel"
        @on-edit-layer-info="onEditLayerInfo"
        @select-onpanel="selectOnpanel"
      />
    </div>
  </div>
  <GraphMenu
    @on-delete-layer="mapToolRef?.onDeleteLayer"
    @on-edit-layer-info="mapToolRef?.onEditLayerInfo"
    @on-move-layer="mapToolRef?.onMoveLayer"
    @on-edit-overlay="mapToolRef?.onEditOverlay"
  />
  <!-- 属性编辑框：未完成！还需根据需求完善！ -->
  <GraphicInfo @register="registerModal" @update-attribute="updateAttribute" />
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { usePsMapStore } from '@/store/modules/psMap';
  import './map.less';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { isDevMode } from '@/utils/env';
  import MapTool from './MapTool.vue';
  import LyrList from './LayerList.vue';
  import GraphicInfo from './GraphicInfo.vue';
  import { useModal } from '@/components/Modal';
  import GraphMenu from './GraphMenu.vue';

  const [registerModal, { openModal }] = useModal();
  // import { useXZQHRender } from '@/views/dashboard/ps/hooks/useXZQHRender';

  const mapStore = usePsMapStore();

  const copyText = ref('');
  const { copy } = useClipboard({ source: copyText });

  const showPanel = ref(true); // 面板显隐
  let map: any; // 总地图实例
  let ele18lite: any; // 电子图层
  let layerGroup: any; // 其他东西图层

  const bigeMapRef = ref(null);
  const mapToolRef = ref<InstanceType<typeof MapTool>>();
  const LyrListDom = ref(); // 图层列表Dom

  let currentGraphic: any = null; // 当前选中要素
  const isDev = isDevMode();
  // useXZQHRender();

  if (BM) BM.Config.HTTP_URL = 'http://172.16.11.13:3002';

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
          tile.src = '/images/empty.png';
        };
        return tile;
      },
    };
  }

  function init() {
    console.log('map init:::');
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
        url: '/tiles/ele/{z}/{x}/{y}.png',
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

  // 鼠标实时经纬度
  const mapPosition = reactive({
    // 用于显示鼠标所在位置坐标
    x: 87.214965,
    y: 43.858298,
  });
  function eventFn() {
    // 缩放事件
    map.on('zoom', function (evt: { type: string; target: { _zoom: number } }) {
      if (evt.type === 'zoom') {
        mapStore.setZoom(evt.target._zoom);
      }
    });
    // 鼠标移动事件
    map.on('mousemove', function (e: any) {
      mapPosition.x = e.latlng.lng.toFixed(6);
      mapPosition.y = e.latlng.lat.toFixed(6);
    });
    // 地图单击事件
    map.on('click', function (e: any) {
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;
      // const zoom = map.getZoom();
      // 经度：西经：w 东经：e 纬度：北纬：n 南纬：s
      mapStore.setLatlng([lat, lng]);
      copyText.value = `${lat}, ${lng}`;
      copy();
      // console.log('map click zoom:::', zoom);
      // console.log('map click [纬度，经度]:::', [lat, lng]);
    });
  }
  // function getMapViewport() {
  //   const center = map?.getCenter();
  //   const zoom = map.getZoom();
  //   console.log('map zoom:::', zoom);
  //   console.log('center [纬度，经度]:::', [center.lat, center.lng]);
  // }

  // 重置地图初始位置
  function resetMap() {
    map.setView([43.858298, 87.214965], 7);
  }

  // 鼠标实时经纬度
  const location = reactive({
    // 用于显示鼠标所在位置坐标
    x: '',
    y: '',
  });
  let locationMarker: any = null;
  // 定位到输入经纬度
  function locateTo(x: any, y: any) {
    if (locationMarker) {
      locationMarker.remove();
      locationMarker = null;
    }
    if (x === '' && y === '') {
      return;
    }
    locationMarker = BM.marker([Number(y), Number(x)], {
      draggable: true,
      attribution: { name: 'name' },
    }).addTo(map);
    locationMarker.options.attribution.name = 'ccccccccccc';
    // console.log(locationMarker);
    locationMarker.on('move', function (e: any) {
      location.y = e.latlng.lat.toFixed(6);
      location.x = e.latlng.lng.toFixed(6);
      // console.log(locationMarker.options.attribution.name);
    });
    map.setView([Number(y), Number(x)]);
  }
  //  添加标绘节点至标绘图层面板
  function addDrawToPanel(graphic: any) {
    const i = {
      title: graphic.options.attribution.name + '_' + graphic.overlay_id,
      key: graphic.overlay_id,
      parentKey: graphic.options.attribution.type,
      graphic: graphic,
    };
    i;
    // console.log(i);
    // LyrListDom.value?.addDataToTree(i);
  }
  // 地图选中图形，树结构节点处于选择状态
  function gotoFeature(f: any) {
    f.getBounds && map.fitBounds(f.getBounds());
    f.getLatLng && map.setView([Number(f.getLatLng().lat), Number(f.getLatLng().lng)]);
  }

  // 地图选中图形，树结构节点处于选择状态
  function selectOnpanel(key: any) {
    // LyrListDom.value?.selectDataOnTree(key);
    console.log(key);
  }
  //  添加标绘节点至标绘图层面板
  function removeDrawFromPanel(graphic: any) {
    const nodeKey = graphic.overlay_id;
    console.log(nodeKey);
    // LyrListDom.value?.deleteDataFromTree(nodeKey);
  }
  //  编辑要素属性
  function onEditLayerInfo(graphic: any, id: any, attr: any) {
    currentGraphic = graphic;
    openModal(true, {
      id,
      attr,
      isUpdate: false,
    });
    // console.log(currentGraphic);
  }
  //  更新要素属性
  function updateAttribute(value: any) {
    console.log(value);
    if (value.lineColor && value.fillColor) {
      if (value.type !== 'marker') {
        currentGraphic.setStyle({
          color: value.lineColor,
          fillColor: value.fillColor,
        });
      } else {
        delete value.lineColor;
        delete value.fillColor;
      }
    }
    // console.log('地图要素保存属性', value);
    currentGraphic.options.attribution = value;
    currentGraphic.feature.properties = value;
    // LyrListDom.value?.upDatePanel(value);
  }

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

  function mitterOff() {}
  onBeforeUnmount(() => {
    mitterOff();
  });
</script>

<style lang="less" scoped>
  .mapCtrl {
    display: grid;
    position: absolute;
    right: 15px;
    bottom: 15px;
    transition: all 0.5s ease-out;

    .mapBtn {
      display: flex;
      position: relative;
      z-index: 999;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      margin: 2px;
      border: 1px solid #57585a48;
      border-radius: 30px;
      background-color: rgb(88 86 86 / 37%);
      color: white;
      font-size: 18px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: #0960bd;
      }
    }
  }

  .mapCtrl_left {
    display: flex;
    position: absolute;
    bottom: 5px;
    left: 5px;
    padding: 1px 5px;
    border-radius: 5px;
    background-color: rgb(88 86 86 / 37%);

    .mapPosition {
      position: relative;
      color: white;
      font-size: 15px;
    }

    &:hover {
      background-color: rgb(88 86 86 / 67%);
      cursor: default;
    }
  }

  .mapPanelBtn {
    position: absolute;
    z-index: 999;
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
    padding: 0;
    transition: all 0.5s ease-out;
    border-radius: 10%;
    font-size: 30px;
    filter: drop-shadow(2px 2px wpx rgb(88 88 88));

    &:hover {
      background-color: #0960bd;
      color: #fff;
    }
  }

  .mapPanelBtnOn {
    position: absolute;
    z-index: 999;
    top: 15px;
    left: 22.2rem;
    width: 30px;
    height: 30px;
    padding: 0;
    transition: all 0.5s ease-out;
    border-radius: 10%;
    background-color: white;
    font-size: 30px;
    filter: drop-shadow(2px 2px 2px rgb(88 88 88));

    &:hover {
      background-color: #0960bd;
      color: #fff;
    }
  }

  .mapCtrl_panel {
    display: block;
    position: absolute;
    z-index: 9999;
    top: 15px;
    left: 15px;
    width: 21rem;
    // height: 60%;
    // max-height: 70%;
    transition: all 0.5s ease-out;
    // border-width: 1px;
    // border-color: rgb(163 163 163);
    background-color: #fff0;
    // filter: drop-shadow(2px 2px 2px rgb(88 88 88));
  }
</style>
