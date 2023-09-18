import { defineStore } from 'pinia'

export interface ConfigI {
  url?: string
}
export const useConfigStore = defineStore({
  id: 'configStore',
  state: (): ConfigI => {
    return {
      url: '',
    }
  },
  actions: {
    setConfig(val: ConfigI) {
      this.url = val.url
    },
  },
})
