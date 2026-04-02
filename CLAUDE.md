# Prim

Imageboard frontend for the Pram REST API built with Vue 3.

## Tech Stack

- **Vue 3** with Composition API (`<script setup lang="ts">`)
- **TypeScript** with strict mode (`vue-tsc` for type checking)
- **Vue Router 4** with `beforeEnter` guards for data loading
- **Pinia** for state management (auth + board stores)
- **Vite** for build/dev server
- **SCSS** for styling (ported from legacy, uses `@import` syntax)
- **Chart.js** via vue-chartjs for admin statistics
- **vue-toastification** for toast notifications
- **Vitest** for unit testing
- **Biome** for formatting and linting (TS, Vue) with `html.experimentalFullSupportEnabled` for template-aware analysis

## Project Layout

All new code is in `vue/`. The legacy AngularJS code remains in `src/` for reference.

```
vue/src/
  config.ts           - Runtime config from window.primConfig
  main.ts             - App bootstrap
  env.d.ts            - Global type declarations (PrimConfig, Window, RouteMeta)
  App.vue             - Root component (header, loading, scroll-to-top)
  types/
    index.ts          - Domain types, API response envelopes, error helpers
  router/index.ts     - All routes with data-loading guards
  stores/
    auth.ts           - Auth state, session, whoami, logout, mod check
    board.ts          - Per-board group/role data
  api/
    client.ts         - fetch wrapper (withCredentials, CSRF headers, error interceptor)
    client.test.ts    - API client tests (headers, CSRF, error handling)
    handlers.ts       - Public API endpoints (index, thread, image, tags, etc.)
    userHandlers.ts   - User endpoints (login, register, favorites, etc.)
    modHandlers.ts    - Mod/admin endpoints (delete, ban, close, sticky, etc.)
  composables/
    useUtils.ts       - Image URLs, avatars, thumbnails, quotes, usergroup classes
    useEmoticons.ts   - Emoticon token map
    useCommentDom.ts  - DOM-based comment formatting (bold, italic, links, emoticons)
  views/              - Page-level components (one per route)
  components/         - Shared components (pagination, comments, draw pad, etc.)
  assets/scss/        - All stylesheets
```

## Key Patterns

- **Data loading**: Route `beforeEnter` guards fetch data and store it in `route.meta.data`. Views read it on mount.
- **Auth**: JWT cookie-based via `withCredentials: true`. The frontend never touches the token directly.
- **Forms**: Thread creation and reply forms use native HTML form submission (`action` attribute pointing to the API), not AJAX. This handles multipart/form-data for file uploads.
- **Drawing pad**: Uses Vue `provide/inject` with typed `InjectionKey<DrawPadContext>` for parent-child communication between DrawPad, DrawCanvas, DrawControls, and DrawPalette.
- **Comment formatting**: `CommentFormatter.vue` delegates to `useCommentDom.ts` which builds DOM nodes via `document.createTreeWalker` for bold, italic, links, image/YouTube embeds, and emoticons.
- **Error handling**: API client intercepts 401 (destroy session + reload) and 403 (redirect to /account + toast).

## TypeScript Conventions

- **View data pattern**: Views cast `route.meta.data` to the typed response envelope, extract into a typed nullable ref, and guard the template with `v-if`:
  ```ts
  const raw = route.meta.data as ThreadResponse | undefined
  const threadData = ref<Thread | null>(raw?.thread?.items ?? null)
  ```
  ```html
  <template v-if="threadData">...</template>
  ```
- **Error narrowing**: Use `getErrorMessage(e)` from `src/types/index.ts` in catch blocks instead of accessing `e.data` directly.
- **Component typing**: Use generic syntax for props (`defineProps<{ post: Post }>()`) and emits (`defineEmits<{ toggle: [] }>()`).
- **No non-null assertions**: Prefer null guards (`if (!ctx.value) return`) over `!` assertions. Enforced by Biome's `noNonNullAssertion` rule.
- **Template refs**: Type as `ref<HTMLElement | null>(null)` and guard before use.
- **API response types**: All responses use envelope interfaces in `src/types/index.ts`. Two pagination generics: `PaginatedList<T>` (items is `T[]`) and `PaginatedDetail<T>` (items is `T`).
- **Auth error handling**: `setAuthState` only destroys the session on 4xx errors. Transient network failures preserve cached state.
- **localStorage**: Use targeted `removeItem()`, never `clear()`. Keys: `global.cache` (auth), `ib{id}.data` (board), `lineWriterCache` (draw pad).

## Config

The app reads `window.primConfig` at startup. The host server must inject:

```js
window.primConfig = {
  api_srv: 'https://api.example.com',
  img_srv: 'https://img.example.com',
  ib_id: 1,
  csrf_token: 'token-here',
  title: 'Board Name',
  discord_widget: 'https://discord.com/api/guilds/.../widget.json'
}
```

## Commands

```bash
cd vue
npm install
npm run dev          # Dev server on port 3000
npm run build        # Production build to vue/dist/
npm run preview      # Preview production build
npm test             # Run tests with Vitest
npm run type-check   # Type check with vue-tsc
npm run format       # Format TS and Vue with Biome
npm run format:check # Check formatting without writing (CI)
npm run lint         # Lint TS and Vue files with Biome
npm run lint:fix     # Auto-fix lint issues
npm run check        # Run format, lint, and import sorting
npm run check:fix    # Auto-fix format, lint, and import sorting
```

## API Endpoints

All endpoints are prefixed with `config.api_srv` and parameterized with the board ID (`ib_id`).

**Public**: `/get/index`, `/get/thread`, `/get/image`, `/get/directory`, `/get/tags`, `/get/tag`, `/get/popular`, `/get/new`, `/get/favorited`, `/get/tagsearch`, `/get/threadsearch`, `/get/tagtypes`, `/get/whoami`

**User**: `/post/login`, `/post/register`, `/post/logout`, `/post/user/password`, `/post/user/email`, `/post/user/favorite`, `/get/user/favorites`, `/get/user/favorite`

**Mod**: `/admin/statistics`, `/admin/log/board`, `/admin/log/mod`, `/admin/thread`, `/admin/post`, `/admin/tag`, `/admin/close`, `/admin/sticky`, `/admin/imagetag`, `/admin/ban/ip`, `/admin/ban/file`

**Form submissions** (multipart): `/post/thread/new`, `/post/thread/reply`, `/post/tag/add`, `/post/tag/new`, `/post/user/avatar`
