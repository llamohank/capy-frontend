import { createRouter, createWebHistory } from 'vue-router'

import layout  from '@/views/student/LayoutPage/LayoutPage.vue'
import home from '@/views/student/HomePage/home.vue';
import courses from '@/views/student/ExplorePage/exploreCourses.vue'



const router = createRouter({
    history :createWebHistory(),
    routes:[
    { path: '/', 
        component:layout,
        children:[
        { path: '', name: 'home', component: home},
        { path: 'courses', name: 'exploreCourses', component: courses},
        { path:'courses/:id',name:'courseDetail',component: () => import('@/views/student/CourseDetail/courseDetail.vue')},
        { path:'courses/:id/play',name:'coursePlay',component: () => import('@/views/student/CoursePlay/coursePlay.vue'),meta: { requiresAuth: true }},
        { path:'courses/:id/play/section/:sectionId',name:'coursePlaySection',component: () => import('@/views/student/CoursePlaySection/coursePlaySection.vue'),meta: { requiresAuth: true }},
        //老師相關的
        { path:'teacher/:id',name:'teacherDetail',component: () => import('@/views/student/TeacherDetail/teacherDetail.vue')},
        { path:'teacher/apply',name:'applyTeacher',component: () => import('@/views/student/ApplyTeacher/applyTeacher.vue')},
        //購物車&金流
        { path: 'cart', name: 'cart', component: () => import('@/views/student/cart/cart.vue') },
        { path: 'checkout', name: 'checkout', component: () => import('@/views/student/Checkout/Checkout.vue') },
        { path: 'success', name: 'checkoutSuccess', component: () => import('@/views/student/Checkout/Success.vue') },
        //可加可不加
        {path:'about',name:'about',component: () => import('@/views/student/Others/About.vue')},
        { path: 'contact', name: 'contact', component: () => import('@/views/student/Others/contact.vue') },
        { path: 'privacy', name: 'privacy', component: () => import('@/views/student/Others/Privacy.vue') }
    ] },
    {
      path: '/student',
      component: () => import('@/views/student/LayoutPage/LayoutPage.vue'),
      meta: { requiresAuth: true, role: 'student' },
      children: [
        { path: 'center', name: 'studentCenter', component: () => import('@/views/student/StudentCenter/Profile.vue') }, // '/student/center'
        { path: 'my-learning', name: 'myLearning', component: () => import('@/views/student/StudentCenter/MyLearning.vue') },
        { path: 'wishlist', name: 'wishlist', component: () => import('@/views/student/StudentCenter/WishList.vue') },
        { path: 'orders', name: 'orders', component: () => import('@/views/student/StudentCenter/Orders.vue') },
        { path: 'notifications', name: 'notifications', component: () => import('@/views/student/StudentCenter/Notifications.vue') },
        { path: 'profile', name: 'profile', component: () => import('@/views/student/StudentCenter/Profile.vue') }
      ]
    },
    //登入跟註冊
    { path:"/auth",name:'auth&register',
      component: () => import('@/views/student/Auth&Register/Auth&Register.vue')
      ,children:[
        {
        path:'forgot',
        name:'forgotPasswd',component: () => import('@/views/student/Auth&Register/Forgot.vue')}
    ]} ,
     // 404錯誤 
    { path: '/:pathMatch(.*)*', name: 'not-found',component: () => import('@/views/student/NotFound.vue') }
]
    
});

export default router