import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: '用户名',
  }),
  getters: {
    nameLength: (state) => state.name.length,
  },
  actions: {
    updataUser(data: string) {
      this.name = data
    },
  },
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'user-store',
    // 修改为 sessionStorage，默认为 localStorage
    storage: sessionStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
  },
})
