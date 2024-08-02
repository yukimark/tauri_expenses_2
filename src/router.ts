import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './pages/home.vue'
import SpendView from './pages/spend.vue'
import ConfigView from './pages/config.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/spend', component: SpendView },
  { path: '/config', component: ConfigView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
