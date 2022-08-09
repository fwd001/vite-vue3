<script setup lang="ts">
  // import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from 'store/index'
  const userStore = useUserStore()
  const router = useRouter()

  const updataUser = () => {
    userStore.updataUser('login,名字')
  }
  const toWelecomView = () => {
    router.push({ path: '/backstage/welcome' })
  }
</script>

<template>
  <div>登陆</div>

  <p>测试页面,</p>
  <button @click="updataUser">修改</button>

  <button @click="toWelecomView">toWelecomView</button>
  <h2>{{ userStore.name }}</h2>
  <h2>{{ userStore.nameLength }}</h2>
</template>

<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
</style>
