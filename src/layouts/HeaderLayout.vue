<template>
  <div class="layout-header-box header-box flex justify-between">
    <div class="flex items-center pl-20px">
      <div
        class="logo-wrap h-42px w-130px flex justify-center items-center relative overflow-hidden bg-#eaeaea">
        <img class="h-100% user-drag" src="@/assets/images/logo.svg" alt="logo.png" />
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
  color: @text-color;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
    0 2px 4px 0 rgb(0 0 0 / 2%);
  .logo-wrap {
    border-radius: @border-radius-base;
  }
}
.user-box {
  padding-right: 30px;
  .user-avatar-wrap {
    padding: 0 12px;
    height: calc(@header-height - 8px);
    border-radius: @border-radius-base;
    user-select: none;
    margin: 4px;
    &:hover {
      background-color: #0000000f;
    }
    .avatar {
      color: #fff;
      background-color: @primary-color;
    }
  }
}
</style>
