<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import handlers from '@/api/handlers';
import modHandlers from '@/api/modHandlers';
import PrimPagination from '@/components/PrimPagination.vue';
import { getThumbSrc } from '@/composables/useUtils';
import config from '@/config';
import { useAuthStore } from '@/stores/auth';
import type { TagDetail, TagResponse, TagType } from '@/types';
import { getErrorMessage } from '@/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const raw = route.meta.data as TagResponse | undefined;
const tagData = ref<TagDetail | null>(raw?.tag?.items ?? null);

// Update/delete tag form
const tagtypes = ref<TagType[]>([]);
const editTagType = ref(tagData.value?.type ?? 1);
const editTagName = ref(tagData.value?.tag ?? '');

if (auth.showModControls) {
  handlers.tagtypes().then((data) => {
    tagtypes.value = data.tagtypes;
  });
}

const updateTag = async () => {
  try {
    const data = await modHandlers.updatetag({
      id: Number(route.params.id),
      tag: editTagName.value,
      tagtype: editTagType.value,
    });
    toast.success(data.success_message);
    router.go(0);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const deleteTag = async () => {
  if (!confirm('Are you sure you want to delete this tag?')) return;
  try {
    const data = await modHandlers.deletetag(Number(route.params.id));
    toast.success(data.success_message);
    router.push('/tags');
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};
const pagination = ref({
  totalItems: raw?.tag?.total || 0,
  currentPage: raw?.tag?.current_page || 1,
  numPages: raw?.tag?.pages || 1,
  itemsPerPage: raw?.tag?.per_page || 10,
  maxSize: 3,
});

// Set page title
if (tagData.value?.tag) {
  document.title = `${tagData.value.tag} | ${config.title}`;
}

const rowClass = (type: number) => {
  switch (type) {
    case 1:
      return 'tagpage-tag';
    case 2:
      return 'tagpage-artist';
    case 3:
      return 'tagpage-character';
    case 4:
      return 'tagpage-copyright';
    default:
      return '';
  }
};

const tagTypeLabel = (type: number) => {
  switch (type) {
    case 1:
      return 'Tag: ';
    case 2:
      return 'Artist: ';
    case 3:
      return 'Character: ';
    case 4:
      return 'Copyright: ';
    default:
      return '';
  }
};

const onPageChange = (page: number) => {
  router.push(`/tag/${route.params.id}/${page}`);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).tagName === 'TEXTAREA'
  )
    return;
  if (e.shiftKey && e.key === 'ArrowLeft' && pagination.value.currentPage > 1) {
    onPageChange(pagination.value.currentPage - 1);
  } else if (
    e.shiftKey &&
    e.key === 'ArrowRight' &&
    pagination.value.currentPage < pagination.value.numPages
  ) {
    onPageChange(pagination.value.currentPage + 1);
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div v-if="tagData" class="tagpage">
    <div class="tagpage_container">
      <div class="tagpage_header" :class="rowClass(tagData.type)">
        <div class="tag_title">
          <span>{{ tagTypeLabel(tagData.type) }}{{ tagData.tag }}</span>
        </div>
        <div v-if="auth.showModControls" class="tag_controls">
          <form class="form-inline" @submit.prevent="updateTag">
            <div class="form-group">
              <select class="form-control" v-model="editTagType">
                <option v-for="t in tagtypes" :key="t.id" :value="t.id">{{ t.type }}</option>
              </select>
            </div>
            <div class="form-group">
              <input
                class="form-control"
                type="text"
                v-model="editTagName"
                minlength="3"
                maxlength="128"
                required
                placeholder="Update Tag"
              />
            </div>
            <div class="form-group">
              <button
                class="form-control button button-primary"
                type="submit"
                :disabled="editTagName.length < 3"
              >
                Update
              </button>
            </div>
            <div class="form-group">
              <a class="form-control button button-danger" @click.prevent="deleteTag" href="#" aria-label="Delete tag">
                <i class="fa fa-fw fa-trash-o"></i>
              </a>
            </div>
          </form>
        </div>
      </div>
      <div class="tagpage_nav">
        <PrimPagination
          :current-page="pagination.currentPage"
          :total-items="pagination.totalItems"
          :items-per-page="pagination.itemsPerPage"
          :max-size="pagination.maxSize"
          @update:current-page="onPageChange"
        />
      </div>
      <div v-if="pagination.totalItems !== 0" class="image_grid">
        <router-link v-for="image in tagData.images" :key="image.id" :to="`/image/${image.id}`">
          <img
            :src="getThumbSrc(image.thumbnail, image.filename)"
            :height="image.tn_height"
            :width="image.tn_width"
            alt=""
          />
        </router-link>
      </div>
      <div v-else class="no_tags">
        <span>No tags <i class="fa fa-frown-o"></i></span>
      </div>
      <div class="tagpage_nav">
        <PrimPagination
          :current-page="pagination.currentPage"
          :total-items="pagination.totalItems"
          :items-per-page="pagination.itemsPerPage"
          :max-size="pagination.maxSize"
          @update:current-page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>
