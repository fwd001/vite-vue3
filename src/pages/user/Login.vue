<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import {
  LockOutlined,
  UserOutlined,
  DoubleRightOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Login',
})

const router = useRouter()

const formLoginRef = ref<FormInstance>()

type LoginApiI = { account: string; password: string }

const formState = reactive<LoginApiI>({
  account: '',
  password: '',
})

// 是否为账号登录
const isAccountLogin = ref(true)
let isPasswordCorrect = true
let errorMsg = ''

function onAccountLoginChange() {
  isAccountLogin.value = !isAccountLogin.value
}

function checkPassword() {
  if (isPasswordCorrect) {
    return Promise.resolve()
  }
  return Promise.reject(new Error(errorMsg || '用户名或密码错误!'))
}

const onFinish = (values: LoginApiI) => {
  if (isAccountLogin.value) {
    // 账号密码登录
    loginSuccess()
    // eslint-disable-next-line no-console
    console.log('values:', values)
  } else {
    // 数字证书登录
    message.warn('暂不支持数字证书！')
  }
}

const onFinishFailed = (errorInfo: { errorFields: []; outOfDate: false; values: {} }) => {
  // eslint-disable-next-line no-console
  console.log('Failed:', errorInfo)
}

function loginSuccess() {
  router.push('/')
  setTimeout(() => {
    message.success('登录成功！')
  }, 500)
}
</script>

<template>
  <div class="login-wrap">
    <a-form
      id="formLogin"
      ref="formLoginRef"
      class="user-layout-login rounded-2px shadow-drop-2-tl"
      :model="formState"
      autocomplete="off"
      @finish-failed="onFinishFailed"
      @finish="onFinish">
      <div class="text-center mb-30px font-500 text-size-24px">前端脚手架系统</div>
      <template v-if="isAccountLogin">
        <a-form-item name="account" :rules="[{ required: true, message: '请输入用户名！' }]">
          <a-input v-model:value="formState.account" size="large" placeholder="用户名">
            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码！' }, { validator: checkPassword }]">
          <a-input
            v-model:value="formState.password"
            size="large"
            type="password"
            placeholder="密码">
            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>
      </template>
      <!-- 证书登录 -->
      <template v-else>
        <div class="h-40.14px bg-#F6F7FB mb-24px rounded-2px pl-11px flex items-center select-none">
          <safety-certificate-outlined
            class="font-color"
            style="font-size: 16px; margin-right: 4px" />
          <span class="c-#AAAAAA">请插入数字证书</span>
        </div>
      </template>
      <div class="pt-12px">
        <a-button size="large" type="primary" block html-type="submit"> 登录 </a-button>
      </div>
      <div v-if="false" class="change-btn-group">
        <div
          v-if="isAccountLogin"
          class="font-color cursor-pointer select-none"
          @click="onAccountLoginChange">
          数字证书登录<double-right-outlined />
        </div>
        <div v-else class="font-color cursor-pointer select-none" @click="onAccountLoginChange">
          账号方式登录<double-right-outlined />
        </div>
      </div>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.login-wrap {
  min-height: 100vh;
  position: relative;
  background-color: #0000000f;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .user-layout-login {
    width: 400px;
    background-color: #fff;
    padding: 40px 50px 56px 50px;
    box-shadow: @box-shadow-base;
  }
  .font-color {
    --un-text-opacity: 1;
    color: @primary-color;
  }
}

.shadow-drop-2-tl {
  -webkit-animation: shadow-drop-2-tl 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: shadow-drop-2-tl 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes shadow-drop-2-tl {
  0% {
    -webkit-transform: translateZ(0) translateX(0) translateY(0);
    transform: translateZ(0) translateX(0) translateY(0);
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    -webkit-transform: translateZ(50px) translateX(12px) translateY(12px);
    transform: translateZ(50px) translateX(12px) translateY(12px);
    -webkit-box-shadow: -12px -12px 20px -12px rgba(0, 0, 0, 0.35);
    box-shadow: -12px -12px 20px -12px rgba(0, 0, 0, 0.35);
  }
}
</style>
