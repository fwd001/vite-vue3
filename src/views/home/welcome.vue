<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

import { useUserStore } from "@/store/index";
const userStore = useUserStore();

const count = ref(0);

const updataUser = () => {
  userStore.updataUser("welcome,名字");
};

document.addEventListener("keyup", (e) => {
  // console.log("e.key", e.key);
  if (e.ctrlKey && e.altKey) {
    console.log("e.ctrlKey && e.altKey", true);
  }

  if (e.key === "p") {
    console.log("p");
  }

  if (e.ctrlKey && e.altKey && e.key === "p") {
    // this.toggleLoginSign = false;
    console.log("this.toggleLoginSign", "p");
  }
});

onMounted(() => {});
</script>

<template>
  <h2>{{ userStore.name }}</h2>
  <h2>{{ userStore.nameLength }}</h2>
  <button @click="updataUser">修改</button>
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
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
