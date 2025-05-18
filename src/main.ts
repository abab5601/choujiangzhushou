import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { vuetify } from "./plugins/vuetify";
import router from './router';
import App from "./App.vue";
import { analytics } from './utils/analytics';

// 初始化 Google Analytics
analytics.init('G-5CCCNZXFE4');

const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(router);
app.mount("#app");
