/// <reference types="vite/client" />

export {};

declare global {
  interface PrimConfig {
    api_srv: string;
    img_srv: string;
    ib_id: number;
    csrf_token: string;
    title: string;
    logo: string;
    discord_widget?: string;
    // When set, the auth store uses fixture data instead of calling the API.
    // 'user' = regular authenticated user, 'mod' = moderator with mod controls.
    test_mode?: 'user' | 'mod';
  }

  interface Window {
    primConfig: PrimConfig;
  }
}

// Augment Vue Router's RouteMeta to support the data-loading guard pattern:
// - loader: async function called in beforeEach to fetch data before the view mounts
// - data: populated by the loader result, read by view components via route.meta.data
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    requiresMod?: boolean;
    loader?: (to: import('vue-router').RouteLocationNormalized) => Promise<unknown>;
    data?: Record<string, unknown>;
  }
}
