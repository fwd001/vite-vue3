import { cloneDeep } from 'lodash-es';
import { toRaw, reactive } from 'vue';
import type { Reactive } from 'vue';

interface TextItem {
  id: string;
  latlng: [number, number];
  content: string;
  backgroundColor: string;
  color: string;
  width?: number;
  zIndex?: number;
}
class ToolStore {
  // 工具数据
  private state: Reactive<{
    textList: TextItem[];
  }>;

  constructor() {
    this.state = reactive({
      textList: [
        // {
        //   id: '1',
        //   latlng: [44.502783276033135, 87.04467773437501],
        //   content: '双击编辑！',
        //   backgroundColor: '#fff',
        //   color: '#333',
        //   width: 0,
        // },
        // {
        //   id: '2',
        //   latlng: [43.409390776122315, 90.93163982033731],
        //   content: '测试测试\n测试测试',
        //   backgroundColor: '#fff',
        //   color: '#333',
        //   width: 0,
        // },
        // {
        //   id: '3',
        //   latlng: [43.81708957639588, 88.78051690757276],
        //   content: '测试测试测试测试测试测试测试测试测试测试',
        //   backgroundColor: '#fff',
        //   color: '#333',
        //   width: 0,
        // },
      ],
    });
  }

  setTextList(list: TextItem[]) {
    this.state.textList = list;
  }

  setTextItem(item: TextItem) {
    const newList = cloneDeep(this.state.textList);
    const index = newList.findIndex((_item) => _item.id === item.id);
    newList[index] = item;

    this.state.textList = newList;
  }

  deleteTextItem(id: string) {
    this.state.textList = cloneDeep(this.state.textList).filter((_item) => _item.id !== id);
  }

  public get textList() {
    const info = toRaw(this.state.textList);
    if (info) {
      return info;
    } else {
      return [];
    }
  }
}

let instance: ToolStore | null = null;

export function useToolStore(): ToolStore {
  if (!instance) {
    instance = new ToolStore();
  }
  return instance;
}
