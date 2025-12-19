import "./styles/style.css";
import "./styles/common.css";
import "./styles/theme-variables.css";
import "./styles/admin-dashboard.css";
// import "./styles/learning.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { Icon } from "@iconify/vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconVue from "@element-plus/icons-vue"
import "element-plus/dist/index.css"
import App from "./App.vue";
import router from "./router";


const app = createApp(App);


app.use(createPinia());
app.use(router);
// Element Plus 已透過 unplugin-vue-components 按需引入，無需在此全量註冊
// 圖標也建議在組件中按需引入，或使用 unplugin-icons 自動引入
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
  app.component(key, component)
}
app.component("Icon", Icon);
app.mount("#app");
