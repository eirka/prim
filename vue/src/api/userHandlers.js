import { get, post } from './client'
import config from '@/config'

const ib = config.ib_id

export default {
  favorites(page) {
    return get(`/get/user/favorites/${ib}/${page}`)
  },
  favorite(id) {
    return get(`/get/user/favorite/${id}`)
  },
  register(body) {
    return post('/post/register', body)
  },
  login(body) {
    return post('/post/login', body)
  },
  logout() {
    return post('/post/logout', {})
  },
  password(body) {
    return post('/post/user/password', body)
  },
  email(body) {
    return post('/post/user/email', body)
  },
  addfavorite(body) {
    return post('/post/user/favorite', body)
  }
}
