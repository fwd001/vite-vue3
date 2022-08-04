/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentInstance, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export function useRouteChange() {
  const route = useRoute()
  const { proxy }: any = getCurrentInstance()

  // 内部示例
  const _instance = {
    routeHashChangeCallback: () => null,
  }

  const routeHashChange = (callback: any) => {
    if (callback) {
      _instance.routeHashChangeCallback = callback
    }
  }

  // 页面监听 routeHashChange
  const routeHashChangeName = 'routeHashChange' + route.path
  //监听
  proxy.$EventBus?.on(routeHashChangeName, () => _instance?.routeHashChangeCallback())
  // 卸载监听
  onUnmounted(() => proxy.$EventBus?.off(routeHashChangeName))

  return { routeHashChange }
}
