<template>
  <div v-if="getShowDarkModeToggle" :class="getClass" @click="toggleDarkMode">
    <div :class="`${prefixCls}-inner`"></div>
    <Icon size="14" icon="sun|svg" />
    <Icon size="14" icon="moon|svg" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { ThemeEnum } from '@/enums/appEnum';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { updateDarkTheme } from '@/logics/theme/dark';
  import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';
  import Icon from '@/components/Icon/Icon.vue';

  const { prefixCls } = useDesign('dark-switch');
  const { getDarkMode, setDarkMode, getShowDarkModeToggle } = useRootSetting();

  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);

  const getClass = computed(() => [
    prefixCls,
    {
      [`${prefixCls}--dark`]: unref(isDark),
    },
  ]);

  function toggleDarkMode() {
    const darkMode = getDarkMode.value === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    setDarkMode(darkMode);
    updateDarkTheme(darkMode);
    updateHeaderBgColor();
    updateSidebarBgColor();
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-dark-switch';

  html[data-theme='dark'] {
    .@{prefix-cls} {
      border: 1px solid rgb(196 188 188);
    }
  }

  #body .@{prefix-cls} {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    width: 50px;
    height: 26px;
    margin-left: auto;
    padding: 0 6px;
    border-radius: 30px;
    background-color: #151515;
    cursor: pointer;

    &-inner {
      position: absolute;
      z-index: 1;
      width: 18px;
      height: 18px;
      transition:
        transform 0.5s,
        background-color 0.5s;
      border-radius: 50%;
      background-color: #fff;
      will-change: transform;
    }

    &--dark {
      .@{prefix-cls}-inner {
        transform: translateX(calc(100% + 2px));
      }
    }
  }
</style>
