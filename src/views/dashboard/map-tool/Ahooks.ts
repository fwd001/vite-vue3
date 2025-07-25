// 类型定义
import { onBeforeUnmount, reactive } from 'vue';
import { usePsMapStore } from '@/store/modules/psMap';
import { MEventEnum } from '@/enums/mittEnum';
import * as turf from '@turf/turf';
import mitter from '@/views/utils/mitt';
import { buildUUID } from '@/utils/uuid';
import { onKeyStroke } from '@vueuse/core';
import { formatIcon, defaultIcon, iconPublicPath } from './utils';
import { ToolTypeEnum } from './enum';
import { useToolStore } from './useToolStore';
import { cloneDeep } from 'lodash-es';
import { useMap } from '@/hooks/common/useMap';
import type { Recordable } from 'packages/types/src/utils';

// 标点数据类型
/**
 * 地图标点数据结构
 * @property lat 纬度
 * @property lng 经度
 * @property overlay_id 唯一ID
 * @property type 工具类型
 * @property icon 图标URL
 * @property iconSize 图标尺寸
 * @property iconAnchor 图标锚点
 * @property title 标题
 */
type MarkerData = {
  lat: number;
  lng: number;
  overlay_id: string;
  type: ToolTypeEnum;
  icon?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  title?: string;
};
// 覆盖物数据类型
/**
 * 地图覆盖物数据结构（线、多边形、圆等）
 * @property path 路径坐标
 * @property overlay_id 唯一ID
 * @property type 工具类型
 * @property attribution 属性信息
 * @property radius 半径（圆形专用）
 * @property title 标题
 */
type OverlayData = {
  path: any;
  overlay_id: string;
  type: ToolTypeEnum | string;
  attribution?: Recordable;
  radius?: number;
  title?: string;
};
// 工具响应式状态类型
/**
 * 工具栏全局响应式状态
 * @property map 地图实例
 * @property layerGroup 图层组
 * @property drawType 当前绘制类型
 * @property markers 标点集合
 * @property selected 当前选中对象
 * @property treeSelected 树选中集合
 * @property currentFolderId 当前文件夹ID
 * @property overlay 覆盖物集合
 * @property icons 图标集合
 * @property draw 绘制工具集合
 * @property militaryDraw 军标绘制工具
 * @property militaryEdit 军标编辑工具
 * @property parseOption 解析参数
 * @property drawMarker 绘制标点
 * @property drawOverlay 绘制覆盖物
 */
type ToolState = Recordable & {
  map?: any;
  layerGroup?: any;
  drawType: ToolTypeEnum;
  markers: Recordable<any>;
  selected?: any;
  treeSelected: Recordable<any>;
  currentFolderId: string | null;
  overlay: Recordable<any>;
  icons?: Recordable<any>;
  draw?: Recordable<any>;
  militaryDraw?: any;
  militaryEdit?: any;
  parseOption: (data: Recordable) => Recordable;
  drawMarker?: (data: MarkerData) => any;
  drawOverlay?: (data: OverlayData) => any;
};

/**
 * 地图标绘工具主入口，返回一组操作API
 * @param options 可选参数（如添加到面板、选中回调）
 * @returns { toolState, handleToolAction, editSelectedOverlay, moveSelectedLayer, importGeoJsonFile, exportGeoJsonFile }
 */
