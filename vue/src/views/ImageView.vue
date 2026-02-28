<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { getImgSrc } from '@/composables/useUtils';
import config from '@/config';
import handlers from '@/api/handlers';
import userHandlers from '@/api/userHandlers';
import modHandlers from '@/api/modHandlers';
import type { ImageResponse, ImageDetail, Tag } from '@/types';
import { getErrorMessage } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const raw = route.meta.data as ImageResponse | undefined;
const imageData = ref<ImageDetail | null>(raw?.image ?? null);
const tags = ref<Tag[]>(imageData.value?.tags || []);
const ext = ref(imageData.value?.filename ? imageData.value.filename.split('.').pop() : '');
const starred = ref(false);
const tagInput = ref('');
const tagList = ref<Tag[]>([]);
const selectedTagId = ref<number | null>(null);
const activeIndex = ref(-1);

// Set page title
if (imageData.value) {
  document.title = 'Image ' + imageData.value.id + ' | ' + config.title;
}

// Check favorite status
const checkFavorite = async () => {
  try {
    const data = await userHandlers.favorite(Number(route.params.id));
    starred.value = data.starred;
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

if (auth.isAuthenticated) checkFavorite();

// Tag search
const searchTags = async () => {
  selectedTagId.value = null;
  if (!tagInput.value || tagInput.value.length < 3) {
    tagList.value = [];
    activeIndex.value = -1;
    return;
  }
  try {
    const data = await handlers.tagsearch(tagInput.value);
    tagList.value = (data.tagsearch || []).slice(0, 6);
    activeIndex.value = tagList.value.length > 0 ? 0 : -1;
  } catch {
    /* ignore */
  }
};

// Select tag from dropdown
const selectTag = (tag: Tag) => {
  tagInput.value = tag.tag;
  selectedTagId.value = tag.id;
  tagList.value = [];
  activeIndex.value = -1;
};

// Highlight matching portion of tag name
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const highlightMatch = (name: string) => {
  const term = tagInput.value;
  if (!term) return escapeHtml(name);
  const idx = name.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return escapeHtml(name);
  const before = escapeHtml(name.slice(0, idx));
  const match = escapeHtml(name.slice(idx, idx + term.length));
  const after = escapeHtml(name.slice(idx + term.length));
  return `${before}<strong>${match}</strong>${after}`;
};

// Keyboard navigation for tag dropdown
const onTagKeydown = (e: KeyboardEvent) => {
  if (!tagList.value.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, tagList.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault();
    selectTag(tagList.value[activeIndex.value]);
  }
};

// Update tags
const updateTags = async () => {
  try {
    const data = await handlers.image(route.params.id as string);
    tags.value = data.image.tags;
    tagInput.value = '';
    selectedTagId.value = null;
    tagList.value = [];
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Add tag
const addTag = async () => {
  if (!selectedTagId.value || !imageData.value) {
    toast.error('Tag Does Not Exist');
    return;
  }
  try {
    const data = await handlers.addtag({
      tag: selectedTagId.value,
      image: imageData.value.id,
      ib: config.ib_id,
    });
    await updateTags();
    toast.success(data.success_message);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Delete tag
const deleteTag = async (imageId: number, tagId: number) => {
  if (!confirm('Are you sure you want to delete this tag?')) return;
  try {
    const data = await modHandlers.deleteimagetag(imageId, tagId);
    await updateTags();
    toast.success(data.success_message);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Add favorite
const addFavorite = async () => {
  if (!imageData.value) return;
  try {
    const data = await userHandlers.addfavorite({ image: imageData.value.id });
    checkFavorite();
    toast.success(data.success_message);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Tag type class
const tagClass = (type: number) => {
  switch (Number(type)) {
    case 1:
      return 'tag-default';
    case 2:
      return 'tag-artist';
    case 3:
      return 'tag-character';
    case 4:
      return 'tag-copyright';
    default:
      return 'tag-default';
  }
};

// Keyboard shortcuts
const onKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).tagName === 'TEXTAREA'
  )
    return;
  if (e.key === 'ArrowLeft' && imageData.value?.prev) {
    router.push('/image/' + imageData.value.prev);
  } else if (e.key === 'ArrowRight' && imageData.value?.next) {
    router.push('/image/' + imageData.value.next);
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div v-if="imageData" class="image">
    <div class="image_container">
      <div class="image_box">
        <div class="image_box_nav">
          <div class="image_controls">
            <ul class="pagination">
              <li v-if="imageData.prev">
                <router-link
                  class="fa fa-arrow-left"
                  :to="'/image/' + imageData.prev"
                ></router-link>
              </li>
              <li v-if="auth.isAuthenticated">
                <a
                  :class="starred ? 'fa fa-heart favorited' : 'fa fa-heart-o'"
                  href="#"
                  @click.prevent="addFavorite"
                ></a>
              </li>
              <li>
                <router-link
                  class="fa fa-list"
                  :to="'/thread/' + imageData.thread + '/1'"
                ></router-link>
              </li>
              <li v-if="imageData.next">
                <router-link
                  class="fa fa-arrow-right"
                  :to="'/image/' + imageData.next"
                ></router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="image_box_image">
          <video
            v-if="ext === 'webm'"
            :src="getImgSrc(imageData.filename)"
            :height="imageData.height"
            :width="imageData.width"
            autoplay
            loop
            controls
          ></video>
          <a v-else target="_self" :href="getImgSrc(imageData.filename)">
            <img
              :src="getImgSrc(imageData.filename)"
              :height="imageData.height"
              :width="imageData.width"
            />
          </a>
        </div>
        <div class="image_box_nav">
          <div class="image_controls">
            <ul class="pagination">
              <li v-if="imageData.prev">
                <router-link
                  class="fa fa-arrow-left"
                  :to="'/image/' + imageData.prev"
                ></router-link>
              </li>
              <li v-if="auth.isAuthenticated">
                <a
                  :class="starred ? 'fa fa-heart favorited' : 'fa fa-heart-o'"
                  href="#"
                  @click.prevent="addFavorite"
                ></a>
              </li>
              <li>
                <router-link
                  class="fa fa-list"
                  :to="'/thread/' + imageData.thread + '/1'"
                ></router-link>
              </li>
              <li v-if="imageData.next">
                <router-link
                  class="fa fa-arrow-right"
                  :to="'/image/' + imageData.next"
                ></router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="image_search">
        <div class="image_info_bar" aria-hidden="true"></div>
        <div class="source_links">
          <a
            class="tag tag-source"
            target="_blank"
            :href="
              'https://saucenao.com/search.php?url=' +
              encodeURIComponent(getImgSrc(imageData.filename))
            "
            >SauceNao</a
          >
          <a
            class="tag tag-source"
            target="_blank"
            :href="'https://iqdb.org/?url=' + encodeURIComponent(getImgSrc(imageData.filename))"
            >iqdb</a
          >
          <a
            class="tag tag-source"
            target="_blank"
            :href="
              'https://www.google.com/searchbyimage?image_url=' +
              encodeURIComponent(getImgSrc(imageData.filename)) +
              '&safe=off'
            "
            >Google</a
          >
        </div>
        <div class="image_info_bar" aria-hidden="true"></div>
      </div>
      <div class="image_info">
        <div class="image_info_bar" aria-hidden="true"></div>
        <div v-if="auth.isAuthenticated" class="tag_input">
          <form @submit.prevent="addTag">
            <input
              type="text"
              class="form-control"
              placeholder="Add Tag"
              v-model="tagInput"
              @input="searchTags"
              @keydown="onTagKeydown"
              @blur="tagList = []"
            />
            <div class="dropdown">
              <ul v-if="tagList.length" class="dropdown-menu" style="display: block">
                <li
                  v-for="(tag, i) in tagList"
                  :key="tag.id"
                  :class="{ active: i === activeIndex }"
                  @mouseover="activeIndex = i"
                >
                  <a href="#" @mousedown.prevent="selectTag(tag)" v-html="highlightMatch(tag.tag)"></a>
                </li>
              </ul>
            </div>
            <button class="button button-block button-primary" type="submit" :disabled="!selectedTagId">Add</button>
          </form>
        </div>
        <div v-if="!tags || tags.length === 0" class="no_tags">
          No tags <i class="fa fa-frown-o"></i>
        </div>
        <div v-if="tags && tags.length > 0">
          <div v-for="tag in tags" :key="tag.id" class="tags">
            <div v-if="auth.showModControls" class="mod_button">
              <a
                class="delete_button fa fa-times"
                title="Delete Tag"
                href="#"
                @click.prevent="deleteTag(imageData.id, tag.id)"
              ></a>
            </div>
            <div class="tag_button">
              <router-link
                class="tag"
                :class="tagClass(tag.type)"
                rel="nofollow"
                :to="'/tag/' + tag.id + '/1'"
                >{{ tag.tag }}</router-link
              >
            </div>
          </div>
        </div>
        <div class="image_info_bar" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</template>
