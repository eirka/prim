/// <reference types="vite/client" />

export {};

declare global {
  interface PrimConfig {
    api_srv: string;
    img_srv: string;
    ib_id: number;
    csrf_token: string;
    title: string;
    discord_widget: string;
  }

  interface Window {
    primConfig: PrimConfig;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    requiresMod?: boolean;
    loader?: (to: import('vue-router').RouteLocationNormalized) => Promise<unknown>;
    data?: Record<string, unknown>;
  }
}
