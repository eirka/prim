import config from '@/config';
import router from '@/router';

const imgsrc = `${config.img_srv}/src/`;
const thumbsrc = `${config.img_srv}/thumb/`;
const avatarsrc = `${config.img_srv}/avatars/`;
// Cache-busting query parameter for avatar URLs. Captured once at app load so
// all avatar requests use the same cache key within a session, but bust browser
// cache across page refreshes (e.g., after uploading a new avatar).
const queryDate = Date.now();

// Module-level mutable state shared across views for the quote reply feature.
// When a user clicks a quote button on one page, setQuote() stores the reference
// here, then the target thread view reads and clears it on mount. This survives
// the navigation between routes because it lives outside any component lifecycle.
let commentQuote = '';

// Holds the error code for the error page
let errorCode: number | null = null;

export function setQuote(quote: number): void {
  if (Number.isFinite(quote)) {
    commentQuote += `>>${quote} `;
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
  return typeof addr === 'string' ? config.api_srv + addr : '';
}

export function getImgSrc(filename: string | null): string {
  return filename ? imgsrc + filename : '';
}

// For GIF images, the API doesn't generate a separate thumbnail — it serves the
// original source file as the thumbnail. Detect GIFs by extension and return the
// full source URL instead of the thumbnail URL.
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
    return `${avatarsrc + id}.png?${queryDate}`;
  }
  return '';
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString().replace(',', '');
}

// Maps Pram API group IDs to CSS class names for styling usernames.
// 1=guest (default), 2=registered, 3=moderator, 4=admin.
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
