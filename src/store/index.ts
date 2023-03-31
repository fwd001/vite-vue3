import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const store = createPinia()

export default store

export function setupStore(app: App<Element>) {
  store.use(piniaPluginPersistedstate)
  app.use(store)
}

export * from './modules'
