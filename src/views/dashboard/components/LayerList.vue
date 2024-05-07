<template>
  <div class="panel">
    <BasicTree
      ref="LayerTree"
      :checkable="true"
      :search="true"
      :clickRowToExpand="true"
      :defaultExpandAll="true"
      :treeData="treeData"
      v-model:checkedKeys="checkedKeys"
      @check="check"
      @select="select"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, unref } from 'vue';
  import { BasicTree, TreeItem } from '@/components/Tree/index';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['gotoFeature']);
  // 初始化标绘图层树
  const treeData = ref<TreeItem[]>([
    {
      title: '基础标绘图层',
      key: '0-0',
      icon: 'iconamoon:badge-duotone',
      children: [
        {
          title: '标记',
          key: 'marker',
          icon: 'uil:map-marker',
          children: [],
        },
        {
          title: '多段线',
          key: 'polyline',
          icon: 'ic:baseline-polyline',
          children: [],
        },
        {
          title: '多边形',
          key: 'polygon',
          icon: 'ph:polygon-duotone',
          children: [],
        },
        {
          title: '圆形',
          key: 'circle',
          icon: 'ic:twotone-circle',
          children: [],
        },
        {
          title: '矩形',
          key: 'rectangle',
          icon: 'ph:rectangle-duotone',
          children: [],
        },
      ],
    },
    {
      title: '态势标绘图层',
      key: '0-1',
      icon: 'iconamoon:badge-duotone',
      children: [
        {
          title: '细直箭头',
          key: 'straightArrow',
          icon: 'icons8:left-arrow',
          children: [],
        },
        {
          title: '尖直箭头',
          key: 'fineArrow',
          icon: 'foundation:arrow-left',
          children: [],
        },
        {
          title: '粗直头箭',
          key: 'assaultDirection  ',
          icon: 'el:arrow-left',
          children: [],
        },
        {
          title: '粗曲线箭头',
          key: 'squadCombat',
          icon: 'fluent:arrow-bounce-16-filled',
          children: [],
        },
        {
          title: '燕尾曲线箭头',
          key: 'tailedSquadCombat',
          icon: 'vaadin:enter-arrow',
          children: [],
        },
        {
          title: '双箭头',
          key: 'doubleArrow',
          icon: 'fluent:arrow-split-16-filled',
          children: [],
        },
        {
          title: '进攻方向',
          key: 'attackArrow',
          icon: 'game-icons:spine-arrow',
          children: [],
        },
      ],
    },
    {
      title: '导入图层',
      key: '0-2',
      icon: 'clarity:import-line',
      children: [],
    },
  ]);
  // 图层树初始化勾选状态
  const checkedKeys = ref<string[]>([]);
  const LayerTree = ref<InstanceType<typeof BasicTree>>(); // 基础树组件

  // 地图标绘完毕后，加入标绘图层树
  function addDataToTree(data: any) {
    const _treeData = cloneDeep(unref(treeData));
    const keys: string[] = [];
    _treeData.map((pitem: any) => {
      pitem.children.map((item: any) => {
        if (item.key === data.parentKey) {
          data.icon = item.icon;

          item.children.push(data); // 更新图层树
          keys.push(data.key);
          // LayerTree.value?.setCheckedKeys(checkedKeys.value); // 控制组件勾选该节点
        }
        return item;
      });
      if (pitem.title === '导入图层' && data.parentKey === 'inputfile') {
        data.icon = pitem.icon;
        pitem.children.push(data); // 更新图层树
        keys.push(data.key);
        // LayerTree.value?.setCheckedKeys(checkedKeys.value); // 控制组件勾选该节点
      }
    });
    treeData.value = _treeData;
    checkedKeys.value = keys.concat(unref(checkedKeys));
  }
  // 地图选中图形，树结构节点处于选择状态
  function selectDataOnTree(data: any) {
    LayerTree.value?.setSelectedKeys([data]); // 控制组件勾选该节点
  }
  // 选择节点时触发定位到图层
  function select(key: any, value: any) {
    if (value.node.graphic) {
      emit('gotoFeature', value.node.graphic);
    }
  }
  // 勾选事件：通过勾选状态，控制标绘要素是否显示。
  function check(key: any, value: any) {
    // console.log('前', key);
    // 一层数据处理
    if (value.node.graphic) {
      value.node.parentKey === 'marker'
        ? value.node.graphic.setOpacity(value.checked ? 1 : 0)
        : value.node.graphic.setStyle({
            opacity: value.checked ? 1 : 0,
            fillOpacity: value.checked ? 0.2 : 0,
          });
    }
    // console.log(value.node.graphic);
    // 二层数据处理
    if (value.node.children) {
      value.node.children.forEach((chirld: any) => {
        if (chirld.children) {
          chirld.children.forEach((c: any) => {
            c.parentKey === 'marker'
              ? c.graphic.setOpacity(value.checked ? 1 : 0)
              : c.graphic.setStyle({
                  opacity: value.checked ? 1 : 0,
                  fillOpacity: value.checked ? 0.2 : 0,
                });
          });
        } else {
          chirld.parentKey === 'marker'
            ? chirld.graphic.setOpacity(value.checked ? 1 : 0)
            : chirld.graphic.setStyle({
                opacity: value.checked ? 1 : 0,
                fillOpacity: value.checked ? 0.2 : 0,
              });
        }
        // console.log(chirld.graphic);
      });
    }
  }
  // 删除节点
  function deleteDataFromTree(nodeKey: any) {
    console.log('nodeKey', nodeKey);

    LayerTree.value?.deleteNodeByKey(nodeKey);
  }
  // 更新面板要素属性
  function upDatePanel(value: any) {
    const _treeData = cloneDeep(unref(treeData));
    _treeData.map((pitem: any) => {
      pitem.children.map((item: any) => {
        item.children.map((leaf: any) => {
          if (leaf.graphic && leaf.graphic.overlay_id === value.id) {
            leaf.title = value.name;
            if (value.lineColor && value.fillColor) {
              leaf.graphic.setStyle({
                color: value.lineColor,
                fillColor: value.fillColor,
              });
            }
            // console.log('地图要素保存属性', value);
            leaf.graphic.options.attribution = value;
            leaf.graphic.feature.properties = value;
          }
        });
      });
    });
    treeData.value = _treeData;
  }
  defineExpose({ addDataToTree, deleteDataFromTree, upDatePanel, selectDataOnTree });
</script>
<style lang="less" scoped>
  .panel {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
  }
</style>
