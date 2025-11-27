import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/After login/AfterLogin.vue"



import BeforeLogin from "@/views/student/Home/BeforeLogin.vue";
import AfterLogin from "@/components/After login/AfterLogin.vue";
import LoginPage from "@/views/student/Home/LoginPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path:'/',
        name:'Landing',
        component:BeforeLogin,
    },
    {
      path:'/LoginPage',
      name:'LoginPage',
      component:LoginPage
    },

    {
      path: '/AfterLogin',
      name: 'AfterLogin',
      component: AfterLogin,
    },
    {
  path: '/teacher/:id',
  name: 'TeacherDetail',
  component: () => import('@/views/student/Home/TeacherDetail.vue'),
  props: true
},
  ],
});

export default router;

