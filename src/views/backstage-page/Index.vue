<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from 'store/modules/user'
import { apiList } from '@/api/demo'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'WelcomeView',
})

const userStore = useUserStore()

const count = ref(0)
const router = useRouter()

const editorText = ref('')

const updataUser = () => {
  userStore.updataUser('welcome,名字')
  run({ query: 'string' })
}

const { data, run } = useRequest(apiList, { defaultParams: [{ query: 'string' }] })

function toLoginView() {
  router.push({ path: '/login' })
}

const editorConfig = {
  branding: false, // 去水印
  language: 'zh_CN',
  height: 500,
  menubar: false,
  plugins: [
    'a11ychecker',
    'advlist',
    'advcode',
    'advtable',
    'autolink',
    'checklist',
    'export',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'powerpaste',
    'fullscreen',
    'formatpainter',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
  ],
  toolbar:
    'undo redo | casechange blocks | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlst checklist outdent indent | removeformat | a11ycheck code table help',
}
</script>

<template>
  <div class="page-wrap">
    <div class="mb-12px">
      <span>{{ userStore.name }}: </span>
      <span>{{ userStore.nameLength }}</span>
    </div>
    <a-button class="mb-12px" block @click="updataUser">修改</a-button>
    <button class="mb-12px" @click="toLoginView">toLoginView</button>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p v-ellipsis class="w-100">TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>
      <p>TypeScript + vite + vue3 + pinia</p>

      <p>请求测试：</p>
      <p>{{ data }}</p>

      <p>富文本</p>

      <TinymceEditor
        id="tinymce-wrap"
        v-model:modelValue="editorText"
        api-key="no-api-key"
        :init="editorConfig"
        tinymce-script-src="/lib/tinymce/tinymce.min.js"
        initial-value="Welcome to TinyMCE Vue" />
    </div>
  </div>
</template>

<style scoped></style>
