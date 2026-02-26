import { get, post, del } from './client'
import config from '@/config'
import type { StatisticsResponse, BoardLogResponse, ModLogResponse, SuccessResponse } from '@/types'

const ib = config.ib_id

export default {
  statistics(): Promise<StatisticsResponse> {
    return get(`/admin/statistics/${ib}`)
  },
  boardlog(page: number | string): Promise<BoardLogResponse> {
    return get(`/admin/log/board/${ib}/${page}`)
  },
  modlog(page: number | string): Promise<ModLogResponse> {
    return get(`/admin/log/mod/${ib}/${page}`)
  },
  deletethread(id: number): Promise<SuccessResponse> {
    return del(`/admin/thread/${ib}/${id}`)
  },
  deletepost(thread: number, id: number): Promise<SuccessResponse> {
    return del(`/admin/post/${ib}/${thread}/${id}`)
  },
  deletetag(id: number): Promise<SuccessResponse> {
    return del(`/admin/tag/${ib}/${id}`)
  },
  close(id: number): Promise<SuccessResponse> {
    return post(`/admin/close/${ib}/${id}`, {})
  },
  sticky(id: number): Promise<SuccessResponse> {
    return post(`/admin/sticky/${ib}/${id}`, {})
  },
  deleteimagetag(image: number, tag: number): Promise<SuccessResponse> {
    return del(`/admin/imagetag/${ib}/${image}/${tag}`)
  },
  updatetag(body: { id: number; tag: string; tagtype: number }): Promise<SuccessResponse> {
    return post(`/admin/tag/${ib}`, body)
  },
  banip(thread: number, id: number, reason: string): Promise<SuccessResponse> {
    return post(`/admin/ban/ip/${ib}/${thread}/${id}`, { reason })
  },
  banfile(thread: number, id: number, reason: string): Promise<SuccessResponse> {
    return post(`/admin/ban/file/${ib}/${thread}/${id}`, { reason })
  }
}
