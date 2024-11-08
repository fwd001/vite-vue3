import { onMounted } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { useElementSize } from '@vueuse/core';

// 地图domid配置， 必须设置 ref = bigeMapRef
type CBFunc = (opt: { map: any; layerGroup: any; mapWrap: any }) => void;

const instance: {
  [key: string]: {
    map?: any; // 总地图实例
    ele18lite?: any; // 电子图层
    layerGroup?: any; // 其他东西图层
    mapWrap?: any; // 地图elementSize
    bigeMapRef?: any; // 地图! ref = bigeMapRef
    // 挂载事件列表
    mountedEvents?: CBFunc[];
  };
} = {};

const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export function useMap(mapDomId: string, bigeMapRef?: any) {
  // 初始化
  if (!instance[mapDomId]) instance[mapDomId] = {};
  if (!instance[mapDomId].mountedEvents?.length) {
    instance[mapDomId].mountedEvents = [];
  }

  const { mapConfHttpUrl, dridUrl } = useGlobSetting();

  if (!instance[mapDomId].bigeMapRef) {
    const mapWrap = useElementSize(bigeMapRef);
    instance[mapDomId].bigeMapRef = bigeMapRef;
    instance[mapDomId].mapWrap = mapWrap;
  }

  if (BM) BM.Config.HTTP_URL = mapConfHttpUrl;

  const onMapMounted = (callback?: (opts: { map: any; layerGroup: any; mapWrap: any }) => void) => {
    if (instance[mapDomId].map) {
      callback &&
        callback({
          map: instance[mapDomId].map,
          layerGroup: instance[mapDomId].layerGroup,
          mapWrap: instance[mapDomId].mapWrap,
        });
    } else {
      callback && instance[mapDomId].mountedEvents?.push(callback);
    }
  };

  const initializeMap = () => {
    if (instance[mapDomId].map) return;
    if (!BM) return;
    instance[mapDomId].map = BM.map(mapDomId, null, {
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

    instance[mapDomId].ele18lite = new gridLayer();
    instance[mapDomId].ele18lite.addTo(instance[mapDomId].map);
    instance[mapDomId].layerGroup = BM.featureGroup([]);
    instance[mapDomId].layerGroup.addTo(instance[mapDomId].map);
    // mitter.emit(MEventEnum.MapMounted, { map, layerGroup, mapWrap });

    instance[mapDomId].mountedEvents?.forEach((callback) => {
      callback({
        map: instance[mapDomId].map,
        layerGroup: instance[mapDomId].layerGroup,
        mapWrap: instance[mapDomId].mapWrap,
      });
    });
  };

  onMounted(initializeMap);

  return {
    onMapMounted,
    instance: instance[mapDomId],
    id: mapDomId,
  };
}

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
