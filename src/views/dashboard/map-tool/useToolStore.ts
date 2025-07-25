import { cloneDeep } from 'lodash-es';
import { toRaw, reactive } from 'vue';
import type { Reactive } from 'vue';

// 文本标注项类型
export interface TextItem {
  id: string;
  latlng: [number, number];
  content: string;
  backgroundColor: string;
  color: string;
  width?: number;
  zIndex?: number;
}

// 工具数据仓库
class ToolStore {
  // 仓库状态
  private state: Reactive<{
    textList: TextItem[];
  }>;

  constructor() {
    this.state = reactive({
      textList: [],
    });
  }

  // 设置全部文本标注
  setTextList(list: TextItem[]): void {
    this.state.textList = list;
  }

  // 更新或新增单个文本标注
  setTextItem(item: TextItem): void {
    const list = cloneDeep(this.state.textList);
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    this.state.textList = list;
  }

  // 删除指定文本标注
  removeTextItem(id: string): void {
    this.state.textList = cloneDeep(this.state.textList).filter((i) => i.id !== id);
  }

  // 获取文本标注列表（只读）
  get textList(): TextItem[] {
    return toRaw(this.state.textList) || [];
  }
}

let toolStoreInstance: ToolStore | null = null;

// 工具仓库单例
export function useToolStore(): ToolStore {
  if (!toolStoreInstance) {
    toolStoreInstance = new ToolStore();
  }
  return toolStoreInstance;
}
