<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import handlers from '@/api/handlers';
import config from '@/config';
import PrimPagination from '@/components/PrimPagination.vue';
import type { TagsResponse, TagRow, Tag, TagType } from '@/types';
import { getErrorMessage } from '@/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

// New tag form
const tagtypes = ref<TagType[]>([]);
const newTagType = ref(1);
const newTagName = ref('');

if (auth.isAuthenticated) {
  handlers.tagtypes().then((data) => {
    tagtypes.value = data.tagtypes;
  });
}

const refreshTags = async () => {
  try {
    const result = await handlers.tags(pagination.value.currentPage);
    data.value = result.tags?.items || [];
    pagination.value = {
      totalItems: result.tags?.total || 0,
      currentPage: result.tags?.current_page || 1,
      numPages: result.tags?.pages || 1,
      itemsPerPage: result.tags?.per_page || 10,
      maxSize: 3,
    };
  } catch {
    /* ignore */
  }
};

const createTag = async () => {
  try {
    const result = await handlers.newtag({
      tag: newTagName.value,
      tagtype: newTagType.value,
      ib: config.ib_id,
    });
    toast.success(result.success_message);
    newTagName.value = '';
    await refreshTags();
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const raw = route.meta.data as TagsResponse | undefined;
const data = ref<(TagRow | Tag)[]>(raw?.tags?.items || []);
const pagination = ref({
  totalItems: raw?.tags?.total || 0,
  currentPage: raw?.tags?.current_page || 1,
  numPages: raw?.tags?.pages || 1,
  itemsPerPage: raw?.tags?.per_page || 10,
  maxSize: 3,
});

const sort = ref({ column: 'total' as string, desc: true });
const searchterm = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

const changeSorting = (column: string) => {
  if (sort.value.column === column) {
    sort.value.desc = !sort.value.desc;
  } else {
    sort.value.column = column;
    sort.value.desc = false;
  }
};

const sortedData = ref<(TagRow | Tag)[]>([]);
watch(
  [data, sort],
  () => {
    const arr = [...data.value];
    arr.sort((a, b) => {
      const col = sort.value.column as keyof typeof a;
      const aVal = a[col] as string | number;
      const bVal = b[col] as string | number;
      if (aVal < bVal) return sort.value.desc ? 1 : -1;
      if (aVal > bVal) return sort.value.desc ? -1 : 1;
      return 0;
    });
    sortedData.value = arr;
  },
  { immediate: true, deep: true }
);

const rowClass = (type: number) => {
  switch (type) {
    case 2:
      return 'row-artist';
    case 3:
      return 'row-character';
    case 4:
      return 'row-copyright';
    default:
      return '';
  }
};

const searchTags = () => {
  clearTimeout(debounceTimer);
  if (!searchterm.value || searchterm.value.length < 3) {
    data.value = raw?.tags?.items || [];
    pagination.value = {
      totalItems: raw?.tags?.total || 0,
      currentPage: raw?.tags?.current_page || 1,
      numPages: raw?.tags?.pages || 1,
      itemsPerPage: raw?.tags?.per_page || 10,
      maxSize: 3,
    };
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const result = await handlers.tagsearch(searchterm.value);
      data.value = result.tagsearch || [];
      pagination.value = {
        totalItems: data.value.length,
        currentPage: 1,
        numPages: 1,
        itemsPerPage: data.value.length || 10,
        maxSize: 3,
      };
    } catch {
      /* ignore */
    }
  }, 300);
};

const onPageChange = (page: number) => {
  if (page === 1) router.push('/tags');
  else router.push('/tags/' + page);
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
  <div class="taglist">
    <div class="taglist_container">
      <div class="tags_list">
        <div class="tags_bar">
          <div v-if="auth.isAuthenticated" class="tags_input">
            <form class="form-inline" @submit.prevent="createTag">
              <div class="form-group">
                <select class="form-control" v-model="newTagType">
                  <option v-for="t in tagtypes" :key="t.id" :value="t.id">{{ t.type }}</option>
                </select>
              </div>
              <div class="form-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="newTagName"
                  minlength="3"
                  maxlength="128"
                  required
                  placeholder="New Tag"
                />
              </div>
              <div class="form-group">
                <button
                  class="form-control button button-primary"
                  type="submit"
                  :disabled="newTagName.length < 3"
                >
                  New Tag
                </button>
              </div>
            </form>
          </div>
          <div class="tags_search">
            <form role="form" class="form-inline" @submit.prevent>
              <input
                type="text"
                class="form-control"
                v-model="searchterm"
                required
                minlength="3"
                maxlength="128"
                placeholder="Search"
                @input="searchTags"
              />
            </form>
          </div>
        </div>
        <div v-if="!sortedData.length" class="no_tags">
          <span>No tags <i class="fa fa-frown-o"></i></span>
        </div>
        <table v-if="sortedData.length">
          <thead>
            <tr>
              <th width="6%"><a href="#" @click.prevent="changeSorting('type')">Type</a></th>
              <th align="left"><a href="#" @click.prevent="changeSorting('tag')">Tag</a></th>
              <th width="10%"><a href="#" @click.prevent="changeSorting('total')">Total</a></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in sortedData" :key="tag.id" :class="rowClass(tag.type)">
              <td align="center">
                <i v-if="tag.type === 1" title="Tag" class="fa fa-tag"></i>
                <i v-if="tag.type === 2" title="Artist" class="fa fa-paint-brush"></i>
                <i v-if="tag.type === 3" title="Character" class="fa fa-female"></i>
                <i v-if="tag.type === 4" title="Copyright" class="fa fa-copyright"></i>
              </td>
              <td>
                <router-link :to="'/tag/' + tag.id + '/1'" rel="nofollow">{{
                  tag.tag
                }}</router-link>
              </td>
              <td align="center">{{ 'total' in tag ? tag.total : '' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="tags_bar">
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
  </div>
</template>
