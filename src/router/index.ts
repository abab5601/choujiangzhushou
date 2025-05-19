import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TicketInputView from '../views/TicketInputView.vue'
import DrawResultsView from '../views/DrawResultsView.vue'
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'
import { trackPageView } from '@/utils/analytics'

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
      path: '/management',
      name: 'management',
      component: HistoryView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

// Add navigation tracking
router.afterEach((to) => {
  // Get the page title from the route meta
  const pageTitle = to.name?.toString() || 'Unknown Page'
  trackPageView(to.fullPath, pageTitle)
})

export default router 