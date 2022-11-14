<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

interface FormState {
  username: string
  password: string
  remember: boolean
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})
const state = reactive({
  time: 60,
  loginBtn: false,
  // login type: 0 email, 1 username, 2 telephone
  loginType: 0,
  smsSendBtn: false,
})

const isLoginError = ref(true)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFinish = (values: any) => {
  console.log('Success:', values)
  loginSuccess()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const customActiveKey = ref('tab1')

function handleTabClick(key: string) {
  console.log(key)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function getCaptcha() {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loginSuccess(res?: any) {
  console.log(res)
  router.push({ path: '/' })
  // 延迟 1 秒显示欢迎信息
  setTimeout(() => {
    notification.success({
      message: '欢迎',
      description: `${'xxx'}，欢迎回来`,
    })
  }, 1000)
  isLoginError.value = false
}
</script>

<template>
  <div class="main">
    <a-form
      id="formLogin"
      ref="formLogin"
      class="user-layout-login"
      :model="formState"
      autocomplete="off"
      @finish-failed="onFinishFailed"
      @finish="onFinish">
      <a-tabs v-model:activeKey="customActiveKey" centered animated :tab-bar-gutter="32" @change="handleTabClick">
        <a-tab-pane key="tab1" tab="账户密码登录">
          <a-alert
            v-if="isLoginError"
            type="error"
            banner
            style="margin-bottom: 24px"
            message="账户或密码错误（admin/ant.design）" />
          <a-form-item name="username" :rules="[{ required: true, message: '请输入帐户名或邮箱地址' }]">
            <a-input v-model:value="formState.username" size="large" type="text" placeholder="账号：admin">
              <template #prefix>
                <user-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="formState.password" size="large" placeholder="密码：admin">
              <template #prefix>
                <lock-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input v-model:value="formState.username" size="large" type="text" placeholder="手机号">
              <template #prefix>
                <mobile-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input v-model:value="formState.username" size="large" type="text" placeholder="验证码">
                  <template #prefix>
                    <mail-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button class="getCaptcha" tabindex="-1" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha">
                {{ (!state.smsSendBtn && '获取验证码') || state.time + ' s' }}
              </a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">自动登录</a-checkbox>
        <router-link :to="{ path: '/' }" class="forge-password" style="float: right"> 忘记密码 </router-link>
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          class="login-button"
          size="large"
          type="primary"
          html-type="submit"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >登录</a-button
        >
      </a-form-item>

      <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <alipay-circle-outlined class="item-icon"></alipay-circle-outlined>
        </a>
        <a>
          <taobao-circle-outlined class="item-icon"></taobao-circle-outlined>
        </a>
        <a>
          <weibo-circle-outlined class="item-icon"></weibo-circle-outlined>
        </a>
        <router-link class="register" :to="{ path: '/' }">注册账户</router-link>
      </div>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .ant-tabs-tab {
    padding: 12px 16px;
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
        color: @primary-color;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
<style lang="less">
.user-layout-login {
  .ant-tabs-tab {
    padding: 12px 16px;
  }
}
</style>
