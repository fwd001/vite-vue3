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
    <div class="absolute top-12px left-12px shadow-[0px_0px_6px_1px_#00367026]">
      <div class="flex relative">
        <span
          class="w-36px h-36px icon-f flex items-center justify-center rd-[4px_4px_0_0]"
          :class="[{ active: showPanelKey === ToolEnum.search }]"
          @click="onChangePanelKey(ToolEnum.search)"
        >
          <SvgIcon name="map-tool-search" size="18" />
        </span>
        <div
          v-show="showPanelKey === ToolEnum.search"
          class="absolute flex left-[42px] top-0 shadow-[0px_0px_6px_1px_#00367026]"
        >
          <div class="bg-#fff h-36px box-border w-325px flex items-center pl-6px pr-8px rd-4px">
            <Input id="search_data" :bordered="false" size="small" placeholder="搜地点" />
            <Button size="small" type="primary"> 搜索 </Button>
          </div>
        </div>
      </div>
      <div class="flex relative">
        <span
          class="w-36px h-36px icon-f flex items-center justify-center"
          :class="[{ active: showPanelKey === ToolEnum.position }]"
          @click="onChangePanelKey(ToolEnum.position)"
        >
          <SvgIcon name="map-tool-position" size="18" />
        </span>
        <div
          v-show="showPanelKey === ToolEnum.position"
          class="absolute flex left-[42px] top-0 shadow-[0px_0px_6px_1px_#00367026]"
        >
          <div class="bg-#fff h-36px box-border flex items-center px-8px rd-4px">
            <span class="mr-6px flex-shrink-0">经度:</span>
            <Input class="w-100px mr-10px" size="small" v-model:value="location.x" />
            <span class="mr-6px flex-shrink-0">纬度:</span>
            <Input class="w-100px" size="small" v-model:value="location.y" />
            <Button
              class="ml-6px"
              type="primary"
              size="small"
              @click="locateTo(location.x, location.y)"
            >
              定位
            </Button>
          </div>
        </div>
      </div>
      <div class="flex relative">
        <span
          class="w-36px h-36px icon-f flex items-center justify-center"
          :class="[{ active: showPanelKey === ToolEnum.base }]"
          @click="onChangePanelKey(ToolEnum.base)"
        >
          <SvgIcon name="map-tool-base" size="18" />
        </span>
        <div
          v-show="showPanelKey === ToolEnum.base"
          class="absolute flex left-[42px] top-0 rd-4px overflow-hidden shadow-[0px_0px_6px_1px_#00367026]"
        >
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="拖拽"
            :class="[{ active: toolState.drawType === ToolTypeEnum.drag }]"
            @click="handleToolAction(ToolTypeEnum.drag)"
          >
            <SvgIcon name="map-tool-drag-hand-gesture" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="标点"
            :class="[{ active: toolState.drawType === ToolTypeEnum.marker }]"
            @click="handleToolAction(ToolTypeEnum.marker)"
          >
            <SvgIcon name="map-tool-marker" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="文本"
            :class="[{ active: toolState.drawType === ToolTypeEnum.text }]"
            @click="handleToolAction(ToolTypeEnum.text)"
          >
            <SvgIcon name="map-tool-text-2-fill" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="连线"
            :class="[{ active: toolState.drawType === ToolTypeEnum.polyline }]"
            @click="handleToolAction(ToolTypeEnum.polyline)"
          >
            <SvgIcon name="map-tool-baseline-polyline" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="多边形"
            :class="[{ active: toolState.drawType === ToolTypeEnum.polygon }]"
            @click="handleToolAction(ToolTypeEnum.polygon)"
          >
            <SvgIcon name="map-tool-polygon-duotone" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="圆"
            :class="[{ active: toolState.drawType === ToolTypeEnum.circle }]"
            @click="handleToolAction(ToolTypeEnum.circle)"
          >
            <SvgIcon name="map-tool-twotone-circle" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="矩形"
            :class="[{ active: toolState.drawType === ToolTypeEnum.rectangle }]"
            @click="handleToolAction(ToolTypeEnum.rectangle)"
          >
            <SvgIcon name="map-tool-rectangle-duotone" class="icon-c" size="18" />
          </span>
        </div>
      </div>
      <div class="flex relative">
        <span
          class="w-36px h-36px icon-f flex items-center justify-center"
          :class="[{ active: showPanelKey === ToolEnum.military }]"
          @click="onChangePanelKey(ToolEnum.military)"
        >
          <SvgIcon name="map-tool-flag" size="18" />
        </span>
        <div
          v-show="showPanelKey === ToolEnum.military"
          class="absolute flex left-[42px] top-0 rd-4px overflow-hidden shadow-[0px_0px_6px_1px_#00367026]"
        >
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="细直箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.straightArrow }]"
            @click="handleToolAction(ToolTypeEnum.straightArrow)"
          >
            <SvgIcon name="map-tool-left-arrow" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="尖直箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.fineArrow }]"
            @click="handleToolAction(ToolTypeEnum.fineArrow)"
          >
            <SvgIcon name="map-tool-arrow-left-1" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="粗直箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.assaultDirection }]"
            @click="handleToolAction(ToolTypeEnum.assaultDirection)"
          >
            <SvgIcon name="map-tool-arrow-left-2" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="粗曲线箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.squadCombat }]"
            @click="handleToolAction(ToolTypeEnum.squadCombat)"
          >
            <SvgIcon name="map-tool-arrow-bounce-16-filled" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="燕尾曲线箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.tailedSquadCombat }]"
            @click="handleToolAction(ToolTypeEnum.tailedSquadCombat)"
          >
            <SvgIcon name="map-tool-enter-arrow" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="双箭头"
            :class="[{ active: toolState.drawType === ToolTypeEnum.doubleArrow }]"
            @click="handleToolAction(ToolTypeEnum.doubleArrow)"
          >
            <SvgIcon name="map-tool-arrow-split-16-filled" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="进攻方向"
            :class="[{ active: toolState.drawType === ToolTypeEnum.attackArrow }]"
            @click="handleToolAction(ToolTypeEnum.attackArrow)"
          >
            <SvgIcon name="map-tool-spine-arrow" class="icon-c" size="18" />
          </span>
        </div>
      </div>
      <div class="flex relative">
        <span
          class="w-36px h-36px icon-f flex items-center justify-center rd-[0_0_4px_4px]"
          :class="[{ active: showPanelKey === ToolEnum.tool }]"
          @click="onChangePanelKey(ToolEnum.tool)"
        >
          <SvgIcon name="map-tool-gauge" size="18" />
        </span>
        <div
          v-show="showPanelKey === ToolEnum.tool"
          class="absolute flex left-[42px] top-0 rd-4px overflow-hidden shadow-[0px_0px_6px_1px_#00367026]"
        >
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="距离测量"
            :class="[{ active: toolState.drawType === ToolTypeEnum.ruler }]"
            @click="handleToolAction(ToolTypeEnum.ruler)"
          >
            <SvgIcon name="map-tool-ruler" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="区域面积"
            :class="[{ active: toolState.drawType === ToolTypeEnum.measure }]"
            @click="handleToolAction(ToolTypeEnum.measure)"
          >
            <SvgIcon name="map-tool-area" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="导出标绘"
            :class="[{ active: toolState.drawType === ToolTypeEnum.downfile }]"
            @click="exportGeoJsonFile"
          >
            <SvgIcon name="map-tool-import" class="icon-c" size="18" />
          </span>
          <span
            class="w-36px h-36px icon-c cursor-pointer flex items-center justify-center"
            title="导入标绘"
            :class="[{ active: toolState.drawType === ToolTypeEnum.openfile }]"
            @click="openFile"
          >
            <SvgIcon name="map-tool-export" class="icon-c" size="18" />
          </span>
          <input
            :accept="'.zip, .json, .geojson'"
            type="file"
            name="file"
            ref="fileDom"
            @change="importGeoJsonFile"
            v-show="false"
          />
        </div>
      </div>
    </div>

    <GraphMenu
      @on-delete-layer="onDeleteLayer"
      @on-edit-layer-info="onEditLayerInfo"
      @on-move-layer="moveSelectedLayer"
      @on-edit-overlay="editSelectedOverlay"
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
        :class="[`relative cursor-default whitespace-pre-wrap break-all max-w-80vw`]"
        :style="{ color: item.color, width: item.width ? `${item.width}px` : 'auto' }"
      >
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
  import { useMap } from '@/hooks/common/useMap';
  import { SvgIcon } from '@/components/Icon';
  import { onKeyStroke } from '@vueuse/core';
  import { Input, Button } from 'ant-design-vue';

  const map = ref<any>(null); // 总地图实例
  const layerGroup = ref<any>(null); // 总地图实例
  const mapWrap = ref<any>(null); // 总地图实例
  // 地图是否已加载
  const isInit = ref(false);
  const { message } = useMessage();

  const [registerModal, { openModal }] = useModal();
  const [registerTextModal, { openModal: openTextEditModal }] = useModal();
  const { l2Addr } = useLatlon2Addr();
  const toolStore = useToolStore();

  const { instance, onReady } = useMap('bigemap-global');

  const {
    toolState,
    handleToolAction,
    editSelectedOverlay,
    moveSelectedLayer,
    importGeoJsonFile,
    exportGeoJsonFile,
  } = useToolHooks({
    addDrawToPanel,
    selectOnpanel,
  });

  onReady(() => {
    map.value = instance.map;
    layerGroup.value = instance.layerGroup;
    mapWrap.value = instance.mapWrap;

    eventFn();
    isInit.value = true;
  });
  enum ToolEnum {
    search,
    position,
    base,
    military,
    tool,
  }

  const showPanelKey = ref<ToolEnum>(); // 面板显隐

  // const LyrListDom = ref(); // 图层列表Dom

  function onChangePanelKey(key: ToolEnum) {
    if (key === showPanelKey.value) {
      showPanelKey.value = undefined;
    } else {
      showPanelKey.value = key;
    }
  }

  // 监听 Escape 重置去拖动模式
  onKeyStroke(
    ['Escape'],
    (e) => {
      showPanelKey.value = undefined;
      e.preventDefault();
    },
    { target: document },
  );

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
  // function gotoFeature(f: any) {
  //   f.getBounds && map.value.fitBounds(f.getBounds());
  //   f.getLatLng && map.value.setView([Number(f.getLatLng().lat), Number(f.getLatLng().lng)]);
  // }

  // 地图选中图形，树结构节点处于选择状态
  function selectOnpanel(key: string) {
    // LyrListDom.value?.selectDataOnTree(key);
    console.log(key);
  }
  //  添加标绘节点至标绘图层面板
  function onDeleteLayer(e) {
    e.stopPropagation();
    if (!toolState.selected) return;
    const nodeKey = toolState.selected.overlay_id;
    toolState.selected.remove();
    toolState.layerGroup.removeLayer(toolState.selected);
    delete toolState.markers[nodeKey];
    mitter.emit(MEventEnum.HideContextMenu);
    toolState.selected = undefined;
    console.log(nodeKey);
    // LyrListDom.value?.deleteDataFromTree(nodeKey);
  }
  //  编辑要素属性
  function onEditLayerInfo(e) {
    handleToolAction(ToolTypeEnum.drag);
    e.stopPropagation ? e.stopPropagation() : null;
    mitter.emit(MEventEnum.HideContextMenu);
    currentGraphic = toolState.selected;
    openModal(true, {
      id: toolState.selected.overlay_id,
      attr: toolState.selected.options.attribution,
      isUpdate: false,
    });
  }
  //  更新要素属性
  function updateAttribute(value: any) {
    if (value.type === ToolTypeEnum.text) {
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

  onBeforeUnmount(() => {
    isInit.value = false;
    map.value = null;
  });

  const fileDom = ref<HTMLInputElement>();

  const openFile = () => {
    handleToolAction(ToolTypeEnum.openfile);
    fileDom.value?.click();
  };
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
    z-index: 10;
    top: 15px;
    left: 15px;
    width: 21rem;
    transition: all 0.5s ease-out;
    background-color: #fff0;
  }

  .icon-f {
    background: #fff;
    cursor: pointer;

    svg {
      fill: #666;
    }

    &:hover {
      background: #0960bd;

      svg {
        fill: #fff;
      }
    }

    &.active {
      background: #0960bd;

      svg {
        fill: #fff;
      }
    }
  }

  .icon-c {
    background: #fff;
    cursor: pointer;

    svg {
      fill: #666;
    }

    &:hover {
      background: #f1f1f1;

      svg {
        fill: #0960bd;
      }
    }

    &.active {
      svg {
        fill: #0960bd;
      }
    }
  }
</style>

<style>
  svg {
    background: transparent !important;
  }
</style>
