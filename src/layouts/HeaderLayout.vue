<template>
  <div class="layout-header-box header-box flex justify-between">
    <div class="flex items-center pl-20px">
      <div class="h-42px w-130px flex justify-center items-center relative overflow-hidden bg-#eaeaea">
        <!-- <img class="h-100% user-drag" src="@/assets/img/logo.png" alt="log" /> -->
      </div>
      <span class="ml-12px">前端脚手架系统</span>
    </div>
    <div class="user-box flex justify-end">
      <a-dropdown>
        <span class="user-avatar-wrap flex items-center">
          <a-avatar :size="28" class="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="ml-12px">{{ '前端开发' }}</span>
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="fnLogout">
              <a href="javascript:;"> 退出 </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
const router = useRouter()
function fnLogout() {
  fnLogoutLocal()
}
// 清除本地token
async function fnLogoutLocal() {
  try {
    router.push('/user/login')
  } catch (error) {}
}
</script>

<style lang="less" scoped>
.header-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: @header-height;
  background: @bg-main;
  color: #333;
  box-shadow: -2px -1px 2px 1px rgb(0 0 0 / 20%);
}
.user-box {
  padding-right: 30px;
  .user-avatar-wrap {
    padding: 0 12px;
    height: @header-height;
    user-select: none;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .avatar {
      color: #fff;
      background-color: @primary-color;
    }
  }
}
</style>
