// --- Pagination ---

// List endpoints where items is an array (index, directory, tags, logs)
export interface PaginatedList<T> {
  items: T[];
  total: number;
  current_page: number;
  pages: number;
  per_page: number;
}

// Detail endpoints where items is a single object (thread, tag, favorites)
export interface PaginatedDetail<T> {
  items: T;
  total: number;
  current_page: number;
  pages: number;
  per_page: number;
}

// --- Core domain ---

export interface Post {
  id: number;
  num: number;
  uid: number;
  name: string;
  group: number;
  time: string;
  comment: string;
  img_id: number | null;
  filename: string | null;
  thumbnail: string | null;
  tn_height?: number;
  tn_width?: number;
}

// Thread as returned in index (with posts array + summary fields)
export interface Thread {
  id: number;
  title: string;
  closed: boolean;
  sticky: boolean;
  total: number;
  images: number;
  pages: number;
  posts: Post[];
}

// Thread as returned in directory (different shape)
export interface DirectoryThread {
  id: number;
  title: string;
  closed: boolean;
  sticky: boolean;
  postcount: number;
  images: number;
  pages: number;
  last_post: string;
}

// Image thumbnail used in trending, tag pages, favorites
export interface ThumbnailImage {
  id: number;
  filename: string;
  thumbnail: string;
  tn_height: number;
  tn_width: number;
}

// Full image detail
export interface ImageDetail {
  id: number;
  filename: string;
  thumbnail: string;
  height: number;
  width: number;
  prev: number | null;
  next: number | null;
  thread: number;
  tags: Tag[];
}

export interface Tag {
  id: number;
  tag: string;
  type: number;
}

// Tag list row (has a total count)
export interface TagRow {
  id: number;
  tag: string;
  type: number;
  total: number;
}

// Tag detail page (has images)
export interface TagDetail {
  tag: string;
  type: number;
  images: ThumbnailImage[];
}

// Favorites detail
export interface FavoritesDetail {
  images: ThumbnailImage[];
}

export interface TagType {
  id: number;
  type: string;
}

// --- Imageboards ---

export interface Imageboard {
  id: number;
  title: string;
  description: string;
  url: string;
  threads: number;
  posts: number;
  images: number;
}

// --- Auth ---

export interface User {
  id: number;
  name: string;
  authenticated: boolean;
  group: number;
  last_active: string;
  email?: string;
}

// --- Admin ---

export interface LogEntry {
  id: number;
  name: string;
  group: number;
  action: string;
  log_time: string;
}

export interface StatisticsResponse {
  labels: string[];
  series: { name: string; data: number[] }[];
}

// --- API responses (envelope types) ---

export interface IndexResponse {
  index: PaginatedList<Thread>;
}
export interface ThreadResponse {
  thread: PaginatedDetail<Thread>;
}
export interface DirectoryResponse {
  directory: PaginatedList<DirectoryThread>;
}
export interface ImageResponse {
  image: ImageDetail;
}
export interface TagsResponse {
  tags: PaginatedList<TagRow>;
}
export interface TagResponse {
  tag: PaginatedDetail<TagDetail>;
}
export interface FavoritesResponse {
  favorites: PaginatedDetail<FavoritesDetail>;
}
export interface PopularResponse {
  popular: ThumbnailImage[];
}
export interface NewestResponse {
  new: ThumbnailImage[];
}
export interface FavoritedResponse {
  favorited: ThumbnailImage[];
}
export interface WhoamiResponse {
  user: User;
}
export interface TagTypesResponse {
  tagtypes: TagType[];
}
export interface TagSearchResponse {
  tagsearch: Tag[];
}
export interface ThreadSearchResponse {
  threadsearch: DirectoryThread[];
}
export interface PostResponse {
  post: Post;
}
export interface FavoriteStatusResponse {
  starred: boolean;
}
export interface SuccessResponse {
  success_message: string;
}
export interface BoardLogResponse {
  boardlog: PaginatedList<LogEntry>;
}
export interface ModLogResponse {
  modlog: PaginatedList<LogEntry>;
}

export interface ImageboardsResponse {
  imageboards: Imageboard[];
}

// --- Error helpers ---

export interface ApiError {
  status: number;
  data: { error_message?: string };
}

export function getErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'data' in e) {
    const data = (e as ApiError).data;
    return data?.error_message || 'Error';
  }
  return 'Error';
}
