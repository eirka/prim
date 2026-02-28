import { get, post } from './client';
import config from '@/config';
import type { FavoritesResponse, FavoriteStatusResponse, SuccessResponse } from '@/types';

const ib = config.ib_id;

const FAV_CACHE_KEY = 'global.favorites';
const FAV_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FavCacheEntry {
  starred: boolean;
  timestamp: number;
}

interface FavCache {
  [imageId: string]: FavCacheEntry;
}

const getFavCache = (): FavCache => {
  try {
    const cached = localStorage.getItem(FAV_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const saveFavEntry = (id: number, starred: boolean) => {
  try {
    const cache = getFavCache();
    cache[String(id)] = { starred, timestamp: Date.now() };
    localStorage.setItem(FAV_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
};

const removeFavEntry = (id: number) => {
  try {
    const cache = getFavCache();
    delete cache[String(id)];
    localStorage.setItem(FAV_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
};

const getFavEntry = (id: number): boolean | null => {
  const cache = getFavCache();
  const entry = cache[String(id)];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > FAV_CACHE_TTL) return null;
  return entry.starred;
};

export const clearFavoritesCache = () => {
  localStorage.removeItem(FAV_CACHE_KEY);
};

export default {
  favorites(page: number): Promise<FavoritesResponse> {
    return get(`/get/user/favorites/${ib}/${page}`);
  },
  favorite(id: number): Promise<FavoriteStatusResponse> {
    const cached = getFavEntry(id);
    if (cached !== null) return Promise.resolve({ starred: cached });
    return get<FavoriteStatusResponse>(`/get/user/favorite/${id}`).then((data) => {
      saveFavEntry(id, data.starred);
      return data;
    });
  },
  register(body: {
    ib: number;
    name: string;
    email: string;
    password: string;
  }): Promise<SuccessResponse> {
    return post('/post/register', body);
  },
  login(body: { ib: number; name: string; password: string }): Promise<SuccessResponse> {
    return post('/post/login', body);
  },
  logout(): Promise<SuccessResponse> {
    return post('/post/logout', {});
  },
  password(body: { ib: number; oldpw: string; newpw: string }): Promise<SuccessResponse> {
    return post('/post/user/password', body);
  },
  email(body: { ib: number; email: string }): Promise<SuccessResponse> {
    return post('/post/user/email', body);
  },
  addfavorite(body: { image: number }): Promise<SuccessResponse> {
    return post<SuccessResponse>('/post/user/favorite', body).then((data) => {
      removeFavEntry(body.image);
      return data;
    });
  },
};
