import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'
import { useUserStore } from './modules/user'

const store = createPinia()

function setupStore(app: App<Element>) {
  store.use(piniaPluginPersistedstate)
  app.use(store)
}

export { setupStore, useUserStore }
export default store
