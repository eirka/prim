<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CommentHandler from '@/components/CommentHandler.vue';
import DrawPad from '@/components/draw/DrawPad.vue';
import PrimPagination from '@/components/PrimPagination.vue';
import {
  formatDate,
  getAvatar,
  getFormAction,
  getThumbSrc,
  setQuote,
  usergroupClass,
} from '@/composables/useUtils';
import config from '@/config';
import { useAuthStore } from '@/stores/auth';
import { useBoardStore } from '@/stores/board';
import type { IndexResponse } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const board = useBoardStore();

const drawpadVisible = ref(false);
const toggleDrawpad = () => {
  drawpadVisible.value = !drawpadVisible.value;
};

const title = ref('');
const comment = ref('');
const hasFile = ref(false);
const canSubmit = computed(
  () => title.value.trim().length >= 3 && comment.value.trim().length >= 3 && hasFile.value
);

const raw = route.meta.data as IndexResponse | undefined;
const data = ref(raw?.index?.items || []);
const pagination = ref({
  totalItems: raw?.index?.total || 0,
  currentPage: raw?.index?.current_page || 1,
  numPages: raw?.index?.pages || 1,
  itemsPerPage: raw?.index?.per_page || 10,
  maxSize: 5,
});

const onPageChange = (page: number) => {
  if (page === 1) {
    router.push('/');
  } else {
    router.push(`/page/${page}`);
  }
};

const replyQuote = (id: number, thread: number, last: number) => {
  setQuote(id);
  router.push(`/thread/${thread}/${last}`);
};

// Keyboard shortcuts
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
  } else if (e.key === 'd') {
    toggleDrawpad();
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <DrawPad :visible="drawpadVisible" @toggle="toggleDrawpad" />
  <div class="postbox">
    <div class="postbox_box">
      <div class="postbox_form">
        <form
          role="form"
          name="newthreadform"
          :action="getFormAction('/post/thread/new')"
          method="post"
          enctype="multipart/form-data"
        >
          <input type="hidden" name="ib" :value="config.ib_id" />
          <input type="hidden" name="csrf_token" :value="config.csrf_token" />
          <div class="form-group">
            <div class="form-control userinfo">
              <span :class="usergroupClass(board.group)">{{ auth.name }}</span>
            </div>
          </div>
          <div class="form-group">
            <input
              type="text"
              id="title"
              required
              name="title"
              v-model="title"
              class="form-control"
              minlength="3"
              maxlength="40"
              placeholder="Title"
            />
          </div>
          <div class="form-group">
            <textarea
              id="comment"
              name="comment"
              required
              v-model="comment"
              class="form-control"
              rows="3"
              minlength="3"
              maxlength="1000"
              placeholder="Comment"
            ></textarea>
          </div>
          <div class="form-group">
            <div class="file-input">
              <input
                id="file"
                type="file"
                name="file"
                required
                @change="hasFile = !!($event.target as HTMLInputElement).files?.length"
              />
            </div>
            <div class="draw-button">
              <a class="button button-success" href="#" @click.prevent="toggleDrawpad">Draw</a>
            </div>
          </div>
          <div class="form-group">
            <button class="button button-block button-primary" type="submit" :disabled="!canSubmit">
              New Thread
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="threads">
    <div v-for="thread in data" :key="thread.id" :id="'thread-' + thread.id" class="thread">
      <div class="thread_index_header">
        <div class="thread_title">
          <router-link :to="'/thread/' + thread.id + '/1'">{{ thread.title }}</router-link>
        </div>
        <div class="thread_buttons">
          <div v-if="thread.closed" title="Closed" class="thread_info">
            <i class="fa fa-lock"></i>
          </div>
          <div v-if="thread.sticky" title="Sticky" class="thread_info">
            <i class="fa fa-thumb-tack"></i>
          </div>
          <div class="thread_info">
            <div class="col">
              <i class="fa fa-fw fa-comment-o" title="Posts"></i><span>{{ thread.total }}</span>
            </div>
            <div class="col">
              <i class="fa fa-fw fa-picture-o" title="Images"></i><span>{{ thread.images }}</span>
            </div>
            <div class="col">
              <i class="fa fa-fw fa-file-o" title="Pages"></i><span>{{ thread.pages }}</span>
            </div>
          </div>
          <router-link
            class="button button-primary"
            :to="'/thread/' + thread.id + '/' + thread.pages"
            >Reply</router-link
          >
        </div>
      </div>
      <div class="thread_row_header">
        <div v-if="thread.total - thread.posts.length >= 1" class="thread_row_omit">
          <router-link :to="'/thread/' + thread.id + '/' + thread.pages">
            {{
              thread.total - thread.posts.length === 1
                ? '1 post omitted...'
                : thread.total - thread.posts.length + ' posts omitted...'
            }}
          </router-link>
        </div>
      </div>
      <div v-for="post in thread.posts" :key="post.id" class="index_row">
        <div v-if="post.thumbnail" class="index_row_image">
          <router-link :to="'/image/' + post.img_id">
            <img
              :src="getThumbSrc(post.thumbnail, post.filename)"
              :height="post.tn_height"
              :width="post.tn_width"
            />
          </router-link>
        </div>
        <div class="thread_content" :class="{ noimage: !post.thumbnail }">
          <div class="thread_row_info">
            <div class="items">
              <div v-if="post.group !== 1" class="info_item">
                <div class="avatar avatar-xsmall">
                  <div class="avatar-inner">
                    <img :src="getAvatar(post.uid)" />
                  </div>
                </div>
              </div>
              <div class="info_item">
                <span :class="usergroupClass(post.group)">{{ post.name }}</span>
              </div>
              <div class="info_item">
                <span>{{ formatDate(post.time) }}</span>
              </div>
              <div class="info_item">
                <a
                  class="label label-light"
                  href="#"
                  @click.prevent="replyQuote(post.num, thread.id, thread.pages)"
                  >#{{ post.num }}</a
                >
              </div>
              <div v-if="auth.isAuthenticated" class="info_item">
                <span v-if="auth.getLastActive(post.time)" class="label label-alert">NEW</span>
              </div>
            </div>
          </div>
          <CommentHandler :post="post" :thread="thread.id" />
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="footer_box">
      <PrimPagination
        :current-page="pagination.currentPage"
        :total-items="pagination.totalItems"
        :items-per-page="pagination.itemsPerPage"
        :max-size="pagination.maxSize"
        @update:current-page="onPageChange"
      />
    </div>
  </div>
</template>
