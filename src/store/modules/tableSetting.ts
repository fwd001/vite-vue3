import { defineStore } from 'pinia';

import { TABLE_SETTING_KEY } from '@/enums/cacheEnum';

import { Persistent } from '@/utils/cache/persistent';

import type { TableSetting } from '#/store';
import type { SizeType, ColumnOptionsType } from '@/components/Table/src/types/table';
import { ref, computed } from 'vue';

export const useTableSettingStore = defineStore('table-setting', () => {
  // state
  const setting = ref<Nullable<Partial<TableSetting>>>(Persistent.getLocal(TABLE_SETTING_KEY));

  // getters
  const getTableSetting = computed(() => setting.value);
  const getTableSize = computed(() => setting.value?.size || 'middle');
  const getShowIndexColumn = computed(() => (routerName: string) => {
    return setting.value?.showIndexColumn?.[routerName];
  });
  const getShowRowSelection = computed(() => (routerName: string) => {
    return setting.value?.showRowSelection?.[routerName];
  });
  const getColumns = computed(() => (routerName: string) => {
    return setting.value?.columns && setting.value?.columns[routerName]
      ? setting.value?.columns[routerName]
      : null;
  });

  // actions
  function setTableSetting(newSetting: Partial<TableSetting>) {
    setting.value = Object.assign({}, setting.value, newSetting);
    Persistent.setLocal(TABLE_SETTING_KEY, setting.value, true);
  }
  function resetTableSetting() {
    Persistent.removeLocal(TABLE_SETTING_KEY, true);
    setting.value = null;
  }
  function setTableSize(size: SizeType) {
    setTableSetting(Object.assign({}, setting.value, { size }));
  }
  function setShowIndexColumn(routerName: string, show: boolean) {
    setTableSetting(
      Object.assign({}, setting.value, {
        showIndexColumn: {
          ...setting.value?.showIndexColumn,
          [routerName]: show,
        },
      }),
    );
  }
  function setShowRowSelection(routerName: string, show: boolean) {
    setTableSetting(
      Object.assign({}, setting.value, {
        showRowSelection: {
          ...setting.value?.showRowSelection,
          [routerName]: show,
        },
      }),
    );
  }
  function setColumns(routerName: string, columns: Array<ColumnOptionsType>) {
    setTableSetting(
      Object.assign({}, setting.value, {
        columns: {
          ...setting.value?.columns,
          [routerName]: columns,
        },
      }),
    );
  }
  function clearColumns(routerName: string) {
    setTableSetting(
      Object.assign({}, setting.value, {
        columns: {
          ...setting.value?.columns,
          [routerName]: undefined,
        },
      }),
    );
  }

  return {
    // state
    setting,
    // getters
    getTableSetting,
    getTableSize,
    getShowIndexColumn,
    getShowRowSelection,
    getColumns,
    // actions
    setTableSetting,
    resetTableSetting,
    setTableSize,
    setShowIndexColumn,
    setShowRowSelection,
    setColumns,
    clearColumns,
  };
});
