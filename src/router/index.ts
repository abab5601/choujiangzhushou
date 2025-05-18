import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TicketInputView from '../views/TicketInputView.vue'
import DrawResultsView from '../views/DrawResultsView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/management',
      name: 'management',
      component: HistoryView
    }
  ]
})

export default router 