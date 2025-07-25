import { defineStore } from 'pinia';
import { store } from '@/store';
import { ToolTypeEnum } from '@/views/dashboard/map-tool/enum';
import { ref, computed } from 'vue';

type LatLng = [number, number] | [];

export const usePsMapStore = defineStore('ps-map', () => {
  // state
  const zoom = ref<number>(0);
  const latlng = ref<LatLng>([]);
  const administrativeDivisions = ref<{ name: string; code: number }[]>([]);
  const toolDrawType = ref<string>(ToolTypeEnum.drag);

  // getters
  const getZoom = computed(() => zoom.value);

  // actions
  function setZoom(val: number) {
    zoom.value = val;
  }
  function setLatlng(val: LatLng) {
    latlng.value = val;
  }
  function setToolDrawType(tool?: ToolTypeEnum) {
    toolDrawType.value = tool || ToolTypeEnum.drag;
  }
  function addMapLevels(data: { name: string; code: number }) {
    const list = [...administrativeDivisions.value];
    list.push(data);
    administrativeDivisions.value = list;
  }
  function popMapLevels() {
    const list = [...administrativeDivisions.value];
    list.pop();
    administrativeDivisions.value = list;
  }
  function resetMapLevels() {
    administrativeDivisions.value = [];
  }
  function resetState() {
    zoom.value = 3;
    latlng.value = [];
  }

  return {
    // state
    zoom,
    latlng,
    administrativeDivisions,
    toolDrawType,
    // getters
    getZoom,
    // actions
    setZoom,
    setLatlng,
    setToolDrawType,
    addMapLevels,
    popMapLevels,
    resetMapLevels,
    resetState,
  };
});

// Need to be used outside the setup
export function usePsMapStoreWithOut() {
  return usePsMapStore(store);
}
