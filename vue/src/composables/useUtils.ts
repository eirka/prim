import config from '@/config';
import router from '@/router';

const imgsrc = config.img_srv + '/src/';
const thumbsrc = config.img_srv + '/thumb/';
const avatarsrc = config.img_srv + '/avatars/';
const queryDate = new Date().getTime();

// Holds the quote text between pages
let commentQuote = '';

// Holds the error code for the error page
let errorCode: number | null = null;

export function setQuote(quote: number): void {
  if (typeof quote === 'number') {
    commentQuote += '>>' + quote + ' ';
  }
}

export function getQuote(): string {
  return commentQuote || '';
}

export function clearQuote(): void {
  commentQuote = '';
}

export function apiError(code: number | undefined): void {
  if (code != null) {
    errorCode = code;
    router.push('/error');
  }
}

export function getError(): number | null {
  return errorCode;
}

export function getFormAction(addr: string): string {
  if (typeof addr === 'string') {
    return config.api_srv + addr;
  }
  return '';
}

export function getImgSrc(filename: string | null): string {
  if (typeof filename === 'string') {
    return imgsrc + filename;
  }
  return '';
}

export function getThumbSrc(filename: string | null, source: string | null): string {
  if (filename && source) {
    if (source.split('.').pop() === 'gif') {
      return imgsrc + source;
    }
    return thumbsrc + filename;
  }
  return '';
}

export function getAvatar(id: number | null): string {
  if (id != null) {
    return avatarsrc + id + '.png?' + queryDate;
  }
  return '';
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString().replace(',', '');
}

export function usergroupClass(group: number): string {
  switch (group) {
    case 2:
      return 'group_registered';
    case 3:
      return 'group_moderator';
    case 4:
      return 'group_admin';
    default:
      return 'group_guest';
  }
}
