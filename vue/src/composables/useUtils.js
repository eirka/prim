import config from '@/config'
import router from '@/router'

const imgsrc = config.img_srv + '/src/'
const thumbsrc = config.img_srv + '/thumb/'
const avatarsrc = config.img_srv + '/avatars/'
const queryDate = new Date().getTime()

// Holds the quote text between pages
let commentQuote = ''

// Holds the error code for the error page
let errorCode = null

export function setQuote(quote) {
  if (typeof quote === 'number') {
    commentQuote += '>>' + quote + ' '
  }
}

export function getQuote() {
  return commentQuote || ''
}

export function clearQuote() {
  commentQuote = ''
}

export function apiError(code) {
  if (code != null) {
    errorCode = code
    router.push('/error')
  }
}

export function getError() {
  return errorCode
}

export function getFormAction(addr) {
  if (typeof addr === 'string') {
    return config.api_srv + addr
  }
  return ''
}

export function getImgSrc(filename) {
  if (typeof filename === 'string') {
    return imgsrc + filename
  }
  return ''
}

export function getThumbSrc(filename, source) {
  if (filename && source) {
    if (source.split('.').pop() === 'gif') {
      return imgsrc + source
    }
    return thumbsrc + filename
  }
  return ''
}

export function getAvatar(id) {
  if (id != null) {
    return avatarsrc + id + '.png?' + queryDate
  }
  return ''
}

export function formatDate(date) {
  return new Date(date).toLocaleString().replace(',', '')
}

export function usergroupClass(group) {
  switch (group) {
    case 2: return 'group_registered'
    case 3: return 'group_moderator'
    case 4: return 'group_admin'
    default: return 'group_guest'
  }
}
