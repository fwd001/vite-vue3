import { onMounted, onUnmounted } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { useElementSize, type MaybeComputedElementRef } from '@vueuse/core';

// 地图回调类型
type MapCallback = (ctx: {
  map: any;
  layerGroup: any;
  mapWrap: ReturnType<typeof useElementSize>;
}) => void;

// 地图实例上下文类型
interface MapContext {
  map?: any; // BM.Map
  customLayer?: any; // BM.GridLayer
  layerGroup?: any; // BM.FeatureGroup
  mapWrap?: ReturnType<typeof useElementSize>;
  mapRef?: MaybeComputedElementRef;
  mountedCallbacks?: MapCallback[];
}

// 所有地图实例缓存
const mapInstances: Record<string, MapContext> = {};

const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export function useMap(namespace: string, mapRef?: MaybeComputedElementRef) {
  // 初始化实例缓存
  if (!mapInstances[namespace]) {
    mapInstances[namespace] = {};
  }
  if (!mapInstances[namespace].mountedCallbacks) {
    mapInstances[namespace].mountedCallbacks = [];
  }

  const { mapConfHttpUrl, dridUrl } = useGlobSetting();
  if (BM) BM.Config.HTTP_URL = mapConfHttpUrl;

  // 初始化 mapWrap
  if (!mapInstances[namespace].mapRef) {
    mapInstances[namespace].mapRef = mapRef;
    mapInstances[namespace].mapWrap = useElementSize(mapRef);
  }

  // 地图就绪回调注册
  const onReady = (cb?: MapCallback) => {
    const ctx = mapInstances[namespace];
    if (ctx.map && ctx.layerGroup && ctx.mapWrap) {
      cb && cb({ map: ctx.map, layerGroup: ctx.layerGroup, mapWrap: ctx.mapWrap });
    } else {
      cb && ctx.mountedCallbacks?.push(cb);
    }
  };

  // 地图初始化
  const initMap = () => {
    if (!BM || mapInstances[namespace].map) return;
    const ctx = mapInstances[namespace];
    ctx.map = BM.map(namespace, null, {
      center: [43.858296779161854, 87.21496514976026],
      minZoom: 3,
      zoom: 7,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      trackResize: true,
    });
    // 自定义电子图层
    const GridLayer = BM.GridLayer.extend(createGridLayerOptions({ url: dridUrl }));
    ctx.customLayer = new GridLayer();
    ctx.customLayer.addTo(ctx.map);
    ctx.layerGroup = BM.featureGroup([]);
    ctx.layerGroup.addTo(ctx.map);
    // 执行所有挂载回调
    ctx.mountedCallbacks?.forEach((cb) => {
      if (ctx.map && ctx.layerGroup && ctx.mapWrap) {
        cb({ map: ctx.map, layerGroup: ctx.layerGroup, mapWrap: ctx.mapWrap });
      }
    });
    ctx.mountedCallbacks = [];
  };

  onMounted(initMap);
  onUnmounted(() => {
    mapInstances[namespace] = {};
  });

  return {
    onReady,
    instance: mapInstances[namespace],
    id: namespace,
  };
}

// 自定义网格图层配置
function createGridLayerOptions(data: { url: string }) {
  return {
    createTile(coords: { x: number; y: number; z: number }) {
      const tile = new Image(256, 256);
      tile.src = data.url
        .replace('{x}', coords.x.toString())
        .replace('{y}', coords.y.toString())
        .replace('{z}', coords.z.toString());
      tile.onerror = () => {
        tile.src = publicPath + 'images/empty.png';
      };
      return tile;
    },
  };
}
