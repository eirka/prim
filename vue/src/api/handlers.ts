import { get, post } from './client';
import config from '@/config';
import type {
  IndexResponse,
  ThreadResponse,
  DirectoryResponse,
  ImageResponse,
  TagsResponse,
  TagResponse,
  PopularResponse,
  NewestResponse,
  FavoritedResponse,
  WhoamiResponse,
  TagSearchResponse,
  ThreadSearchResponse,
  PostResponse,
  SuccessResponse,
  TagTypesResponse,
  ImageboardsResponse,
} from '@/types';

const ib = config.ib_id;

// Cache for posts (used by hover boxes)
const postCache = new Map<string, PostResponse>();
const threadSearchCache = new Map<string, ThreadSearchResponse>();
const tagSearchCache = new Map<string, TagSearchResponse>();
let popularCache: PopularResponse | null = null;
let newestCache: NewestResponse | null = null;
let favoritedCache: FavoritedResponse | null = null;
let imageboardsCache: ImageboardsResponse | null = null;

export default {
  index(page: number): Promise<IndexResponse> {
    return get(`/get/index/${ib}/${page}`);
  },
  directory(page: number): Promise<DirectoryResponse> {
    return get(`/get/directory/${ib}/${page}`);
  },
  thread(id: number, page: number): Promise<ThreadResponse> {
    return get(`/get/thread/${ib}/${id}/${page}`);
  },
  post(thread: number, id: number): Promise<PostResponse> {
    const key = `${thread}:${id}`;
    if (postCache.has(key)) return Promise.resolve(postCache.get(key)!);
    return get<PostResponse>(`/get/post/${ib}/${thread}/${id}`).then((data) => {
      postCache.set(key, data);
      return data;
    });
  },
  image(id: number): Promise<ImageResponse> {
    return get(`/get/image/${ib}/${id}`);
  },
  popular(): Promise<PopularResponse> {
    if (popularCache) return Promise.resolve(popularCache);
    return get<PopularResponse>(`/get/popular/${ib}`).then((data) => {
      popularCache = data;
      return data;
    });
  },
  newest(): Promise<NewestResponse> {
    if (newestCache) return Promise.resolve(newestCache);
    return get<NewestResponse>(`/get/new/${ib}`).then((data) => {
      newestCache = data;
      return data;
    });
  },
  favorited(): Promise<FavoritedResponse> {
    if (favoritedCache) return Promise.resolve(favoritedCache);
    return get<FavoritedResponse>(`/get/favorited/${ib}`).then((data) => {
      favoritedCache = data;
      return data;
    });
  },
  tags(page: number): Promise<TagsResponse> {
    return get(`/get/tags/${ib}/${page}`);
  },
  tag(id: number, page: number): Promise<TagResponse> {
    return get(`/get/tag/${ib}/${id}/${page}`);
  },
  tagtypes(): Promise<TagTypesResponse> {
    return get('/get/tagtypes');
  },
  tagsearch(term: string): Promise<TagSearchResponse> {
    if (tagSearchCache.has(term)) return Promise.resolve(tagSearchCache.get(term)!);
    return get<TagSearchResponse>(`/get/tagsearch/${ib}?search=${encodeURIComponent(term)}`).then(
      (data) => {
        tagSearchCache.set(term, data);
        return data;
      }
    );
  },
  threadsearch(term: string): Promise<ThreadSearchResponse> {
    if (threadSearchCache.has(term)) return Promise.resolve(threadSearchCache.get(term)!);
    return get<ThreadSearchResponse>(
      `/get/threadsearch/${ib}?search=${encodeURIComponent(term)}`
    ).then((data) => {
      threadSearchCache.set(term, data);
      return data;
    });
  },
  addtag(body: { tag: number; image: number; ib: number }): Promise<SuccessResponse> {
    return post('/post/tag/add', body);
  },
  newtag(body: { tag: string; tagtype: number; ib: number }): Promise<SuccessResponse> {
    return post('/post/tag/new', body);
  },
  imageboards(): Promise<ImageboardsResponse> {
    if (imageboardsCache) return Promise.resolve(imageboardsCache);
    return get<ImageboardsResponse>('/get/imageboards').then((data) => {
      imageboardsCache = data;
      return data;
    });
  },
  whoami(): Promise<WhoamiResponse> {
    return get(`/get/whoami/${ib}`);
  },
};
