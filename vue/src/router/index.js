import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import config from '@/config'
import handlers from '@/api/handlers'
import userHandlers from '@/api/userHandlers'
import { apiError } from '@/composables/useUtils'
import { useAuthStore } from '@/stores/auth'

export const isLoading = ref(false)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
      meta: { title: 'Index', loader: () => handlers.index(1) }
    },
    {
      path: '/page/:page',
      name: 'indexPage',
      component: () => import('@/views/IndexView.vue'),
      meta: { title: 'Index', loader: (to) => handlers.index(to.params.page) }
    },
    {
      path: '/thread/:id/:page',
      name: 'thread',
      component: () => import('@/views/ThreadView.vue'),
      meta: { loader: (to) => handlers.thread(to.params.id, to.params.page) }
    },
    {
      path: '/directory',
      name: 'directory',
      component: () => import('@/views/DirectoryView.vue'),
      meta: { title: 'Threads', loader: () => handlers.directory(1) }
    },
    {
      path: '/directory/:page',
      name: 'directoryPage',
      component: () => import('@/views/DirectoryView.vue'),
      meta: { title: 'Threads', loader: (to) => handlers.directory(to.params.page) }
    },
    {
      path: '/image/:id',
      name: 'image',
      component: () => import('@/views/ImageView.vue'),
      meta: { loader: (to) => handlers.image(to.params.id) }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/TagsView.vue'),
      meta: { title: 'Tags', loader: () => handlers.tags(1) }
    },
    {
      path: '/tags/:page',
      name: 'tagsPage',
      component: () => import('@/views/TagsView.vue'),
      meta: { title: 'Tags', loader: (to) => handlers.tags(to.params.page) }
    },
    {
      path: '/tag/:id/:page',
      name: 'tag',
      component: () => import('@/views/TagView.vue'),
      meta: { loader: (to) => handlers.tag(to.params.id, to.params.page) }
    },
    {
      path: '/trending',
      name: 'trending',
      component: () => import('@/views/TrendingView.vue'),
      meta: {
        title: 'Trending',
        loader: async () => {
          const [popular, newest, favorited] = await Promise.all([
            handlers.popular(),
            handlers.newest(),
            handlers.favorited()
          ])
          return { popular, newest, favorited }
        }
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites', requiresAuth: true, loader: () => userHandlers.favorites(1) }
    },
    {
      path: '/favorites/:page',
      name: 'favoritesPage',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorites', requiresAuth: true, loader: (to) => userHandlers.favorites(to.params.page) }
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
      meta: { title: 'Admin Panel', requiresMod: true }
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

// Load data before each navigation (beforeEnter doesn't fire on same-route param changes)
router.beforeEach(async (to) => {
  isLoading.value = true
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return '/account'
  }
  if (to.meta.requiresMod) {
    const auth = useAuthStore()
    if (!auth.showModControls) return '/account'
  }
  if (to.meta.loader) {
    try {
      to.meta.data = await to.meta.loader(to)
    } catch (e) { apiError(e.status) }
  }
})

// Set page title on route change
router.afterEach((to) => {
  isLoading.value = false
  const title = to.meta.title || ''
  document.title = title ? `${title} | ${config.title}` : config.title
})

router.onError(() => { isLoading.value = false })

export default router
