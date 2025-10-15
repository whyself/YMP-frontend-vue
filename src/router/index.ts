
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import SubscriptionManage from '@/views/SubscriptionManage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/user/login',
    name: 'userLogin',
    component: LoginView
  },
  {
    path: '/user/register',
    name: 'userRegister',
    component: RegisterView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: SubscriptionManage
  },
  {
    path: '/',
    redirect: '/home'
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局登录态守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // 允许未登录访问登录/注册页
  if (to.path === '/user/login' || to.path === '/user/register') {
    next();
  } else {
    // 其他页面必须有token
    if (token) {
      next();
    } else {
      next('/user/login');
    }
  }
});

export default router
