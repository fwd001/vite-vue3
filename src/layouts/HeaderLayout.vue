<template>
  <div class="layout-header-box">
    <div class="header-box">
      <div class="user-box flex justify-end">
        <a-dropdown>
          <span class="user-avatar-wrap flex items-center">
            <span class="user-avatar text-center">u</span>
            <span>xxms</span>
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="fnLogout">
                <a href="javascript:;">退出</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { useRoute, useRouter } from 'vue-router'

  // const route = useRoute()
  // const router = useRouter()

  function fnLogout() {
    fnLogoutLocal()
  }
  // 清除本地token
  async function fnLogoutLocal() {
    try {
    } catch (error) {}
  }
</script>

<style lang="less">
  .layout-header-box {
    .tip-tag-box {
      .anticon-close {
        display: none;
        position: absolute;
        right: -1px;
        top: 3px;
        width: 18px;
        height: 18px;
        line-height: 22px;
        color: #fff;
        border-radius: 50%;
        background-color: @disabled-color;
        &:hover {
          color: @text-color-secondary;
        }
      }
      .route-tag {
        padding-right: 16px !important;
        &:hover {
          .anticon-close {
            display: block;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .header-box {
    width: 100%;
    height: 44px;
    background: @bg-main;
    line-height: 44px;
    padding-left: 16px;
    font-size: 13px;
    color: #fff;
  }
  .user-box {
    padding: 0 30px;
    .user-avatar-wrap {
      padding: 0 12px;
      height: 44px;
      user-select: none;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    .user-avatar {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      font-size: 16px;
      line-height: 24px;
      color: @active-color;
      background: #fff;
      border-radius: 50%;
    }
  }
  .route-list {
    margin: 10px 15px;
    height: 26px;
    .route-tag {
      position: relative;
      padding: 2px 8px;
      font-size: 13px;
      white-space: unset;
      overflow: hidden;
    }
  }
</style>
