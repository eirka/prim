# Prim

Imageboard frontend for the Pram REST API built with Vue 3.

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vue Router 4** with `beforeEnter` guards for data loading
- **Pinia** for state management (auth + board stores)
- **Vite** for build/dev server
- **SCSS** for styling (ported from legacy, uses `@import` syntax)
- **Chart.js** via vue-chartjs for admin statistics
- **vue-toastification** for toast notifications
- **Vitest** for unit testing

## Project Layout

All new code is in `vue/`. The legacy AngularJS code remains in `src/` for reference.

```
vue/src/
  config.js           - Runtime config from window.primConfig
  main.js             - App bootstrap
  App.vue             - Root component (header, loading, scroll-to-top)
  router/index.js     - All routes with data-loading guards
  stores/
    auth.js           - Auth state, session, whoami, logout, mod check
    board.js          - Per-board group/role data
  api/
    client.js         - fetch wrapper (withCredentials, CSRF headers, error interceptor)
    client.test.js    - API client tests (headers, CSRF, error handling)
    handlers.js       - Public API endpoints (index, thread, image, tags, etc.)
    userHandlers.js   - User endpoints (login, register, favorites, etc.)
    modHandlers.js    - Mod/admin endpoints (delete, ban, close, sticky, etc.)
  composables/
    useUtils.js       - Image URLs, avatars, thumbnails, quotes, usergroup classes
    useEmoticons.js   - Emoticon token map
  views/              - Page-level components (one per route)
  components/         - Shared components (pagination, comments, draw pad, etc.)
  assets/scss/        - All stylesheets
```

## Key Patterns

- **Data loading**: Route `beforeEnter` guards fetch data and store it in `route.meta.data`. Views read it on mount.
- **Auth**: JWT cookie-based via `withCredentials: true`. The frontend never touches the token directly.
- **Forms**: Thread creation and reply forms use native HTML form submission (`action` attribute pointing to the API), not AJAX. This handles multipart/form-data for file uploads.
- **Drawing pad**: Uses Vue `provide/inject` for parent-child communication between DrawPad, DrawCanvas, DrawControls, and DrawPalette.
- **Comment formatting**: `CommentFormatter.vue` processes text with regex for bold, italic, links, image/YouTube embeds, and emoticons, then renders via `v-html`.
- **Error handling**: API client intercepts 401 (destroy session + reload) and 403 (redirect to /account + toast).

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
npm run dev      # Dev server on port 3000
npm run build    # Production build to vue/dist/
npm run preview  # Preview production build
npm test         # Run tests with Vitest
```

## API Endpoints

All endpoints are prefixed with `config.api_srv` and parameterized with the board ID (`ib_id`).

**Public**: `/get/index`, `/get/thread`, `/get/image`, `/get/directory`, `/get/tags`, `/get/tag`, `/get/popular`, `/get/new`, `/get/favorited`, `/get/tagsearch`, `/get/threadsearch`, `/get/tagtypes`, `/get/whoami`

**User**: `/post/login`, `/post/register`, `/post/logout`, `/post/user/password`, `/post/user/email`, `/post/user/favorite`, `/get/user/favorites`, `/get/user/favorite`

**Mod**: `/admin/statistics`, `/admin/log/board`, `/admin/log/mod`, `/admin/thread`, `/admin/post`, `/admin/tag`, `/admin/close`, `/admin/sticky`, `/admin/imagetag`, `/admin/ban/ip`, `/admin/ban/file`

**Form submissions** (multipart): `/post/thread/new`, `/post/thread/reply`, `/post/tag/add`, `/post/tag/new`, `/post/user/avatar`
