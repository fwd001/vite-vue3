<template>
  <div class="relative flex flex-col bg-#fff">
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.drag }]"
        title="拖拽"
        @click="emits('onOperateClick', ToolTypeEnum.drag)"
      >
        <Icon icon="iconoir:drag-hand-gesture" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.marker }]"
        title="标点"
        @click="emits('onOperateClick', ToolTypeEnum.marker)"
      >
        <Icon icon="uil:map-marker" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.text }]"
        title="文本"
        @click="emits('onOperateClick', ToolTypeEnum.text)"
      >
        <Icon icon="mingcute:text-2-fill" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.polyline }]"
        title="连线"
        @click="emits('onOperateClick', ToolTypeEnum.polyline)"
      >
        <Icon icon="ic:baseline-polyline" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.polygon }]"
        title="矩形"
        @click="emits('onOperateClick', ToolTypeEnum.polygon)"
      >
        <Icon icon="ph:polygon-duotone" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.circle }]"
        title="圆"
        @click="emits('onOperateClick', ToolTypeEnum.circle)"
      >
        <Icon icon="ic:twotone-circle" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.rectangle }]"
        @click="emits('onOperateClick', ToolTypeEnum.rectangle)"
      >
        <Icon icon="ph:rectangle-duotone" :size="25" />
      </span>
    </div>
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.ruler }]"
        title="距离测量"
        @click="emits('onOperateClick', ToolTypeEnum.ruler)"
      >
        <Icon icon="ph:ruler" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.measure }]"
        title="区域面积"
        @click="emits('onOperateClick', ToolTypeEnum.measure)"
      >
        <Icon icon="carbon:area" :size="25" />
      </span>
    </div>
  </div>
  <div class="relative flex flex-col bg-#fff">
    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.straightArrow }]"
        title="细直箭头"
        @click="emits('onOperateClick', ToolTypeEnum.straightArrow)"
        ><Icon icon="icons8:left-arrow" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.fineArrow }]"
        title="尖直箭头"
        @click="emits('onOperateClick', ToolTypeEnum.fineArrow)"
        ><Icon icon="foundation:arrow-left" :size="25" />
      </span>
      <span
        :class="[
          'icon-wrap',
          { active: props.toolData.drawType === ToolTypeEnum.assaultDirection },
        ]"
        title="粗直箭头"
        @click="emits('onOperateClick', ToolTypeEnum.assaultDirection)"
        ><Icon icon="el:arrow-left" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.squadCombat }]"
        title="粗曲线箭头"
        @click="emits('onOperateClick', ToolTypeEnum.squadCombat)"
        ><Icon icon="fluent:arrow-bounce-16-filled" :size="25" />
      </span>
      <span
        :class="[
          'icon-wrap',
          { active: props.toolData.drawType === ToolTypeEnum.tailedSquadCombat },
        ]"
        title="燕尾曲线箭头"
        @click="emits('onOperateClick', ToolTypeEnum.tailedSquadCombat)"
        ><Icon icon="vaadin:enter-arrow" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.doubleArrow }]"
        title="双箭头"
        @click="emits('onOperateClick', ToolTypeEnum.doubleArrow)"
        ><Icon icon="fluent:arrow-split-16-filled" :size="25" />
      </span>
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.attackArrow }]"
        title="进攻方向"
        @click="emits('onOperateClick', ToolTypeEnum.attackArrow)"
        ><Icon icon="game-icons:spine-arrow" :size="25" />
      </span>
    </div>

    <div class="b-b-1 b-#a3a3a3">
      <span
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.downfile }]"
        title="导出标绘"
        @click="emits('downloadGeoJson')"
      >
        <Icon icon="mdi:export" :size="25" />
      </span>
      <span
        type="file"
        :class="['icon-wrap', { active: props.toolData.drawType === ToolTypeEnum.openfile }]"
        title="导入(支持shp、Geojson文件)"
        @click="openFile()"
      >
        <Icon icon="mdi:import" :size="25" />
      </span>
      <input
        :accept="'.zip, .json, .geojson'"
        type="file"
        name="file"
        ref="fileDom"
        @change="(evt) => emits('onChangeFile', evt)"
        v-show="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ToolTypeEnum } from './enum';

  const emits = defineEmits(['onOperateClick', 'onChangeFile', 'downloadGeoJson']);

  const props = withDefaults(
    defineProps<{
      map: any;
      layerGroup: any;
      toolData: any;
    }>(),
    {},
  );

  const fileDom = ref<HTMLInputElement>();
  const openFile = () => {
    emits('onOperateClick', ToolTypeEnum.openfile);
    fileDom.value?.click();
  };
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
