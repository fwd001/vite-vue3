<template>
  <div>
    <div ref="trigger">
      <span class="cursor-pointer px-2 py-1 flex items-center" v-if="isSvgMode && currentSelect">
        <SvgIcon :name="currentSelect" />
      </span>
      <Icon :icon="currentSelect || 'ion:apps-outline'" class="cursor-pointer px-2 py-1" v-else />
      {{ currentSelect }}
    </div>
    <div class="flex justify-between w-200px">
      <Input placeholder="搜索" @change="debounceHandleSearchChange" allowClear />
    </div>
    <div v-if="getPaginationList.length">
      <ScrollContainer class="border border-solid border-t-0">
        <ul class="flex flex-wrap px-2">
          <li
            v-for="icon in getPaginationList"
            :key="icon"
            :class="currentSelect === icon ? 'border border-primary' : ''"
            class="p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary"
            @click="handleClick(icon)"
            :title="icon"
          >
            <SvgIcon v-if="isSvgMode" :name="icon" />
            <Icon :icon="icon" v-else />
          </li>
        </ul>
      </ScrollContainer>
      <div class="flex py-2 items-center justify-center" v-if="getTotal >= pageSize">
        <Pagination
          showLessItems
          size="small"
          :pageSize="pageSize"
          :total="getTotal"
          @change="handlePageChange"
        />
      </div>
    </div>
    <template v-else>
      <div class="p-5"><Empty /> </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watchEffect, watch } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import { Input, Pagination, Empty } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { SvgIcon } from '@/components/Icon';

  import iconsData from '@/components/Icon/data/icons.data';
  import { usePagination } from '@/hooks/web/usePagination';
  import { useDebounceFn } from '@vueuse/core';
  import svgIcons from 'virtual:svg-icons-names';
  import { copyText } from '@/utils/copyTextToClipboard';

  // 不要继承FormItem禁用、占位符...
  defineOptions({ name: 'IconIndex', inheritAttrs: false });

  function getIcons() {
    const prefix = iconsData.prefix;
    return iconsData.icons.map((icon) => `${prefix}:${icon}`);
  }

  function getSvgIcons() {
    return svgIcons.map((icon: string) => icon.replace('icon-', ''));
  }

  export interface Props {
    value?: string;
    width?: string;
    pageSize?: number;
    copy?: boolean;
    mode?: 'svg' | 'iconify';
    allowClear?: boolean;
    readonly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    width: '100%',
    pageSize: 84,
    copy: true,
    mode: 'iconify',
    allowClear: true,
    readonly: false,
  });

  const emit = defineEmits(['change', 'update:value']);

  const isSvgMode = props.mode === 'svg';
  const icons = isSvgMode ? getSvgIcons() : getIcons();

  const currentSelect = ref('');
  const currentList = ref(icons);
  const trigger = ref<HTMLDivElement>();

  // const { t } = useI18n();

  const debounceHandleSearchChange = useDebounceFn(handleSearchChange, 100);

  const { getPaginationList, getTotal, setCurrentPage } = usePagination(
    currentList,
    props.pageSize,
  );

  watchEffect(() => {
    currentSelect.value = props.value;
  });

  watch(
    () => currentSelect.value,
    (v) => {
      emit('update:value', v);
      emit('change', v);
    },
  );
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleClick(icon: string) {
    currentSelect.value = icon;
    if (props.copy) {
      copyText(icon, '复制成功');
    }
  }

  function handleSearchChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setCurrentPage(1);
      currentList.value = icons;
      return;
    }
    currentList.value = icons.filter((item) => item.includes(value));
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-icon-picker';

  .@{prefix-cls} {
    .ant-input-group-addon {
      padding: 0 !important;
    }

    .ant-input {
      cursor: pointer !important;
    }

    &-popover {
      width: 300px !important;

      .ant-popover-inner-content {
        padding: 0 !important;
      }

      .scrollbar {
        height: 220px !important;
      }
    }
  }
</style>
