/* eslint-disable @typescript-eslint/no-explicit-any */
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { mitter } from '@/plugins/event-bus'

export function useRouteChange() {
  const route = useRoute()

  // 内部示例
  const _instance: { routeHashChangeCallback: () => void } = {
    routeHashChangeCallback: () => undefined,
  }

  const routeHashChange = (callback: () => {}) => {
    if (callback) {
      _instance.routeHashChangeCallback = callback
    }
  }

  // 页面监听 routeHashChange
  const routeHashChangeName = 'routeHashChange' + route.path
  //监听
  mitter.on(routeHashChangeName as any, () => _instance?.routeHashChangeCallback())
  // 卸载监听
  onUnmounted(() => mitter.off(routeHashChangeName as any))

  return { routeHashChange }
}
