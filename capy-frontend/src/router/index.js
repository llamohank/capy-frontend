import { createRouter, createWebHistory } from "vue-router";
import teacherRouter from "./teacherRouter";
import adminRouter from "./adminRouter";
const routes = [...teacherRouter, ...adminRouter];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
