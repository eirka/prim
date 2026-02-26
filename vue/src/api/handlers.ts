import { get, post } from './client'
import config from '@/config'
import type {
  IndexResponse, ThreadResponse, DirectoryResponse, ImageResponse,
  TagsResponse, TagResponse, PopularResponse, NewestResponse,
  FavoritedResponse, WhoamiResponse, TagSearchResponse,
  ThreadSearchResponse, PostResponse, SuccessResponse, TagTypesResponse
} from '@/types'

const ib = config.ib_id

// Cache for posts (used by hover boxes)
const postCache = new Map<string, PostResponse>()

export default {
  index(page: number | string): Promise<IndexResponse> {
    return get(`/get/index/${ib}/${page}`)
  },
  directory(page: number | string): Promise<DirectoryResponse> {
    return get(`/get/directory/${ib}/${page}`)
  },
  thread(id: number | string, page: number | string): Promise<ThreadResponse> {
    return get(`/get/thread/${ib}/${id}/${page}`)
  },
  post(thread: number | string, id: number | string): Promise<PostResponse> {
    const key = `${thread}:${id}`
    if (postCache.has(key)) return Promise.resolve(postCache.get(key)!)
    return get<PostResponse>(`/get/post/${ib}/${thread}/${id}`).then(data => {
      postCache.set(key, data)
      return data
    })
  },
  image(id: number | string): Promise<ImageResponse> {
    return get(`/get/image/${ib}/${id}`)
  },
  popular(): Promise<PopularResponse> {
    return get(`/get/popular/${ib}`)
  },
  newest(): Promise<NewestResponse> {
    return get(`/get/new/${ib}`)
  },
  favorited(): Promise<FavoritedResponse> {
    return get(`/get/favorited/${ib}`)
  },
  tags(page: number | string): Promise<TagsResponse> {
    return get(`/get/tags/${ib}/${page}`)
  },
  tag(id: number | string, page: number | string): Promise<TagResponse> {
    return get(`/get/tag/${ib}/${id}/${page}`)
  },
  tagtypes(): Promise<TagTypesResponse> {
    return get('/get/tagtypes')
  },
  tagsearch(term: string): Promise<TagSearchResponse> {
    return get(`/get/tagsearch/${ib}?search=${encodeURIComponent(term)}`)
  },
  threadsearch(term: string): Promise<ThreadSearchResponse> {
    return get(`/get/threadsearch/${ib}?search=${encodeURIComponent(term)}`)
  },
  addtag(body: { tag: number; image: number; ib: number }): Promise<SuccessResponse> {
    return post('/post/tag/add', body)
  },
  newtag(body: { tag: string; tagtype: number; ib: number }): Promise<SuccessResponse> {
    return post('/post/tag/new', body)
  },
  whoami(): Promise<WhoamiResponse> {
    return get(`/get/whoami/${ib}`)
  }
}
