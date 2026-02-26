import { get, post } from './client'
import config from '@/config'
import type { FavoritesResponse, FavoriteStatusResponse, SuccessResponse } from '@/types'

const ib = config.ib_id

export default {
  favorites(page: number | string): Promise<FavoritesResponse> {
    return get(`/get/user/favorites/${ib}/${page}`)
  },
  favorite(id: number | string): Promise<FavoriteStatusResponse> {
    return get(`/get/user/favorite/${id}`)
  },
  register(body: { ib: number; name: string; email: string; password: string }): Promise<SuccessResponse> {
    return post('/post/register', body)
  },
  login(body: { ib: number; name: string; password: string }): Promise<SuccessResponse> {
    return post('/post/login', body)
  },
  logout(): Promise<SuccessResponse> {
    return post('/post/logout', {})
  },
  password(body: { ib: number; oldpw: string; newpw: string }): Promise<SuccessResponse> {
    return post('/post/user/password', body)
  },
  email(body: { ib: number; email: string }): Promise<SuccessResponse> {
    return post('/post/user/email', body)
  },
  addfavorite(body: { image: number }): Promise<SuccessResponse> {
    return post('/post/user/favorite', body)
  }
}
