import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TicketInputView from '../views/TicketInputView.vue'
import DrawResultsView from '../views/DrawResultsView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/input',
      name: 'input',
      component: TicketInputView
    },
    {
      path: '/results',
      name: 'results',
      component: DrawResultsView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    }
  ]
})

export default router 