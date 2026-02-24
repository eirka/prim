import { get, post } from './client'
import config from '@/config'

const ib = config.ib_id

// Cache for posts (used by hover boxes)
const postCache = new Map()

export default {
  index(page) {
    return get(`/get/index/${ib}/${page}`)
  },
  directory(page) {
    return get(`/get/directory/${ib}/${page}`)
  },
  thread(id, page) {
    return get(`/get/thread/${ib}/${id}/${page}`)
  },
  post(thread, id) {
    const key = `${thread}:${id}`
    if (postCache.has(key)) return Promise.resolve(postCache.get(key))
    return get(`/get/post/${ib}/${thread}/${id}`).then(data => {
      postCache.set(key, data)
      return data
    })
  },
  image(id) {
    return get(`/get/image/${ib}/${id}`)
  },
  popular() {
    return get(`/get/popular/${ib}`)
  },
  newest() {
    return get(`/get/new/${ib}`)
  },
  favorited() {
    return get(`/get/favorited/${ib}`)
  },
  tags(page) {
    return get(`/get/tags/${ib}/${page}`)
  },
  tag(id, page) {
    return get(`/get/tag/${ib}/${id}/${page}`)
  },
  tagtypes() {
    return get('/get/tagtypes')
  },
  tagsearch(term) {
    return get(`/get/tagsearch/${ib}?search=${encodeURIComponent(term)}`)
  },
  threadsearch(term) {
    return get(`/get/threadsearch/${ib}?search=${encodeURIComponent(term)}`)
  },
  addtag(body) {
    return post('/post/tag/add', body)
  },
  newtag(body) {
    return post('/post/tag/new', body)
  },
  whoami() {
    return get(`/get/whoami/${ib}`)
  }
}
