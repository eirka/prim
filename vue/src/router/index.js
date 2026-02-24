import { createRouter, createWebHistory } from 'vue-router'
import config from '@/config'
import handlers from '@/api/handlers'
import userHandlers from '@/api/userHandlers'
import { apiError } from '@/composables/useUtils'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
      meta: { title: 'Index' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.index(1)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/page/:page',
      name: 'indexPage',
      component: () => import('@/views/IndexView.vue'),
      meta: { title: 'Index' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.index(to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/thread/:id/:page',
      name: 'thread',
      component: () => import('@/views/ThreadView.vue'),
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.thread(to.params.id, to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/directory',
      name: 'directory',
      component: () => import('@/views/DirectoryView.vue'),
      meta: { title: 'Threads' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.directory(1)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/directory/:page',
      name: 'directoryPage',
      component: () => import('@/views/DirectoryView.vue'),
      meta: { title: 'Threads' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.directory(to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/image/:id',
      name: 'image',
      component: () => import('@/views/ImageView.vue'),
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.image(to.params.id)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/TagsView.vue'),
      meta: { title: 'Tags' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.tags(1)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/tags/:page',
      name: 'tagsPage',
      component: () => import('@/views/TagsView.vue'),
      meta: { title: 'Tags' },
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.tags(to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/tag/:id/:page',
      name: 'tag',
      component: () => import('@/views/TagView.vue'),
      beforeEnter: async (to) => {
        try {
          to.meta.data = await handlers.tag(to.params.id, to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/trending',
      name: 'trending',
      component: () => import('@/views/TrendingView.vue'),
      meta: { title: 'Trending' },
      beforeEnter: async (to) => {
        try {
          const [popular, newest, favorited] = await Promise.all([
            handlers.popular(),
            handlers.newest(),
            handlers.favorited()
          ])
          to.meta.data = { popular, newest, favorited }
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
      beforeEnter: async (to) => {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return '/account'
        try {
          to.meta.data = await userHandlers.favorites(1)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/favorites/:page',
      name: 'favoritesPage',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
      beforeEnter: async (to) => {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return '/account'
        try {
          to.meta.data = await userHandlers.favorites(to.params.page)
        } catch (e) { apiError(e.status) }
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
      meta: { title: 'Account' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { title: 'Admin Panel' },
      beforeEnter: async () => {
        const auth = useAuthStore()
        if (!auth.showModControls) return '/account'
      }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  }
})

// Set page title on route change
router.afterEach((to) => {
  const title = to.meta.title || ''
  document.title = title ? `${title} | ${config.title}` : config.title
})

export default router
