<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({ name: 'WelcomeView' })
</script>
<script setup lang="ts">
  import { ref, onMounted, watchEffect, toRaw } from 'vue'
  import { useUserStore } from 'store/index'
  import { apiList } from '@/api/demo'
  import { useRequest } from 'vue-request'
  import { useRouter } from 'vue-router'

  const userStore = useUserStore()

  const count = ref(0)
  const router = useRouter()

  const updataUser = () => {
    userStore.updataUser('welcome,名字')
    run({})
  }

  const { data, run, loading } = useRequest(apiList)

  watchEffect(() => {
    console.log('data:::', toRaw(data.value))
    console.log('loading:::', toRaw(loading.value))
  })

  document.addEventListener('keyup', (e) => {
    // console.log("e.key", e.key);
    if (e.ctrlKey && e.altKey) {
      console.log('e.ctrlKey && e.altKey', true)
    }

    if (e.key === 'p') {
      console.log('p')
    }

    if (e.ctrlKey && e.altKey && e.key === 'p') {
      // this.toggleLoginSign = false;
      console.log('this.toggleLoginSign', 'p')
    }
  })

  onMounted(() => {})
  function toLoginView() {
    router.push({ path: '/login' })
  }
</script>

<template>
  <h2>{{ userStore.name }}</h2>
  <h2>{{ userStore.nameLength }}</h2>
  <button @click="updataUser">修改</button>
  <button @click="toLoginView">toLoginView</button>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    {{ data }}

    <TinymceEditor
      api-key="no-api-key"
      :init="{
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
      }"
      initial-value="Welcome to TinyMCE Vue"
    />
  </div>
</template>

<style scoped>
  .read-the-docs {
    color: #888;
  }
</style>
