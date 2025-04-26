import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'LoginLayout',
      path: '/login',
      component: () => import('../layout/LoginLayout.vue'),
      meta: {
        requiresAuth: false,
      },
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/Login/index.vue'),
        }
      ]
    },
    {
      name: 'DefaultLayout',
      path: '/',
      component: () => import('../layout/DefaultLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Home/index.vue'),
        }
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const { usuario } = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !usuario?.codigo) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
