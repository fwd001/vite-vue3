import { computed } from 'vue'
import { useAppStore, useThemeStore } from '@/store'

type LayoutMode = 'vertical' | 'horizontal'
type LayoutHeaderProps = Record<EnumType.ThemeLayoutMode, GlobalHeaderProps>

export function useBasicLayout() {
  const app = useAppStore()
  const theme = useThemeStore()

  const mode = computed(() => {
    const vertical: LayoutMode = 'vertical'
    const horizontal: LayoutMode = 'horizontal'
    return theme.layout.mode.includes(vertical) ? vertical : horizontal
  })

  const layoutHeaderProps: LayoutHeaderProps = {
    vertical: {
      showLogo: false,
      showHeaderMenu: false,
      showMenuCollapse: true,
    },
    'vertical-mix': {
      showLogo: true,
      showHeaderMenu: false,
      showMenuCollapse: false,
    },
    horizontal: {
      showLogo: true,
      showHeaderMenu: true,
      showMenuCollapse: false,
    },
    'horizontal-mix': {
      showLogo: true,
      showHeaderMenu: false,
      showMenuCollapse: true,
    },
  }

  const headerProps = computed(() => layoutHeaderProps[theme.layout.mode])

  const siderVisible = computed(() => theme.layout.mode !== 'horizontal')
  const siderWidth = computed(() => {
    const { width, mixWidth } = theme.sider
    const isVerticalMix = theme.layout.mode === 'vertical-mix'
    const w = isVerticalMix ? mixWidth : width
    // if (isVerticalMix && app.mixSiderFixed) {
    //   w += mixChildMenuWidth
    // }
    return w
  })
  const siderCollapsedWidth = computed(() => {
    const { collapsedWidth, mixCollapsedWidth } = theme.sider
    const isVerticalMix = theme.layout.mode === 'vertical-mix'
    const w = isVerticalMix ? mixCollapsedWidth : collapsedWidth
    // if (isVerticalMix && app.mixSiderFixed) {
    //   w += mixChildMenuWidth
    // }
    return w
  })

  // 侧面布局sider宽度
  const layouLeftWidth = computed(() => {
    let w
    if (theme.layout.mode === 'vertical' && !app.siderCollapse) {
      w = siderWidth.value + 'px'
    } else if (theme.layout.mode === 'vertical' && app.siderCollapse) {
      w = siderCollapsedWidth.value + 'px'
    }
    return w
  })

  return {
    app,
    theme,
    mode,
    headerProps,
    siderVisible,
    siderWidth,
    siderCollapsedWidth,
    layouLeftWidth,
  }
}
