import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "@/router/index";
import antd from "@/common/antdv";
import mitt from "@/common/event-bus";
import { createPinia } from 'pinia'
import "@/assets/js/polyfill";
import "@/assets/css/public.less";
import "@/assets/css/common.less";


const app = createApp(App);

app.use(router);
app.use(createPinia())
app.use(antd);
app.use(mitt);
app.mount("#app");
