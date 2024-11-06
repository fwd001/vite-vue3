<template>
  <template v-if="isInit">
    <!-- 按钮 -->
    <div class="mapCtrl absolute bottom-12px right-12px c-#333 z-999">
      <button class="mapBtn" v-if="isDev" type="button" @click="resetMap">
        <Icon icon="iconamoon:home-fill" />
      </button>
      <button class="mapBtn" @click="map.zoomOut()">
        <Icon icon="iconamoon:sign-minus-bold" />
      </button>
      <button class="mapBtn" @click="map.zoomIn()"><Icon icon="iconamoon:sign-plus-bold" /></button>
    </div>
    <!-- 地图控件：左 -->
    <div class="mapCtrl_left">
      <!-- 坐标显示 -->
      <div class="mapPosition">
        <span> {{ mapPosition.x }},{{ mapPosition.y }}</span>
      </div>
    </div>
    <!-- 图层面板开关 -->
    <button
      :class="[
        showPanel ? 'mapPanelBtnOn' : 'mapPanelBtn',
        'flex justify-center items-center cursor-pointer ',
      ]"
      @click="showPanel = !showPanel"
    >
      <Icon v-if="showPanel" :size="26" :icon="'material-symbols:hide-source-outline'" />
      <Icon v-else :size="26" :icon="'tabler:tools'" />
    </button>
    <!-- 图层面板 -->
    <div v-show="showPanel" class="mapCtrl_panel">
      <!-- POI 搜索框：未完成！建议结合地图服务器提供POI检索功能使用 -->
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
      <!-- @add-draw-to-panel="addDrawToPanel"
      @select-onpanel="selectOnpanel" -->
      <div class="flex absolute bg-#ffffff00">
        <Tool
          :map="map"
          :layer-group="layerGroup"
          :toolData="toolData"
          @on-operate-click="onOperateClick"
          @on-change-file="onChangeFile"
          @download-geo-json="downloadGeoJson"
        />
      </div>
    </div>
    <GraphMenu
      @on-delete-layer="onDeleteLayer"
      @on-edit-layer-info="onEditLayerInfo"
      @on-move-layer="onMoveLayer"
      @on-edit-overlay="onEditOverlay"
    />
    <!-- 属性编辑框：未完成！还需根据需求完善！ -->
    <GraphicInfo @register="registerModal" @update-attribute="updateAttribute" />

    <!-- 弹窗模板 -->
    <MapPopup
      v-for="item in toolStore.textList"
      :key="item.id"
      :id="item.id"
      ref="mapPopupRef"
      :map="map"
      :class="[`z-99`]"
      :backgroundColor="item.backgroundColor"
      closeClass="hidden"
      :map-wrap="mapWrap"
      :latlng="item.latlng"
      placement="top"
      @update-latlng="(latlng) => toolStore.setTextItem({ ...item, latlng })"
      @dblclick="() => openTextEditModal(true, item)"
    >
      <div
        :class="[`relative cursor-default`]"
        :style="{ color: item.color, width: item.width ? `${item.width}px` : 'auto' }"
      >
        <!-- <Textarea v-model:value="item.content" :bordered="false" autosize /> -->
        {{ item.content }}
      </div>
    </MapPopup>
    <TextEditModal @register="registerTextModal" @update-attribute="updateAttribute" />
  </template>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { onBeforeUnmount, ref, reactive } from 'vue';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { isDevMode } from '@/utils/env';
  // import { Textarea } from 'ant-design-vue';
  import Tool from './Tool.vue';
  import LyrList from './LayerList.vue';
  import GraphicInfo from './GraphicInfoModal.vue';
  import { useModal } from '@/components/Modal';
  import GraphMenu from './GraphMenu.vue';
  import { useLatlon2Addr } from '../hooks/useLatlon2Addr';
  import { useMessage } from '@/hooks/web/useMessage';
  import { formatIcon, iconPublicPath } from './utils';
  import { useToolHooks } from './Ahooks';
  import { ToolTypeEnum } from './enum';
  import { useToolStore } from './useToolStore';
  import TextEditModal from './TextEditModal.vue';
  import MapPopup from './MapPopup.vue';

  const map = ref<any>(null); // 总地图实例
  const layerGroup = ref<any>(null); // 总地图实例
  const mapWrap = ref<any>(null); // 总地图实例
  // 地图是否已加载
  const isInit = ref(false);

  const [registerModal, { openModal }] = useModal();
  const [registerTextModal, { openModal: openTextEditModal }] = useModal();
  const { l2Addr } = useLatlon2Addr();
  const toolStore = useToolStore();

  const { toolData, onOperateClick, onEditOverlay, onMoveLayer, onChangeFile, downloadGeoJson } =
    useToolHooks({
      selectOnpanel,
      addDrawToPanel,
    });

  const showPanel = ref(false); // 面板显隐
  const { message } = useMessage();

  const LyrListDom = ref(); // 图层列表Dom

  let currentGraphic: any = null; // 当前选中要素
  const isDev = isDevMode();
  // useXZQHRender();

  // 鼠标实时经纬度
  const mapPosition = reactive({
    // 用于显示鼠标所在位置坐标
    x: 87.214965,
    y: 43.858298,
  });
  function eventFn() {
    // 鼠标移动事件
    map.value.on('mousemove', function (e: any) {
      mapPosition.x = e.latlng.lng.toFixed(6);
      mapPosition.y = e.latlng.lat.toFixed(6);
    });
  }
  // 重置地图初始位置
  function resetMap() {
    map.value.setView([43.858298, 87.214965], 7);
  }

  // 鼠标实时经纬度
  const location = reactive({
    // 用于显示鼠标所在位置坐标
    x: '',
    y: '',
  });
  let locationMarker: any = null;
  // 定位到输入经纬度
  async function locateTo(x: any, y: any) {
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
    }).addTo(map.value);
    locationMarker.options.attribution.name = 'Temporary Point';
    // console.log(locationMarker);
    locationMarker.on('move', function (e: any) {
      location.y = e.latlng.lat.toFixed(6);
      location.x = e.latlng.lng.toFixed(6);
      // console.log(locationMarker.options.attribution.name);
    });
    map.value.setView([Number(y), Number(x)]);

    const addrArr = await l2Addr([Number(x), Number(y)]);
    addrArr && message.success(addrArr?.join(','));
  }
  //  添加标绘节点至标绘图层面板
  function addDrawToPanel(graphic: any) {
    const i = {
      title: graphic.options.attribution.name + '_' + graphic.overlay_id,
      key: graphic.overlay_id,
      parentKey: graphic.options.attribution.type,
      graphic: graphic,
    };
    console.log(i);
    // LyrListDom.value?.addDataToTree(i);
  }
  // 地图选中图形，树结构节点处于选择状态
  function gotoFeature(f: any) {
    f.getBounds && map.value.fitBounds(f.getBounds());
    f.getLatLng && map.value.setView([Number(f.getLatLng().lat), Number(f.getLatLng().lng)]);
  }

  // 地图选中图形，树结构节点处于选择状态
  function selectOnpanel(key: string) {
    // LyrListDom.value?.selectDataOnTree(key);
    console.log(key);
  }
  //  添加标绘节点至标绘图层面板
  function onDeleteLayer(e) {
    e.stopPropagation();
    if (!toolData.selected) return;
    const nodeKey = toolData.selected.overlay_id;
    toolData.selected.remove();
    toolData.layerGroup.removeLayer(toolData.selected);
    delete toolData.markers[nodeKey];
    mitter.emit(MEventEnum.HideContextMenu);
    toolData.selected = undefined;
    console.log(nodeKey);
    // LyrListDom.value?.deleteDataFromTree(nodeKey);
  }
  //  编辑要素属性
  function onEditLayerInfo(e) {
    onOperateClick(ToolTypeEnum.drag);
    e.stopPropagation ? e.stopPropagation() : null;
    mitter.emit(MEventEnum.HideContextMenu);
    currentGraphic = toolData.selected;
    openModal(true, {
      id: toolData.selected.overlay_id,
      attr: toolData.selected.options.attribution,
      isUpdate: false,
    });
  }
  //  更新要素属性
  function updateAttribute(value: any) {
    if (value.type === ToolTypeEnum.text) {
      console.log('value: ', value);
      toolStore.setTextItem({ ...value, latlng: [value.lat, value.lng] });
      return;
    } else if (value.type === ToolTypeEnum.marker) {
      delete value.lineColor;
      delete value.fillColor;
      if (value.pointIcon) {
        const { iconName, width, height } = formatIcon(value.pointIcon);
        currentGraphic?.setIcon(
          BM.icon({
            iconUrl: `${iconPublicPath}${iconName}`,
            iconSize: [width, height],
            iconAnchor: [width / 2, height / 2],
          }),
        );
      }
    } else {
      if (value.lineColor && value.fillColor) {
        currentGraphic.setStyle({
          color: value.lineColor,
          fillColor: value.fillColor,
        });
      }
    }

    // console.log('地图要素保存属性', value);
    currentGraphic.options.attribution = value;
    currentGraphic.feature.properties = value;
  }

  function mitterOn() {
    mitter.on(MEventEnum.MapMounted, (data: { map: any; layerGroup: any; mapWrap: any }) => {
      map.value = data.map;
      layerGroup.value = data.layerGroup;
      mapWrap.value = data.mapWrap;

      eventFn();
      isInit.value = true;
    });
  }
  mitterOn();
  function mitterOff() {
    mitter.off(MEventEnum.MapMounted);
  }

  onBeforeUnmount(() => {
    mitterOff();
    isInit.value = false;
    map.value = null;
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
    color: #666;
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
    color: #666;
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
    transition: all 0.5s ease-out;
    background-color: #fff0;
  }
</style>
