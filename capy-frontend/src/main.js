import "./styles/style.css";
import "./styles/common.css";
import "./styles/admin-dashboard.css";
import "./styles/theme-variables.css";
// import "./styles/learning.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "./styles/element-plus-override.css";
import { Icon } from "@iconify/vue";
import App from "./App.vue";
import router from "./router";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("Icon", Icon);
app.mount("#app");