export function useToolHooks(options?: {
  addDrawToPanel?: (graphic: any) => void;
  selectOnpanel?: (key: string) => void;
}) {
  const mapStore = usePsMapStore();
  const toolStore = useToolStore();
  const { instance, onReady } = useMap('bigemap-global');
  // 响应式工具状态
  const toolState = reactive<ToolState>({
    drawType: ToolTypeEnum.drag,
    markers: {},
    selected: undefined,
    treeSelected: {},
    currentFolderId: null,
    overlay: {},
    parseOption(data: Recordable) {
      // 解析覆盖物参数，兼容不同属性命名
      const option: Recordable = {};
      if (data.color) option.color = data.color;
      if (data.fill_color) option.fillColor = data.fill_color;
      if (data.fill_opacity) option.fillOpacity = data.fill_opacity;
      if (data.opacity) option.opacity = data.opacity;
      if (data.weight) option.weight = data.weight;
      if (data.attribution) option.attribution = data.attribution;
      return option;
    },
  });

  // 地图初始化完成后，初始化工具
  onReady(() => {
    toolState.map = instance.map;
    toolState.layerGroup = instance.layerGroup;
    initTool();
    registerMapEvents();
  });

  /**
   * 激活军标绘制工具
   * @param type 军标类型
   */
  function activateMilitaryDraw(type: ToolTypeEnum) {
    if (toolState.militaryEdit?.isEdit()) {
      toolState.militaryEdit.disable();
    }
    toolState.militaryDraw.enable(type);
  }

  /**
   * 工具栏操作切换，自动禁用其他操作
   * @param action 工具类型
   */
  function handleToolAction(action: ToolTypeEnum): void {
    // 禁用所有绘制/编辑/拖动/测量
    if (toolState.draw) {
      for (const i in toolState.draw) {
        toolState.draw[i]?.disable?.();
      }
    }
    toolState.drawType = action;
    mapStore.setToolDrawType(action);
    toolState.militaryDraw?.disable?.();
    toolState.militaryEdit?.disable?.();
    // 退出编辑/拖动状态
    if (toolState.selected && toolState.selected.is_editing) {
      toolState.selected.editing.disable();
      toolState.selected.is_editing = false;
    }
    toolState.selected && toolState.selected.dragging && toolState.selected.dragging.disable();
    // 根据类型启用对应工具
    switch (action) {
      case ToolTypeEnum.marker:
      case ToolTypeEnum.polyline:
      case ToolTypeEnum.polygon:
      case ToolTypeEnum.circle:
      case ToolTypeEnum.rectangle:
      case ToolTypeEnum.measure:
      case ToolTypeEnum.ruler:
        if (toolState.draw) {
          toolState.draw[action]?.enable?.();
        }
        break;
      case ToolTypeEnum.straightArrow:
      case ToolTypeEnum.fineArrow:
      case ToolTypeEnum.assaultDirection:
      case ToolTypeEnum.squadCombat:
      case ToolTypeEnum.tailedSquadCombat:
      case ToolTypeEnum.doubleArrow:
      case ToolTypeEnum.attackArrow:
        activateMilitaryDraw(action);
        break;
      default:
        break;
    }
  }

  /**
   * 解析覆盖物参数，统一属性格式
   * @param data 覆盖物原始数据
   * @returns 规范化后的参数对象
   */
  function getOverlayOptions(data: Recordable): Recordable {
    const option: Recordable = {};
    if (data.color) option.color = data.color;
    if (data.fill_color) option.fillColor = data.fill_color;
    if (data.fill_opacity) option.fillOpacity = data.fill_opacity;
    if (data.opacity) option.opacity = data.opacity;
    if (data.weight) option.weight = data.weight;
    if (data.attribution) option.attribution = data.attribution;
    return option;
  }

  /**
   * 绑定覆盖物/标点的点击和右键事件
   * @param overlay 覆盖物对象
   * @param type 类型（marker/overlay）
   * @param selectCb 选中回调
   */
  function bindOverlayEvents(overlay: any, type: string, selectCb?: (id: string) => void) {
    overlay.on('click', () => {
      toolState.selected = overlay;
      selectCb?.(overlay.overlay_id);
    });
    overlay.on('contextmenu', (e: any) => {
      handleToolAction(ToolTypeEnum.drag);
      toolState.selected = overlay;
      mitter.emit(MEventEnum.ShowContextMenu, {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        type,
      });
    });
  }

  /**
   * 创建地图标点，并绑定事件
   * @param data 标点数据
   * @param selectCb 选中回调
   * @returns marker对象
   */
  function createMarker(data: MarkerData, selectCb?: (id: string) => void): any {
    const marker = BM.marker([data.lat, data.lng], {
      attribution: {
        type: data.type,
        name: '标点',
        id: buildUUID(),
        pointIcon: defaultIcon,
      },
    });
    if (data.icon) {
      let i;
      if (typeof toolState.icons?.[data.icon] !== 'undefined') {
        i = toolState.icons[data.icon];
        marker.setIcon(
          BM.icon({
            iconUrl: data.icon,
            iconSize: [i.width, i.height],
            iconAnchor: [Math.floor(i.width / 2), i.height],
          }),
        );
      } else {
        marker.setIcon(
          BM.icon({
            iconUrl: data.icon,
            iconSize: data?.iconSize || [30, 41],
            iconAnchor: data?.iconAnchor || [20, 41],
          }),
        );
      }
    }
    if (data.title) marker.bindTooltip(data.title, { direction: 'bottom', permanent: true });
    marker.overlay_id = data.overlay_id;
    bindOverlayEvents(marker, ToolTypeEnum.marker, selectCb);
    return marker;
  }

  /**
   * 创建地图覆盖物（线、多边形、圆等），并绑定事件
   * @param data 覆盖物数据
   * @param selectCb 选中回调
   * @returns overlay对象
   */
  function createOverlay(data: OverlayData, selectCb?: (id: string) => void): any {
    let overlay;
    const option = getOverlayOptions(data);
    option.attribution = data.attribution;
    switch (data.type) {
      case ToolTypeEnum.polyline:
        overlay = BM.polyline(data.path, option);
        break;
      case ToolTypeEnum.polygon:
        overlay = BM.polygon(data.path, option);
        break;
      case ToolTypeEnum.rectangle:
        overlay = BM.rectangle(data.path, option);
        break;
      case ToolTypeEnum.circle:
        // 圆形特殊处理，转为多边形
        option.radius = data.radius || data.path.radius;
        const cc = BM.circle(data.path.center || data.path, option);
        const a = turf.circle([cc.getPath()[1], cc.getPath()[0]], cc.getRadius() / 1000, {
          units: 'kilometers',
        });
        const flpa = turf.flip(a);
        overlay = BM.polygon(flpa.geometry.coordinates[0], option);
        break;
      case 'circle_marker':
        overlay = BM.circleMarker(data.path, { radius: data.radius });
        break;
      default:
        return false;
    }
    if (data.title) overlay.bindTooltip(data.title, { direction: 'bottom' });
    overlay.overlay_id = data.overlay_id;
    bindOverlayEvents(overlay, 'overlay', selectCb);
    return overlay;
  }

  // 绘制标点（对外暴露，兼容老接口）
  toolState.drawMarker = function (data: MarkerData): any {
    return createMarker(data, options?.selectOnpanel);
  };

  // 绘制覆盖物（对外暴露，兼容老接口）
  toolState.drawOverlay = function (data: OverlayData): any {
    return createOverlay(data, options?.selectOnpanel);
  };

  // 监听 Escape 键，重置为拖动模式
  onKeyStroke(
    ['Escape'],
    (e: KeyboardEvent) => {
      handleToolAction(ToolTypeEnum.drag);
      e.preventDefault();
    },
    { target: document },
  );

  /**
   * 图层移动，支持拖拽
   * @param e 事件对象
   */
  function moveSelectedLayer(e: any): void {
    handleToolAction(ToolTypeEnum.drag);
    e.stopPropagation?.();
    mitter.emit(MEventEnum.HideContextMenu);
    if (!toolState.selected) return;
    toolState.selected.dragging.enable();
    toolState.selected.once('dragend', function (evt: any) {
      evt.stopPropagation?.();
      toolState.selected?.dragging?.disable();
      toolState.selected = undefined;
    });
  }

  /**
   * 编辑当前选中覆盖物，进入编辑模式
   * @param e 事件对象
   */
  function editSelectedOverlay(e: any): void {
    handleToolAction(ToolTypeEnum.drag);
    e.stopPropagation();
    if (!toolState.selected && !toolState.selected?.is_editing) return;
    toolState.selected.editing.enable();
    toolState.selected.is_editing = true;
    toolState.militaryDraw?.disable?.();
    !toolState.militaryEdit.isEdit() && toolState.militaryEdit.edit(toolState.selected);
    mitter.emit(MEventEnum.HideContextMenu);
  }

  // 组件卸载时清理地图引用，防止内存泄漏
  onBeforeUnmount(() => {
    toolState.map = null;
    toolState.layerGroup = null;
  });

  /**
   * 工具初始化，注册所有绘制/编辑工具
   */
  function initTool(): void {
    toolState.militaryDraw = new BM.Plot.Draw(toolState.map, {
      repeat: true,
      absorb: {
        distance: 10,
        marker: BM.circleMarker([0, 0], {
          radius: 6,
          weight: 1,
          fillOpacity: 1,
          fillColor: 'white',
        }),
      },
      doubleArrow: {
        attribution: {
          type: 'doubleArrow',
          name: '双箭头',
        },
      },
    });
    toolState.militaryEdit = new BM.Plot.Edit(toolState.map, {
      absorb: {
        distance: 10,
        marker: BM.circleMarker([0, 0], {
          radius: 6,
          weight: 1,
          fillOpacity: 1,
          fillColor: 'white',
        }),
      },
    });
    toolState.draw = {
      marker: new BM.Draw.Marker(toolState.map, { repeatMode: true }),
      polyline: new BM.Draw.Polyline(toolState.map, { repeatMode: true }),
      polygon: new BM.Draw.Polygon(toolState.map, { repeatMode: true }),
      circle: new BM.Draw.Circle(toolState.map, { repeatMode: true }),
      rectangle: new BM.Draw.Rectangle(toolState.map, { repeatMode: true }),
      measure: new BM.Draw.Polygon(toolState.map, { repeatMode: false }),
      ruler: BM.control.measure({}).addTo(toolState.map),
    };
  }

  /**
   * 注册地图及军标相关事件
   * 1. 地图绘制完成自动添加到图层组
   * 2. 支持测量、文本、右键菜单等
   */
  function registerMapEvents(): void {
    const { iconName, width, height } = formatIcon(defaultIcon);
    toolState.map
      .on(BM.Draw.Event.CREATED, (e: any) => {
        const type = e.layerType;
        const layer: any = e.layer;
        const postData: any = { path: [], type };
        const overlayId = buildUUID();
        let overlay: any;
        switch (type) {
          case ToolTypeEnum.marker:
            postData.path = [layer.getLatLng()];
            overlay = createMarker(
              {
                lat: layer.getLatLng().lat,
                lng: layer.getLatLng().lng,
                overlay_id: overlayId,
                type,
                icon: `${iconPublicPath}${iconName}`,
                iconSize: [width, height],
                iconAnchor: [width / 2, height / 2],
              },
              options?.selectOnpanel,
            );
            break;
          case ToolTypeEnum.polygon:
            if (toolState.drawType === ToolTypeEnum.measure) {
              // 测量模式下，自动计算面积并显示
              let area = BM.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
              area = area.toFixed(2).toString() + '㎡';
              layer.bindTooltip(area, { permanent: true }).on('contextmenu', () => {
                handleToolAction(ToolTypeEnum.drag);
                layer.remove();
              });
              layer.feature = layer.toGeoJSON();
              layer.feature.properties = {
                type: toolState.drawType,
              };
              layer.addTo(toolState.layerGroup);
              toolState.drawType = ToolTypeEnum.drag;
              return;
            } else {
              overlay = createOverlay(
                {
                  path: layer.getLatLngs(),
                  overlay_id: overlayId,
                  type,
                  attribution: {
                    type,
                    name: '多边形',
                  },
                },
                options?.selectOnpanel,
              );
              postData.path = layer.getLatLngs()[0];
            }
            break;
          case ToolTypeEnum.polyline:
            overlay = createOverlay(
              {
                path: layer.getLatLngs(),
                overlay_id: overlayId,
                type,
                attribution: {
                  type,
                  name: '多段线',
                },
              },
              options?.selectOnpanel,
            );
            postData.path = layer.getLatLngs();
            break;
          case ToolTypeEnum.rectangle:
            overlay = createOverlay(
              {
                path: [layer.getLatLngs()[0], layer.getLatLngs()[2]],
                overlay_id: overlayId,
                type,
                attribution: {
                  type,
                  name: '矩形',
                },
              },
              options?.selectOnpanel,
            );
            postData.path = [layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]];
            break;
          case ToolTypeEnum.circle:
            postData.path = [layer.getLatLng()];
            postData.radius = layer.getRadius();
            overlay = createOverlay(
              {
                path: layer.getLatLng(),
                radius: layer.getRadius(),
                overlay_id: overlayId,
                type,
                attribution: {
                  type,
                  name: '圆形',
                },
              },
              options?.selectOnpanel,
            );
            break;
          default:
            return;
        }
        if (!overlay) return false;
        // 分类存储
        if (postData.type === ToolTypeEnum.marker) {
          toolState.markers[overlayId] = overlay;
        } else {
          toolState.overlay[overlayId] = overlay;
        }
        toolState.treeSelected[overlayId] = 1;
        if (toolState.currentFolderId) postData.pid = toolState.currentFolderId;
        overlay.addTo(toolState.layerGroup);
        postData.type = type;
        postData.overlay_id = overlayId;
        postData.path = postData.path.map((v: any) => [v.lat, v.lng]);
        overlay.feature = overlay.toGeoJSON();
        overlay.feature.properties = overlay.options.attribution;
        options?.addDrawToPanel?.(overlay);
      })
      .on('stop_measure', function () {
        toolState.drawType = ToolTypeEnum.drag;
      })
      .on(BM.Draw.Event.DRAWSTOP, function () {})
      .on('click', function (e: any) {
        // 编辑状态下自动退出
        if (toolState.selected && toolState.selected.is_editing) {
          toolState.selected.editing.disable();
          toolState.selected.is_editing = false;
        }
        // 文本模式下添加文本
        if (toolState.drawType === ToolTypeEnum.text) {
          const newList = cloneDeep(toolStore.textList);
          newList.push({
            id: buildUUID(),
            latlng: [e.latlng.lat, e.latlng.lng],
            content: '双击编辑！',
            backgroundColor: '#fff',
            color: '#333',
            width: 0,
          });
          toolStore.setTextList(newList);
          e.originalEvent.stopPropagation();
        }
      })
      .on('contextmenu', function () {
        handleToolAction(ToolTypeEnum.drag);
      });
    // 军标事件
    toolState.militaryDraw.on('bm_draw_end', function (e: any) {
      const typeList: Recordable<string> = {
        straightArrow: '直线箭头',
        fineArrow: '尖直箭头',
        assaultDirection: '粗直头箭',
        squadCombat: '粗曲线箭头',
        tailedSquadCombat: '燕尾曲线箭头',
        doubleArrow: '双箭头',
        attackArrow: '进攻方向',
      };
      const type = e.detail.type;
      const overlayId = buildUUID();
      const overlay = e.detail.layer;
      overlay.overlay_id = overlayId;
      overlay.options.attribution = { id: buildUUID() };
      overlay.getAttribution().type = type;
      overlay.getAttribution().name = typeList[type];
      overlay.addTo(toolState.layerGroup);
      toolState.militaryDraw.addAbsorbLayer(overlay);
      toolState.militaryEdit.addAbsorbLayer(overlay);
      overlay.feature = overlay.toGeoJSON();
      overlay.feature.properties = overlay.options.attribution;
      options?.addDrawToPanel?.(overlay);
      overlay.on('click', (le: any) => {
        toolState.selected = le.target;
        options?.selectOnpanel?.(toolState.selected.overlay_id);
      });
      overlay.on('contextmenu', (re: any) => {
        handleToolAction(ToolTypeEnum.drag);
        mitter.emit(MEventEnum.ShowContextMenu, {
          x: re.containerPoint.x,
          y: re.containerPoint.y,
          type: 'military',
        });
        toolState.selected = re.target;
      });
    });
  }

  /**
   * 导入GeoJSON文件，自动解析并添加到地图
   * @param evt 事件对象
   */
  function importGeoJsonFile(evt: Recordable): void {
    const files = (evt.target as HTMLInputElement).files;
    const file: any = files && files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file!);
    reader.onload = (ev: any) => {
      const data = ev.target?.result;
      const jsonData = JSON.parse(data as string);
      jsonData.features.forEach((val: any) => {
        const type = val.geometry.type;
        const properties = val.properties;
        let overlay: any;
        if (type === 'Point') {
          const { iconName, width, height } = formatIcon(properties.pointIcon);
          overlay = createMarker(
            {
              lat: val.geometry.coordinates[1],
              lng: val.geometry.coordinates[0],
              overlay_id: properties.id,
              type: properties.type,
              icon: `${iconPublicPath}${iconName}`,
              iconSize: [width, height],
              iconAnchor: [width / 2, height / 2],
            },
            options?.selectOnpanel,
          );
        }
        if (type === 'Polygon') {
          const coordinates = val.geometry.coordinates[0].map((coord: any) => ({
            lat: coord[1],
            lng: coord[0],
          }));
          overlay = createOverlay(
            {
              path: coordinates,
              overlay_id: properties.id,
              type: properties.type,
              attribution: {
                ...properties,
                color: properties.lineColor ?? '#3388ff',
                lineColor: properties.lineColor ?? '#3388ff',
                fillColor: properties.fillColor ?? '#3388ff',
              },
            },
            options?.selectOnpanel,
          );
        }
        if (type === 'LineString') {
          const coordinates = val.geometry.coordinates.map((coord: any) => ({
            lat: coord[1],
            lng: coord[0],
          }));
          overlay = createOverlay(
            {
              path: coordinates,
              overlay_id: properties.id,
              type: properties.type,
              attribution: {
                ...properties,
                color: properties.lineColor ?? '#3388ff',
              },
            },
            options?.selectOnpanel,
          );
        }
        if (type === 'Text') {
          const newList = cloneDeep(toolStore.textList);
          newList.push({ ...properties });
          toolStore.setTextList(newList);
        }
        if (overlay) {
          if (['LineString', 'Polygon'].includes(type)) {
            if (properties.type === ToolTypeEnum.measure) {
              // 测量模式下自动显示面积
              let area = BM.GeometryUtil.geodesicArea(overlay.getLatLngs()[0]);
              area = area.toFixed(2).toString() + '㎡';
              overlay.bindTooltip(area, { permanent: true }).on('contextmenu', () => {
                handleToolAction(ToolTypeEnum.drag);
                overlay.remove();
              });
            } else {
              overlay.on('click', () => {
                toolState.selected = overlay;
                options?.selectOnpanel?.(toolState.selected.overlay_id);
              });
              overlay.on('contextmenu', (e: any) => {
                handleToolAction(ToolTypeEnum.drag);
                toolState.selected = overlay;
                mitter.emit(MEventEnum.ShowContextMenu, {
                  x: e.containerPoint.x,
                  y: e.containerPoint.y,
                  type: 'overlay',
                });
              });
            }
          }
          overlay.overlay_id = properties.id;
          overlay.options.attribution = properties;
          overlay.feature = overlay.toGeoJSON();
          overlay.feature.properties = properties;
          overlay.addTo(toolState.layerGroup);
        }
      });
      // 过滤掉 text 点， text 类型 点没有真实地图点位
      jsonData.features = jsonData.features.filter((v: any) => v.geometry.type !== 'Text');
      // 自适应缩放
      if (jsonData.features.length > 0) {
        toolState.map.fitBounds(toolState.layerGroup.getBounds());
      }
    };
  }

  /**
   * 导出当前所有图层为GeoJSON文件，支持text类型
   */
  function exportGeoJsonFile(): void {
    handleToolAction(ToolTypeEnum.downfile);
    const data = toolState.layerGroup.toGeoJSON();
    // 添加text 类型
    toolStore.textList.forEach((v: any) => {
      data.features.push({
        type: 'Feature',
        geometry: {
          type: 'Text',
          coordinates: v.latlng,
        },
        properties: {
          id: v.id,
          latlng: v.latlng,
          content: v.content,
          backgroundColor: v.backgroundColor,
          color: v.color,
          width: v.width,
        },
      });
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '标绘图层.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // 导出核心API
  return {
    toolState,
    handleToolAction,
    editSelectedOverlay,
    moveSelectedLayer,
    importGeoJsonFile,
    exportGeoJsonFile,
  };
}
