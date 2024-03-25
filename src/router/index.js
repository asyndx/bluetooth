import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import OperateView from '@/views/OperateView.vue'
import RunningView from '@/views/RunningView.vue'


const router = createRouter({
  history: import.meta.env.APP_ROUTER_HASH === 'true' ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/operate',
      name: 'operate',
      component: OperateView
    },
    {
      path: '/running',
      name: 'running',
      component: RunningView
    }
  ]
})

export default router
