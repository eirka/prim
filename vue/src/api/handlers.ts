import config from '@/config';
import type {
  DirectoryResponse,
  FavoritedResponse,
  ImageboardsResponse,
  ImageResponse,
  IndexResponse,
  NewestResponse,
  PopularResponse,
  PostResponse,
  SuccessResponse,
  TagResponse,
  TagSearchResponse,
  TagsResponse,
  TagTypesResponse,
  ThreadResponse,
  ThreadSearchResponse,
  WhoamiResponse,
} from '@/types';
import { get, post } from './client';

// Board ID captured at module load. All endpoint URLs are scoped to this board.
// This value won't change during the app lifecycle since config is set once at startup.
const ib = config.ib_id;

// Caching strategy varies by endpoint:
// - postCache: keyed by thread:post, for comment hover preview boxes. Never cleared.
// - threadSearchCache/tagSearchCache: keyed by search term. Never cleared (low cardinality).
// - popular/newest/favorited: singleton caches for the trending page, cached for the
//   entire session since this data changes infrequently.
// - imageboardsCache: list of boards, cached for session lifetime.
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
    const cached = postCache.get(key);
    if (cached) return Promise.resolve(cached);
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
    const cachedTags = tagSearchCache.get(term);
    if (cachedTags) return Promise.resolve(cachedTags);
    return get<TagSearchResponse>(`/get/tagsearch/${ib}?search=${encodeURIComponent(term)}`).then(
      (data) => {
        tagSearchCache.set(term, data);
        return data;
      }
    );
  },
  threadsearch(term: string): Promise<ThreadSearchResponse> {
    const cachedThreads = threadSearchCache.get(term);
    if (cachedThreads) return Promise.resolve(cachedThreads);
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
