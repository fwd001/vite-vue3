import { defineStore } from 'pinia';
import { store } from '@/store';
import { ToolTypeEnum } from '@/views/dashboard/map-tool/enum';

type LatLng = [number, number] | [];
interface State {
  zoom: number;
  latlng: LatLng;
  administrativeDivisions: { name: string; code: number }[];
  toolDrawType: string;
}

export const usePsMapStore = defineStore({
  id: 'ps-map',
  state: (): State => ({
    zoom: 0,
    latlng: [],
    administrativeDivisions: [],
    toolDrawType: ToolTypeEnum.drag,
  }),
  getters: {
    getZoom(): number {
      return this.zoom;
    },
  },
  actions: {
    setZoom(zoom: number) {
      this.zoom = zoom;
    },
    setLatlng(latlng: LatLng) {
      this.latlng = latlng;
    },
    setToolDrawType(tool?: ToolTypeEnum) {
      this.toolDrawType = tool || ToolTypeEnum.drag;
    },
    addMapLevels(data: { name: string; code: number }) {
      const list = [...this.administrativeDivisions];
      list.push(data);
      this.administrativeDivisions = list;
    },
    popMapLevels() {
      const list = [...this.administrativeDivisions];
      list.pop();
      this.administrativeDivisions = list;
    },
    resetMapLevels() {
      this.administrativeDivisions = [];
    },

    resetState() {
      this.zoom = 3;
      this.latlng = [];
    },
  },
});

// Need to be used outside the setup
export function usePsMapStoreWithOut() {
  return usePsMapStore(store);
}
