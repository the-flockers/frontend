import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Learn from '../views/Learn.vue'
import News from '../views/News.vue'
import GetInvolved from '../views/GetInvolved.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/learn',
    name: 'Learn',
    component: Learn
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/get-involved',
    name: 'GetInvolved',
    component: GetInvolved
  }
]

const router = createRouter({
  history: createWebHistory('/frontend/'),
  routes
})

export default router
