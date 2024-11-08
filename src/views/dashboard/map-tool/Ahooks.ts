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

export function useToolHooks(options?: {
  addDrawToPanel?: (graphic: any) => void;
  selectOnpanel?: (key: string) => void;
}) {
  const mapStroe = usePsMapStore();
  const toolStore = useToolStore();
  const { instance, onMapMounted } = useMap('bigemap-global');
  const toolData = reactive<Recordable>({
    // map: undefined,
    // layerGroup: undefined,
    drawType: ToolTypeEnum.drag,
    markers: {},
    selected: undefined,
    treeSelected: {},
    currentFolderId: null,
    overlay: {},
    parseOption(data) {
      const option: Recordable = {};
      data.color ? (option.color = data.color) : true;
      data.fill_color ? (option.fillColor = data.fill_color) : true;
      data.fill_opacity ? (option.fillOpacity = data.fill_opacity) : true;
      data.opacity ? (option.opacity = data.opacity) : true;
      data.weight ? (option.weight = data.weight) : true;
      data.attribution ? (option.attribution = data.attribution) : true;
      return option;
    },
  });
  onMapMounted(() => {
    toolData.map = instance.map;
    toolData.layerGroup = instance.layerGroup;
    dataInit();
    eventFn();
  });

  function activate(e) {
    // 如果当前处于编辑模式，则退出编辑模式
    if (toolData.militaryEdit.isEdit()) {
      toolData.militaryEdit.disable();
    }

    // 启用绘制模式
    toolData.militaryDraw.enable(e);
  }

  function onOperateClick(action: ToolTypeEnum) {
    // 清除正在标绘、正在编辑、正在拖动、测量等效果
    for (const i in toolData.draw) {
      toolData.draw[i].disable();
    }
    toolData.drawType = action;
    mapStroe.setToolDrawType(action);
    toolData.militaryDraw?.disable?.();
    toolData.militaryEdit?.disable?.();
    if (toolData.selected && toolData.selected.is_editing) {
      toolData.selected.editing.disable();
      toolData.selected.is_editing = false;
    }
    toolData.selected && toolData.selected.dragging && toolData.selected.dragging.disable();
    // 开始标绘、测量
    switch (action) {
      case ToolTypeEnum.marker:
      case ToolTypeEnum.polyline:
      case ToolTypeEnum.polygon:
      case ToolTypeEnum.circle:
      case ToolTypeEnum.rectangle:
      case ToolTypeEnum.measure:
      case ToolTypeEnum.ruler:
        toolData.draw[action].enable();
        break;
      case ToolTypeEnum.straightArrow:
      case ToolTypeEnum.fineArrow:
      case ToolTypeEnum.assaultDirection:
      case ToolTypeEnum.squadCombat:
      case ToolTypeEnum.tailedSquadCombat:
      case ToolTypeEnum.doubleArrow:
      case ToolTypeEnum.attackArrow:
        activate(action);
        break;
      default:
        break;
    }
  }

  toolData.drawMarker = function (data) {
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
      typeof toolData.icons?.[data.icon] !== 'undefined'
        ? (i = toolData.icons[data.icon]) &&
          marker.setIcon(
            BM.icon({
              iconUrl: data.icon,
              iconSize: [i.width, i.height],
              iconAnchor: [Math.floor(i.width / 2), i.height],
            }),
          )
        : marker.setIcon(
            BM.icon({
              iconUrl: data.icon,
              iconSize: data?.iconSize || [30, 41],
              iconAnchor: data?.iconAnchor || [20, 41],
            }),
          );
    }
    data.title && marker.bindTooltip(data.title, { direction: 'bottom', permanent: true });
    marker.overlay_id = data.overlay_id;
    marker.on('click', () => {
      toolData.selected = marker;
      options?.selectOnpanel?.(toolData.selected.overlay_id);
    });
    marker.on('contextmenu', (e) => {
      onOperateClick(ToolTypeEnum.drag);
      mitter.emit(MEventEnum.ShowContextMenu, {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        type: ToolTypeEnum.marker,
      });
      toolData.selected = marker;
    });
    return marker;
  };

  toolData.drawOverlay = function (data) {
    let overlay;
    const option = toolData.parseOption(data);
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
    data.title && overlay.bindTooltip(data.title, { direction: 'bottom' });
    overlay.overlay_id = data.overlay_id;
    overlay.on('click', () => {
      toolData.selected = overlay;
      options?.selectOnpanel?.(toolData.selected.overlay_id);
    });
    overlay.on('contextmenu', (e) => {
      onOperateClick(ToolTypeEnum.drag);
      toolData.selected = overlay;
      mitter.emit(MEventEnum.ShowContextMenu, {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        type: 'overlay',
      });
    });
    return overlay;
  };
  // 监听 Escape 重置去拖动模式
  onKeyStroke(
    ['Escape'],
    (e) => {
      onOperateClick(ToolTypeEnum.drag);
      e.preventDefault();
    },
    { target: document },
  );

  // 移动
  function onMoveLayer(e) {
    onOperateClick(ToolTypeEnum.drag);
    e.stopPropagation ? e.stopPropagation() : null;
    mitter.emit(MEventEnum.HideContextMenu);
    if (!toolData.selected) return;
    toolData.selected.dragging.enable();
    toolData.selected.once('dragend', function (e) {
      e.stopPropagation ? e.stopPropagation() : null;
      toolData.selected && toolData.selected.dragging && toolData.selected.dragging.disable();
      toolData.selected = undefined;
    });
  }

  // 修改路径
  function onEditOverlay(e) {
    onOperateClick(ToolTypeEnum.drag);
    e.stopPropagation();
    if (!toolData.selected && !toolData.selected?.is_editing) return;
    toolData.selected.editing.enable();
    toolData.selected.is_editing = true;
    toolData.militaryDraw.disable && toolData.militaryDraw.disable();
    !toolData.militaryEdit.isEdit() && toolData.militaryEdit.edit(toolData.selected);
    mitter.emit(MEventEnum.HideContextMenu);
  }

  onBeforeUnmount(() => {
    toolData.map = null;
    toolData.layerGroup = null;
  });

  const dataInit = () => {
    // 军标标绘
    toolData.militaryDraw = new BM.Plot.Draw(toolData.map, {
      repeat: !0,
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
        // color: 'pink',
        attribution: {
          type: 'doubleArrow',
          name: '双箭头',
        },
      },
    });
    // 军标编辑
    toolData.militaryEdit = new BM.Plot.Edit(toolData.map, {
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
    toolData.draw = {
      marker: new BM.Draw.Marker(toolData.map, { repeatMode: true }),
      polyline: new BM.Draw.Polyline(toolData.map, { repeatMode: true }),
      polygon: new BM.Draw.Polygon(toolData.map, { repeatMode: true }),
      circle: new BM.Draw.Circle(toolData.map, { repeatMode: true }),
      rectangle: new BM.Draw.Rectangle(toolData.map, { repeatMode: true }),
      measure: new BM.Draw.Polygon(toolData.map, { repeatMode: false }),
      ruler: BM.control.measure({}).addTo(toolData.map),
    };
  };

  function eventFn() {
    const { iconName, width, height } = formatIcon(defaultIcon);
    toolData.map
      .on(BM.Draw.Event.CREATED, (e) => {
        const type = e.layerType;
        const layer: any = e.layer;
        const post_data: any = { path: [], type: type };
        const overlay_id = buildUUID();
        let overlay: any;
        switch (type) {
          case ToolTypeEnum.marker:
            post_data.path = [layer.getLatLng()];
            overlay = toolData.drawMarker({
              lat: layer.getLatLng().lat,
              lng: layer.getLatLng().lng,
              overlay_id: overlay_id,
              type: type,
              icon: `${iconPublicPath}${iconName}`,
              iconSize: [width, height],
              iconAnchor: [width / 2, height / 2],
            });
            break;
          case ToolTypeEnum.polygon:
            if (toolData.drawType === ToolTypeEnum.measure) {
              let area = BM.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
              area = area.toFixed(2).toString() + '㎡';
              layer.bindTooltip(area, { permanent: true }).on('contextmenu', () => {
                onOperateClick(ToolTypeEnum.drag);
                layer.remove();
              });
              layer.feature = layer.toGeoJSON();
              layer.feature.properties = {
                type: toolData.drawType,
              };
              layer.addTo(toolData.layerGroup);
              toolData.drawType = ToolTypeEnum.drag;
              return;
            } else {
              overlay = toolData.drawOverlay({
                path: layer.getLatLngs(),
                overlay_id: overlay_id,
                type: type,
                attribution: {
                  type: type,
                  name: '多边形',
                },
              });
              post_data.path = layer.getLatLngs()[0];
            }
            break;
          case ToolTypeEnum.polyline:
            overlay = toolData.drawOverlay({
              path: layer.getLatLngs(),
              overlay_id: overlay_id,
              type: type,
              attribution: {
                type: type,
                name: '多段线',
              },
            });
            post_data.path = layer.getLatLngs();
            break;
          case ToolTypeEnum.rectangle:
            overlay = toolData.drawOverlay({
              path: [layer.getLatLngs()[0], layer.getLatLngs()[2]],
              overlay_id: overlay_id,
              type: type,
              attribution: {
                type: type,
                name: '矩形',
              },
            });
            post_data.path = [layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]];
            break;
          case ToolTypeEnum.circle:
            post_data.path = [layer.getLatLng()];
            post_data.radius = layer.getRadius();
            overlay = toolData.drawOverlay({
              path: layer.getLatLng(),
              radius: layer.getRadius(),
              overlay_id: overlay_id,
              type: type,
              attribution: {
                type: type,
                name: '圆形',
              },
            });
            break;

          default:
            return;
        }
        if (!overlay) {
          return false;
        }

        if (post_data.type === ToolTypeEnum.marker) {
          toolData.markers[overlay_id] = overlay;
        } else {
          toolData.overlay[overlay_id] = overlay;
        }
        toolData.treeSelected[overlay_id] = 1;

        toolData.currentFolderId ? (post_data.pid = toolData.currentFolderId) : 0;
        overlay.addTo(toolData.layerGroup);
        post_data.type = type;
        post_data.overlay_id = overlay_id;
        post_data.path = post_data.path.map(function (v) {
          return [v.lat, v.lng];
        });
        overlay.feature = overlay.toGeoJSON();
        overlay.feature.properties = overlay.options.attribution;
        options?.addDrawToPanel?.(overlay);
      })
      .on('stop_measure', function () {
        toolData.drawType = ToolTypeEnum.drag;
      })
      .on(BM.Draw.Event.DRAWSTOP, function () {})
      .on('click', function (e) {
        if (toolData.selected && toolData.selected.is_editing) {
          toolData.selected.editing.disable();
          toolData.selected.is_editing = false;
        }
        if (toolData.drawType === ToolTypeEnum.text) {
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
        onOperateClick(ToolTypeEnum.drag);
      });
    // 军标事件
    toolData.militaryDraw.on('bm_draw_end', function (e) {
      const typeList = {
        straightArrow: '直线箭头',
        fineArrow: '尖直箭头',
        assaultDirection: '粗直头箭',
        squadCombat: '粗曲线箭头',
        tailedSquadCombat: '燕尾曲线箭头',
        doubleArrow: '双箭头',
        attackArrow: '进攻方向',
        // tailedAttackArrow: '进攻方向（燕尾）',
      };
      const type = e.detail.type;
      const overlay_id = buildUUID();
      const overlay = e.detail.layer;

      overlay.overlay_id = overlay_id;
      overlay.options.attribution = {
        id: buildUUID(),
      };
      overlay.getAttribution().type = type;
      overlay.getAttribution().name = typeList[type];
      overlay
        // .bindTooltip('右键编辑!', { permanent: true, direction: 'bottom' })
        .addTo(toolData.layerGroup);
      toolData.militaryDraw.addAbsorbLayer(overlay);
      toolData.militaryEdit.addAbsorbLayer(overlay);
      overlay.feature = overlay.toGeoJSON();
      overlay.feature.properties = overlay.options.attribution;
      options?.addDrawToPanel?.(overlay);

      overlay.on('click', (le: any) => {
        toolData.selected = le.target;
        options?.selectOnpanel?.(toolData.selected.overlay_id);
      });
      overlay.on('contextmenu', (re: any) => {
        onOperateClick(ToolTypeEnum.drag);
        mitter.emit(MEventEnum.ShowContextMenu, {
          x: re.containerPoint.x,
          y: re.containerPoint.y,
          type: 'military',
        });
        toolData.selected = re.target;
      });
    });
  }
  // 保存导入导出功能
  const onChangeFile = (evt: Recordable) => {
    const files = (evt.target as HTMLInputElement).files;
    const file: any = files && files[0];
    const reader = new FileReader();

    reader.readAsText(file!);
    reader.onload = (ev: any) => {
      const data = ev.target?.result; //获取内容
      const jsonData = JSON.parse(data as string);
      // console.log('jsonData', jsonData);

      jsonData.features.forEach((val) => {
        const type = val.geometry.type;
        const properties = val.properties;
        let overlay: any;
        if (type === 'Point') {
          const { iconName, width, height } = formatIcon(properties.pointIcon);
          overlay = toolData.drawMarker({
            lat: val.geometry.coordinates[1],
            lng: val.geometry.coordinates[0],
            overlay_id: properties.id,
            type: properties.type,
            icon: `${iconPublicPath}${iconName}`,
            iconSize: [width, height],
            iconAnchor: [width / 2, height / 2],
          });
        }
        if (type === 'Polygon') {
          const coordinates = val.geometry.coordinates[0].map((coord) => {
            return { lat: coord[1], lng: coord[0] };
          });
          overlay = BM.polygon(coordinates, {
            ...properties,
            color: properties.lineColor ?? '#3388ff',
            lineColor: properties.lineColor ?? '#3388ff',
            fillColor: properties.fillColor ?? '#3388ff',
          });
        }
        if (type === 'LineString') {
          const coordinates = val.geometry.coordinates.map((coord) => {
            return { lat: coord[1], lng: coord[0] };
          });
          overlay = BM.polyline(coordinates, {
            ...properties,
            color: properties.lineColor ?? '#3388ff',
          });
        }

        if (type === 'Text') {
          const newList = cloneDeep(toolStore.textList);
          newList.push({
            ...properties,
          });
          toolStore.setTextList(newList);
        }

        if (overlay) {
          if (['LineString', 'Polygon'].includes(type)) {
            if (properties.type === ToolTypeEnum.measure) {
              let area = BM.GeometryUtil.geodesicArea(overlay.getLatLngs()[0]);
              area = area.toFixed(2).toString() + '㎡';
              overlay.bindTooltip(area, { permanent: true }).on('contextmenu', () => {
                onOperateClick(ToolTypeEnum.drag);
                overlay.remove();
              });
            } else {
              overlay.on('click', () => {
                toolData.selected = overlay;
                options?.selectOnpanel?.(toolData.selected.overlay_id);
              });
              overlay.on('contextmenu', (e) => {
                onOperateClick(ToolTypeEnum.drag);
                toolData.selected = overlay;
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
          overlay.addTo(toolData.layerGroup);
        }
      });
      // 过滤掉 text 点， text 类型 点没有真实地图点位
      jsonData.features = jsonData.features.filter((v) => v.geometry.type !== 'Text');
      // 自适应缩放
      if (jsonData.features.length > 0) {
        toolData.map.fitBounds(toolData.layerGroup.getBounds());
      }
    };
  };

  const downloadGeoJson = () => {
    onOperateClick(ToolTypeEnum.downfile);
    const data = toolData.layerGroup.toGeoJSON();
    // 添加text 类型
    toolStore.textList.forEach((v) => {
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

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' }); // 表头很重要！！！！

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '标绘图层.json'; // 设置下载文件名
    a.click();
    URL.revokeObjectURL(url);
  };

  return { toolData, onOperateClick, onEditOverlay, onMoveLayer, onChangeFile, downloadGeoJson };
}
