import { get, post, del } from './client'
import config from '@/config'

const ib = config.ib_id

export default {
  statistics() {
    return get(`/admin/statistics/${ib}`)
  },
  boardlog(page) {
    return get(`/admin/log/board/${ib}/${page}`)
  },
  modlog(page) {
    return get(`/admin/log/mod/${ib}/${page}`)
  },
  deletethread(id) {
    return del(`/admin/thread/${ib}/${id}`)
  },
  deletepost(thread, id) {
    return del(`/admin/post/${ib}/${thread}/${id}`)
  },
  deletetag(id) {
    return del(`/admin/tag/${ib}/${id}`)
  },
  close(id) {
    return post(`/admin/close/${ib}/${id}`, {})
  },
  sticky(id) {
    return post(`/admin/sticky/${ib}/${id}`, {})
  },
  deleteimagetag(image, tag) {
    return del(`/admin/imagetag/${ib}/${image}/${tag}`)
  },
  updatetag(body) {
    return post(`/admin/tag/${ib}`, body)
  },
  banip(thread, id, reason) {
    return post(`/admin/ban/ip/${ib}/${thread}/${id}`, { reason })
  },
  banfile(thread, id, reason) {
    return post(`/admin/ban/file/${ib}/${thread}/${id}`, { reason })
  }
}
