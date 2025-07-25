import { defineComponent, computed } from 'vue';

// 紧急程度类型
export type Priority = 0 | 1 | 2 | 3;

// 标签文本枚举
export const PriorityLabel: Record<Priority, string> = {
  0: '平急',
  1: '加急',
  2: '特急',
  3: '特提',
};

// 颜色枚举
export enum PriorityColor {
  P = '#bdb535',
  J = '#2f7df6',
  TJ = '#fa5e43',
  TP = '#35f28c',
}

// 紧急程度与样式、颜色映射
const priorityMap: Record<Priority, { label: string; class: string; color: PriorityColor }> = {
  0: { label: PriorityLabel[0], class: 'p', color: PriorityColor.P },
  1: { label: PriorityLabel[1], class: 'j', color: PriorityColor.J },
  2: { label: PriorityLabel[2], class: 'tj', color: PriorityColor.TJ },
  3: { label: PriorityLabel[3], class: 'tp', color: PriorityColor.TP },
};

export default defineComponent({
  name: 'PriorityTag',
  props: {
    priority: {
      type: Number as () => Priority,
      required: true,
      validator: (v: number) => [0, 1, 2, 3].includes(v),
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const tagInfo = computed(() => priorityMap[props.priority as Priority]);
    return () => (
      <div
        class={['priority-tag', tagInfo.value.class, props.className]}
        style={{
          width: '55px',
          height: '24px',
          padding: '10px',
          borderRadius: '45px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '24px',
          textAlign: 'center',
          backgroundColor: tagInfo.value.color,
        }}
      >
        {tagInfo.value.label}
      </div>
    );
  },
});
