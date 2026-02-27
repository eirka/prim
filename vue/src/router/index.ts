import { ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import config from '@/config';
import handlers from '@/api/handlers';
import userHandlers from '@/api/userHandlers';
import { apiError } from '@/composables/useUtils';
import { useAuthStore } from '@/stores/auth';
import type { ApiError } from '@/types';
import IndexView from '@/views/IndexView.vue';
import ThreadView from '@/views/ThreadView.vue';
import DirectoryView from '@/views/DirectoryView.vue';
import ImageView from '@/views/ImageView.vue';
import TagsView from '@/views/TagsView.vue';
import TagView from '@/views/TagView.vue';
import TrendingView from '@/views/TrendingView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import AccountView from '@/views/AccountView.vue';
import AdminView from '@/views/AdminView.vue';
import ErrorView from '@/views/ErrorView.vue';

export const isLoading = ref(false);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      meta: { title: 'Index', loader: () => handlers.index(1) },
    },
    {
      path: '/page/:page',
      name: 'indexPage',
      component: IndexView,
      meta: { title: 'Index', loader: (to) => handlers.index(to.params.page as string) },
    },
    {
      path: '/thread/:id/:page',
      name: 'thread',
      component: ThreadView,
      meta: { loader: (to) => handlers.thread(to.params.id as string, to.params.page as string) },
    },
    {
      path: '/directory',
      name: 'directory',
      component: DirectoryView,
      meta: { title: 'Threads', loader: () => handlers.directory(1) },
    },
    {
      path: '/directory/:page',
      name: 'directoryPage',
      component: DirectoryView,
      meta: { title: 'Threads', loader: (to) => handlers.directory(to.params.page as string) },
    },
    {
      path: '/image/:id',
      name: 'image',
      component: ImageView,
      meta: { loader: (to) => handlers.image(to.params.id as string) },
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagsView,
      meta: { title: 'Tags', loader: () => handlers.tags(1) },
    },
    {
      path: '/tags/:page',
      name: 'tagsPage',
      component: TagsView,
      meta: { title: 'Tags', loader: (to) => handlers.tags(to.params.page as string) },
    },
    {
      path: '/tag/:id/:page',
      name: 'tag',
      component: TagView,
      meta: { loader: (to) => handlers.tag(to.params.id as string, to.params.page as string) },
    },
    {
      path: '/trending',
      name: 'trending',
      component: TrendingView,
      meta: {
        title: 'Trending',
        loader: async () => {
          const [popular, newest, favorited] = await Promise.all([
            handlers.popular(),
            handlers.newest(),
            handlers.favorited(),
          ]);
          return { popular, newest, favorited };
        },
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: { title: 'Favorites', requiresAuth: true, loader: () => userHandlers.favorites(1) },
    },
    {
      path: '/favorites/:page',
      name: 'favoritesPage',
      component: FavoritesView,
      meta: {
        title: 'Favorites',
        requiresAuth: true,
        loader: (to) => userHandlers.favorites(to.params.page as string),
      },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { title: 'Account' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { title: 'Admin Panel', requiresMod: true },
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash };
    return { top: 0 };
  },
});

// Load data before each navigation (beforeEnter doesn't fire on same-route param changes)
router.beforeEach(async (to) => {
  isLoading.value = true;
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      isLoading.value = false;
      return '/account';
    }
  }
  if (to.meta.requiresMod) {
    const auth = useAuthStore();
    if (!auth.showModControls) {
      isLoading.value = false;
      return '/account';
    }
  }
  if (to.meta.loader) {
    try {
      to.meta.data = (await to.meta.loader(to)) as Record<string, unknown>;
    } catch (e) {
      const err = e as ApiError;
      apiError(err.status);
      return false;
    }
  }
});

// Set page title on route change
router.afterEach((to) => {
  isLoading.value = false;
  const title = to.meta.title || '';
  document.title = title ? `${title} | ${config.title}` : config.title;
});

router.onError(() => {
  isLoading.value = false;
});

export default router;
