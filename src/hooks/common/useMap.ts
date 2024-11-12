import { onMounted } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { useElementSize, type MaybeComputedElementRef } from '@vueuse/core';

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

export function useMap(namespace: string, bigeMapRef?: MaybeComputedElementRef) {
  // 初始化
  if (!instance[namespace]) instance[namespace] = {};
  if (!instance[namespace].mountedEvents?.length) {
    instance[namespace].mountedEvents = [];
  }
  const { mapConfHttpUrl, dridUrl } = useGlobSetting();

  if (BM) BM.Config.HTTP_URL = mapConfHttpUrl;

  if (!instance[namespace].bigeMapRef) {
    const mapWrap = useElementSize(bigeMapRef);
    instance[namespace].bigeMapRef = bigeMapRef;
    instance[namespace].mapWrap = mapWrap;
  }

  const onMapMounted = (callback?: (opts: { map: any; layerGroup: any; mapWrap: any }) => void) => {
    if (instance[namespace].map) {
      callback &&
        callback({
          map: instance[namespace].map,
          layerGroup: instance[namespace].layerGroup,
          mapWrap: instance[namespace].mapWrap,
        });
    } else {
      callback && instance[namespace].mountedEvents?.push(callback);
    }
  };

  const initializeMap = () => {
    if (!BM) return;
    if (instance[namespace].map) return;
    instance[namespace].map = BM.map(namespace, null, {
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

    instance[namespace].ele18lite = new gridLayer();
    instance[namespace].ele18lite.addTo(instance[namespace].map);
    instance[namespace].layerGroup = BM.featureGroup([]);
    instance[namespace].layerGroup.addTo(instance[namespace].map);
    // mitter.emit(MEventEnum.MapMounted, { map, layerGroup, mapWrap });

    instance[namespace].mountedEvents?.forEach((callback) => {
      callback({
        map: instance[namespace].map,
        layerGroup: instance[namespace].layerGroup,
        mapWrap: instance[namespace].mapWrap,
      });
    });
  };

  onMounted(initializeMap);

  return {
    onMapMounted,
    instance: instance[namespace],
    id: namespace,
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
