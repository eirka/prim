# Prim - Agent Guidelines

## Project Overview

Imageboard frontend for the Pram REST API built with Vue 3. All new code is in `vue/`. The legacy AngularJS code remains in `src/` for reference only.

## Commands (run from `vue/`)

```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build to vue/dist/
npm run preview      # Preview production build
npm test             # Run all tests with Vitest
npm run test:watch   # Watch mode (add -- <file> for single file)
npm run type-check   # Type check with vue-tsc
npm run format       # Format TS, Vue, SCSS with Prettier
npm run format:check # Check formatting without writing (CI)
npm run lint         # Lint TS and Vue files with ESLint
npm run lint:fix     # Auto-fix lint issues
```

### Running a Single Test

```bash
# Run specific test file
npm test -- src/api/client.test.ts

# Watch mode for single file
npx vitest watch src/composables/useUtils.test.ts

# Run tests matching pattern
npm test -- --reporter=verbose -t "error handling"
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: No `any`, no implicit `any`
- **No non-null assertions on refs**: Use null guards (`if (!ctx.value) return`) instead of `!`
- **Template refs**: Type as `ref<HTMLElement | null>(null)` and guard before use
- **Casting**: Cast `route.meta.data` to typed response envelope, extract into nullable ref

```typescript
// View data pattern
const raw = route.meta.data as ThreadResponse | undefined
const threadData = ref<Thread | null>(raw?.thread?.items ?? null)
```

### Imports

- Use `@/` alias for src directory: `import config from '@/config'`
- Group imports: Vue, router/stores, composables, api, types, components
- Named exports for composables and utilities

### Types

- All API responses use envelope interfaces in `src/types/index.ts`
- Two pagination generics:
  - `PaginatedList<T>`: items is `T[]` (list endpoints)
  - `PaginatedDetail<T>`: items is a single `T` (detail endpoints)
- Use the provided error helper instead of accessing `e.data` directly

```typescript
import { getErrorMessage } from '@/types'

try {
  await someApiCall()
} catch (e) {
  toast.error(getErrorMessage(e))
}
```

### Naming Conventions

- **Components**: PascalCase (`ThreadView.vue`, `CommentHandler.vue`)
- **Composables**: camelCase with `use` prefix (`useUtils.ts`, `useEmoticons.ts`)
- **Stores**: camelCase with `use` prefix when accessing (`useAuthStore()`)
- **Refs**: camelCase, descriptive names (`threadData`, `drawpadVisible`)
- **Constants**: UPPER_SNAKE_CASE for module-level constants

### Error Handling

- API client intercepts 401 (destroy session + reload) and 403 (redirect to /account + toast)
- Views use `getErrorMessage()` from types for catch blocks
- Network errors in auth preserve cached state; only 4xx destroy session

```typescript
// Correct error handling in views
try {
  const data = await handlers.whoami()
} catch (e) {
  const err = e as { status?: number }
  if (err.status && err.status >= 400 && err.status < 500) {
    destroySession()
  }
}
```

### Vue Components

- Use Composition API with `<script setup lang="ts">`
- Props and emits use inline type definitions:
  ```typescript
  defineProps<{ post: Post }>()
  defineEmits<{ toggle: [] }>()
  ```
- Template refs typed as nullable: `ref<HTMLElement | null>(null)`

### State Management (Pinia)

- Use `defineStore()` with setup syntax
- Module-level mutable state for cross-component communication
- Clear cache keys: `global.cache`, `ib{id}.data`, `lineWriterCache`

### Routing

- Data loading via `beforeEnter` guards in router meta
- Results stored in `route.meta.data` for views to read on mount
- Use `isLoading` ref from router for loading indicators

### Form Submissions

- Thread creation and reply forms use native HTML form submission (not AJAX)
- Forms point to API endpoints via `action` attribute with `multipart/form-data`
- The API client is used for JSON requests only, not file uploads

## Testing Guidelines

- Use Vitest with jsdom environment
- Mock modules at the top of test files using `vi.mock()`
- Restore mocks in `beforeEach()` with `vi.restoreAllMocks()`
- Never leave `Skip()` or stubs - remove broken tests rather than fake passing ones

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/config', () => ({ default: { api_srv: 'https://api.test.com' } }))

beforeEach(() => {
  vi.restoreAllMocks()
})
```

## Key Patterns

- **Auth**: JWT cookie-based via `withCredentials: true`. Frontend never touches the token directly.
- **Drawing pad**: Uses Vue `provide/inject` with typed `InjectionKey<DrawPadContext>`
- **Comment formatting**: Delegates to DOM builder in `useCommentDom.ts` using `document.createTreeWalker`
- **Cache busting**: Captured once at app load for avatar URLs

## Configuration

Runtime config is injected by the host server via `window.primConfig`:

```typescript
interface PrimConfig {
  api_srv: string
  img_srv: string
  ib_id: number
  csrf_token: string
  title: string
  discord_widget?: string
  test_mode?: 'mod' | 'user' // dev only
}
```

Falls back to defaults in development if not provided.
