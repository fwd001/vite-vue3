<template>
  <div class="relative flex flex-col bg-#fff">
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: A.drawType === 'drag' }]"
        title="拖拽"
        @click="onOperateClick('drag')"
      >
        <Icon icon="iconoir:drag-hand-gesture" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'marker' }]"
        title="标点"
        @click="onOperateClick('marker')"
      >
        <Icon icon="uil:map-marker" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'polyline' }]"
        title="连线"
        @click="onOperateClick('polyline')"
      >
        <Icon icon="ic:baseline-polyline" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'polygon' }]"
        title="矩形"
        @click="onOperateClick('polygon')"
      >
        <Icon icon="ph:polygon-duotone" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'circle' }]"
        title="圆"
        @click="onOperateClick('circle')"
      >
        <Icon icon="ic:twotone-circle" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'rectangle' }]"
        @click="onOperateClick('rectangle')"
      >
        <Icon icon="ph:rectangle-duotone" :size="25" />
      </span>
    </div>
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: A.drawType === 'ruler' }]"
        title="距离测量"
        @click="onOperateClick('ruler')"
      >
        <Icon icon="ph:ruler" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'measure' }]"
        title="区域面积"
        @click="onOperateClick('measure')"
      >
        <Icon icon="carbon:area" :size="25" />
      </span>
    </div>
  </div>
  <div class="relative flex flex-col bg-#fff">
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: A.drawType === 'straightArrow' }]"
        title="细直箭头"
        @click="onOperateClick('straightArrow')"
        ><Icon icon="icons8:left-arrow" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'fineArrow' }]"
        title="尖直箭头"
        @click="onOperateClick('fineArrow')"
        ><Icon icon="foundation:arrow-left" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'assaultDirection' }]"
        title="粗直箭头"
        @click="onOperateClick('assaultDirection')"
        ><Icon icon="el:arrow-left" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'squadCombat' }]"
        title="粗曲线箭头"
        @click="onOperateClick('squadCombat')"
        ><Icon icon="fluent:arrow-bounce-16-filled" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'tailedSquadCombat' }]"
        title="燕尾曲线箭头"
        @click="onOperateClick('tailedSquadCombat')"
        ><Icon icon="vaadin:enter-arrow" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'doubleArrow' }]"
        title="双箭头"
        @click="onOperateClick('doubleArrow')"
        ><Icon icon="fluent:arrow-split-16-filled" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: A.drawType === 'attackArrow' }]"
        title="进攻方向"
        @click="onOperateClick('attackArrow')"
        ><Icon icon="game-icons:spine-arrow" :size="25" />
      </span>
    </div>

    <div class="b-b-1 b-#a3a3a3" download="geojson.geojson">
      <span
        :class="['icon-wrap', { active: A.drawType === 'downfile' }]"
        title="导出标绘"
        @click="downloadGeoJson()"
      >
        <Icon icon="ph:export-duotone" :size="25" />
      </span>
      <span
        type="file"
        :class="['icon-wrap', { active: A.drawType === 'openfile' }]"
        title="导入(支持shp、Geojson文件)"
        @click="openFile()"
      >
        <Icon icon="clarity:import-line" :size="25" />
      </span>
      <input
        :accept="'.zip, .json, .geojson'"
        type="file"
        name="file"
        ref="fileDom"
        @change="changeFile"
        v-show="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, reactive, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import mitter from '@/views/utils/mitt';
  import { MEventEnum } from '@/enums/mittEnum';
  import { buildUUID } from '@/utils/uuid';
  import * as turf from '@turf/turf';

  const emit = defineEmits([
    'addDrawToPanel',
    'removeDrawFromPanel',
    'onEditLayerInfo',
    'selectOnpanel',
  ]);

  const fileDom = ref<HTMLInputElement>();
  const openFile = () => {
    onOperateClick('openfile');
    fileDom.value?.click();
  };
  const changeFile = (evt: any) => {
    const files = (evt.target as HTMLInputElement).files;
    const file: any = files && files[0];
    const extension = file.name.split('.');
    const name = extension[0];
    let overlay: any = null;
    let reader = new FileReader();
    if (file.type === 'application/x-zip-compressed') {
      reader.readAsArrayBuffer(file);
      reader.onload = function (evt: any) {
        let res = evt.target.result; //ArrayBuffer
        BM.shp(res).then((res: any) => {
          var blob = new Blob([JSON.stringify(res)]);
          var href = URL.createObjectURL(blob);
          overlay = new BM.GeoJSON(res, {
            fileConfig: {
              Name: name,
              blob: blob,
              href: href,
            },
            attribution: { type: 'inputfile', name: file.name },
            style: function (feature: any) {
              return {
                color:
                  feature.properties && feature.properties.lineColor
                    ? feature.properties.lineColor
                    : '#3388ff',
                fillColor:
                  feature.properties && feature.properties.fillColor
                    ? feature.properties.fillColor
                    : '#3388ff',
              };
            },
          }).addTo(A.map);
          overlay.overlay_id = buildUUID();
          A.map.fitBounds(overlay.getBounds());
          emit('addDrawToPanel', overlay);
        });
      };
    } else {
      reader.readAsText(file!);
      reader.onload = (ev: any) => {
        const data = ev.target?.result; //获取内容
        const jsonData = JSON.parse(data as string);
        overlay = new BM.GeoJSON(jsonData, {
          attribution: { type: 'inputfile', name: file.name },
          style: function (feature: any) {
            return {
              color:
                feature.properties && feature.properties.lineColor
                  ? feature.properties.lineColor
                  : '#3388ff',
              fillColor:
                feature.properties && feature.properties.fillColor
                  ? feature.properties.fillColor
                  : '#3388ff',
            };
          },
        }).addTo(A.map);
        overlay.overlay_id = buildUUID();
        A.map.fitBounds(overlay.getBounds());
        emit('addDrawToPanel', overlay);
      };
    }
  };

  const downloadGeoJson = () => {
    onOperateClick('downfile');
    const data = A.layerGroup.toGeoJSON();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' }); //表头很重要！！！！

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '标绘图层.json'; // 设置下载文件名
    a.click();
    URL.revokeObjectURL(url);
  };
  const A = reactive<Recordable>({
    map: undefined,
    layerGroup: undefined,
    drawType: 'drag',
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
  function activate(e) {
    A.militaryEdit.isEdit() && A.militaryEdit.disable(), A.militaryDraw.enable(e);
  }
  function onOperateClick(action: string) {
    // 清除正在标绘、正在编辑、正在拖动、测量等效果
    for (let i in A.draw) {
      A.draw[i].disable();
    }
    A.drawType = action;
    A.militaryDraw.disable && A.militaryDraw.disable();
    A.militaryEdit.disable && A.militaryEdit.disable();
    if (A.selected && A.selected.is_editing) {
      A.selected.editing.disable();
      A.selected.is_editing = false;
    }
    A.selected && A.selected.dragging && A.selected.dragging.disable();
    // 开始标绘、测量
    switch (action) {
      case 'marker':
      case 'polyline':
      case 'polygon':
      case 'circle':
      case 'rectangle':
      case 'measure':
      case 'ruler':
        A.draw[action].enable();
        break;
      case 'straightArrow':
      case 'fineArrow':
      case 'assaultDirection':
      case 'squadCombat':
      case 'tailedSquadCombat':
      case 'doubleArrow':
      case 'attackArrow':
        activate(action);
        break;
    }
  }

  A.drawMarker = function (data) {
    let marker = BM.marker([data.lat, data.lng], {
      attribution: {
        type: data.type,
        name: '标记',
      },
    });
    if (data.icon) {
      let i;
      typeof A.icons[data.icon] !== 'undefined'
        ? (i = A.icons[data.icon]) &&
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
              iconSize: [30, 41],
              iconAnchor: [20, 41],
            }),
          );
    }
    data.title && marker.bindTooltip(data.title, { direction: 'bottom', permanent: true });
    marker.overlay_id = data.overlay_id;
    marker.on('click', () => {
      A.selected = marker;
      emit('selectOnpanel', A.selected.overlay_id);
    });
    marker.on('contextmenu', (e) => {
      onOperateClick('drag');
      mitter.emit(MEventEnum.ShowContextMenu, {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        type: 'marker',
      });
      A.selected = marker;
    });
    return marker;
  };

  A.drawOverlay = function (data) {
    let overlay,
      option = A.parseOption(data);
    option.attribution = data.attribution;
    switch (data.type) {
      case 'polyline':
        overlay = BM.polyline(data.path, option);
        break;
      case 'polygon':
        overlay = BM.polygon(data.path, option);
        break;
      case 'rectangle':
        overlay = BM.rectangle(data.path, option);
        break;
      case 'circle':
        option.radius = data.radius || data.path.radius;
        var cc = BM.circle(data.path.center || data.path, option);
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
      A.selected = overlay;
      emit('selectOnpanel', A.selected.overlay_id);
    });
    overlay.overlay_id = data.overlay_id;
    overlay.on('contextmenu', (e) => {
      onOperateClick('drag');
      A.selected = overlay;
      mitter.emit(MEventEnum.ShowContextMenu, {
        x: e.containerPoint.x,
        y: e.containerPoint.y,
        type: 'overlay',
      });
    });
    return overlay;
  };
  function mitterOn() {
    mitter.on(MEventEnum.MapMounted, (data: { map: any; layerGroup: any }) => {
      A.map = data.map;
      A.layerGroup = data.layerGroup;
      // jun事标绘
      A.militaryDraw = new BM.Plot.Draw(A.map, {
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
          color: 'pink',
          attribution: {
            type: 'doubleArrow',
            name: '双箭头',
          },
        },
      });
      A.militaryEdit = new BM.Plot.Edit(A.map, {
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
      A.draw = {
        marker: new BM.Draw.Marker(A.map, { repeatMode: true }),
        polyline: new BM.Draw.Polyline(A.map, { repeatMode: true }),
        polygon: new BM.Draw.Polygon(A.map, { repeatMode: true }),
        circle: new BM.Draw.Circle(A.map, { repeatMode: true }),
        rectangle: new BM.Draw.Rectangle(A.map, { repeatMode: true }),
        measure: new BM.Draw.Polygon(A.map, { repeatMode: false }),
        ruler: BM.control.measure({}).addTo(A.map),
      };
      eventFn();
    });
  }
  mitterOn();

  function eventFn() {
    A.map
      .on(BM.Draw.Event.CREATED, (e) => {
        let type = e.layerType;
        let layer: any = e.layer;
        let post_data: any = { path: [], type: type };
        let overlay_id = buildUUID();
        let overlay: any;
        switch (type) {
          case 'marker':
            post_data.path = [layer.getLatLng()];
            overlay = A.drawMarker({
              lat: layer.getLatLng().lat,
              lng: layer.getLatLng().lng,
              overlay_id: overlay_id,
              type: type,
            });
            break;
          case 'polygon':
            if (A.drawType === 'measure') {
              var area = BM.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
              area = area.toFixed(2).toString() + '㎡';
              layer.bindTooltip(area, { permanent: true }).on('contextmenu', () => {
                onOperateClick('drag');
                layer.remove();
              });
              layer.addTo(A.layerGroup);
              A.drawType = 'drag';
              return;
            }
            overlay = A.drawOverlay({
              path: layer.getLatLngs(),
              overlay_id: overlay_id,
              type: type,
              attribution: {
                type: type,
                name: '多边形',
              },
            });
            post_data.path = layer.getLatLngs()[0];
            break;
          case 'polyline':
            overlay = A.drawOverlay({
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
          case 'rectangle':
            overlay = A.drawOverlay({
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
          case 'circle':
          case 'circlemarker':
            post_data.path = [layer.getLatLng()];
            post_data.radius = layer.getRadius();
            overlay = A.drawOverlay({
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
        if (post_data.type == 'marker') {
          A.markers[overlay_id] = overlay;
        } else {
          A.overlay[overlay_id] = overlay;
        }
        A.treeSelected[overlay_id] = 1;

        A.currentFolderId ? (post_data.pid = A.currentFolderId) : 0;
        overlay.addTo(A.layerGroup);
        post_data.type = type;
        post_data.overlay_id = overlay_id;
        post_data.path = post_data.path.map(function (v) {
          return [v.lat, v.lng];
        });
        overlay.feature = overlay.toGeoJSON();
        overlay.feature.properties = overlay.options.attribution;
        emit('addDrawToPanel', overlay);
      })
      .on('stop_measure', function () {
        A.drawType = 'drag';
      })
      .on(BM.Draw.Event.DRAWSTOP, function () {})
      .on('click', function () {
        if (A.selected && A.selected.is_editing) {
          A.selected.editing.disable();
          A.selected.is_editing = false;
        }
      })
      .on('contextmenu', function () {
        onOperateClick('drag');
      });
    A.militaryDraw.on('bm_draw_end', function (e) {
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
      let type = e.detail.type;
      let overlay_id = buildUUID();
      let overlay = e.detail.layer;
      overlay.overlay_id = overlay_id;
      overlay.options.attribution = {};
      overlay.getAttribution().type = type;
      overlay.getAttribution().name = typeList[type];
      overlay
        // .bindTooltip('右键编辑!', { permanent: true, direction: 'bottom' })
        .addTo(A.layerGroup);
      A.militaryDraw.addAbsorbLayer(overlay);
      A.militaryEdit.addAbsorbLayer(overlay);
      overlay.feature = overlay.toGeoJSON();
      overlay.feature.properties = overlay.options.attribution;
      emit('addDrawToPanel', overlay);
      overlay.on('click', (le: any) => {
        A.selected = le.target;
        emit('selectOnpanel', A.selected.overlay_id);
      });
      overlay.on('contextmenu', (re: any) => {
        onOperateClick('drag');
        mitter.emit(MEventEnum.ShowContextMenu, {
          x: re.containerPoint.x,
          y: re.containerPoint.y,
          type: 'military',
        });
        A.selected = re.target;
      });
    });
  }

  function mitterOff() {
    mitter.off(MEventEnum.MapMounted);
  }
  onBeforeUnmount(() => {
    mitterOff();
  });
  function onEditLayerInfo(e) {
    onOperateClick('drag');
    e.stopPropagation ? e.stopPropagation() : null;
    mitter.emit(MEventEnum.HideContextMenu);
    emit('onEditLayerInfo', A.selected.overlay_id, A.selected.options.attribution);
  }

  function onMoveLayer(e) {
    onOperateClick('drag');
    e.stopPropagation ? e.stopPropagation() : null;
    mitter.emit(MEventEnum.HideContextMenu);
    if (!A.selected) return;
    A.selected.dragging.enable();
    A.selected.once('dragend', function (e) {
      e.stopPropagation ? e.stopPropagation() : null;
      A.selected && A.selected.dragging && A.selected.dragging.disable();
      A.selected = undefined;
    });
  }
  function onDeleteLayer(e) {
    e.stopPropagation();
    if (!A.selected) return;
    A.selected.remove();
    A.layerGroup.removeLayer(A.selected);
    emit('removeDrawFromPanel', A.selected);
    delete A.markers[A.selected.overlay_id];
    mitter.emit(MEventEnum.HideContextMenu);
    A.selected = undefined;
  }
  function onEditOverlay(e) {
    onOperateClick('drag');
    e.stopPropagation();
    if (!A.selected && !A.selected?.is_editing) return;
    A.selected.editing.enable();
    A.selected.is_editing = true;
    A.militaryDraw.disable && A.militaryDraw.disable();
    !A.militaryEdit.isEdit() && A.militaryEdit.edit(A.selected);
    mitter.emit(MEventEnum.HideContextMenu);
  }

  defineExpose({ onEditLayerInfo, onEditOverlay, onDeleteLayer, onMoveLayer, onOperateClick });
</script>

<style lang="less" scoped>
  .icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    cursor: pointer;
  }

  .menu-box {
    display: flex;
    position: absolute;
    z-index: 999;
    top: 39px;
    left: 30px;
    flex-direction: column;
    width: 80px;
    padding: 2px 0;
    border-radius: 3px;
    background-color: rgb(0 0 0 / 70%);
    color: #fff;

    .menu-item {
      padding-left: 5px;
      line-height: 1.7;
      cursor: pointer;

      &:hover {
        background-color: #0960bd;
      }
    }
  }

  .active {
    background-color: #0960bd;
    color: #fff;
  }
</style>
