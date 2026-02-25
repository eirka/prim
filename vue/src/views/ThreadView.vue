<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { usergroupClass, getAvatar, getThumbSrc, getQuote, clearQuote, getFormAction, formatDate } from '@/composables/useUtils'
import config from '@/config'
import CommentHandler from '@/components/CommentHandler.vue'
import PrimPagination from '@/components/PrimPagination.vue'
import DrawPad from '@/components/draw/DrawPad.vue'
import PostMod from '@/components/PostMod.vue'
import ThreadMod from '@/components/ThreadMod.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const board = useBoardStore()

const drawpadVisible = ref(false)
const toggleDrawpad = () => { drawpadVisible.value = !drawpadVisible.value }

const layout = ref('list')
const quote = ref(getQuote())
const hasFile = ref(false)
const canReply = computed(() => quote.value.trim().length >= 3 || hasFile.value)

const threadData = ref(route.meta.data?.thread?.items || {})
const pagination = ref({
  totalItems: route.meta.data?.thread?.total || 0,
  currentPage: route.meta.data?.thread?.current_page || 1,
  numPages: route.meta.data?.thread?.pages || 1,
  itemsPerPage: route.meta.data?.thread?.per_page || 10,
  maxSize: 3
})

// Set page title
if (threadData.value.title) {
  document.title = threadData.value.title + ' | ' + config.title
}

const onPageChange = (page) => {
  router.push('/thread/' + route.params.id + '/' + page)
}

const replyQuote = (id) => {
  if (typeof quote.value !== 'string') quote.value = ''
  quote.value += ' >>' + id + ' '
  window.scrollTo(0, 0)
}

// Clear quote on navigation
const unwatch = router.beforeEach(() => { clearQuote() })
onUnmounted(() => unwatch())

const onKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  if (e.key === 'g') layout.value = 'grid'
  else if (e.key === 'l') layout.value = 'list'
  else if (e.shiftKey && e.key === 'ArrowLeft' && pagination.value.currentPage > 1) {
    onPageChange(pagination.value.currentPage - 1)
  } else if (e.shiftKey && e.key === 'ArrowRight' && pagination.value.currentPage < pagination.value.numPages) {
    onPageChange(pagination.value.currentPage + 1)
  } else if (e.key === 'd') {
    toggleDrawpad()
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <DrawPad :visible="drawpadVisible" @toggle="toggleDrawpad" />
  <div class="postbox">
    <div class="postbox_box">
      <div class="postbox_form">
        <form role="form" name="replyform" :action="getFormAction('/post/thread/reply')" method="post" enctype="multipart/form-data">
          <input type="hidden" name="csrf_token" :value="config.csrf_token" />
          <input type="hidden" name="thread" :value="threadData.id" />
          <div class="form-group">
            <div class="form-control userinfo">
              <span :class="usergroupClass(board.group)">{{ auth.name }}</span>
            </div>
          </div>
          <div class="form-group">
            <textarea id="comment" name="comment" v-model="quote" class="form-control" rows="3" minlength="3" maxlength="1000" placeholder="Comment"></textarea>
          </div>
          <div class="form-group">
            <div class="file-input">
              <input id="file" type="file" name="file" @change="hasFile = !!$event.target.files.length">
            </div>
            <div class="draw-button">
              <a class="button button-success" href="#" @click.prevent="toggleDrawpad">Draw</a>
            </div>
          </div>
          <div class="form-group">
            <button class="button button-block button-primary" type="submit" :disabled="!canReply">Reply</button>
          </div>
        </form>
      </div>
      <div class="postbox_pagination">
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
  <div class="threads">
    <div class="thread">
      <div class="thread_header">
        <div class="thread_title">
          <span>{{ threadData.title }}</span>
        </div>
        <div class="thread_buttons">
          <div v-if="threadData.closed" title="Closed" class="thread_info fa fa-lock"></div>
          <div v-if="threadData.sticky" title="Sticky" class="thread_info fa fa-thumb-tack"></div>
          <div class="button-group">
            <a class="button button-primary fa fa-align-justify" title="Post view" :class="{ active: layout === 'list' }" href="#" @click.prevent="layout = 'list'"></a>
            <a class="button button-primary fa fa-th" title="Image view" :class="{ active: layout === 'grid' }" href="#" @click.prevent="layout = 'grid'"></a>
          </div>
        </div>
        <ThreadMod v-if="auth.showModControls" :thread-id="threadData.id" />
      </div>
      <template v-if="layout === 'list'">
        <div v-for="post in threadData.posts" :key="post.id" :id="'reply-' + post.num" class="thread_row">
          <div v-if="post.thumbnail" class="thread_row_image">
            <router-link :to="'/image/' + post.img_id">
              <img :src="getThumbSrc(post.thumbnail, post.filename)" :height="post.tn_height" :width="post.tn_width">
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
                  <a class="label label-light" href="#" @click.prevent="replyQuote(post.num)">#{{ post.num }}</a>
                </div>
                <div v-if="auth.isAuthenticated" class="info_item">
                  <span v-if="auth.getLastActive(post.time)" class="label label-alert">NEW</span>
                </div>
                <PostMod v-if="auth.showModControls" :thread-id="threadData.id" :post-id="post.id" />
              </div>
            </div>
            <CommentHandler :post="post" :thread="threadData.id" />
          </div>
        </div>
      </template>
      <div v-if="layout === 'grid'" class="image_grid">
        <router-link
          v-for="post in threadData.posts"
          :key="post.id"
          v-show="post.thumbnail"
          :to="'/image/' + post.img_id"
        >
          <img :src="getThumbSrc(post.thumbnail, post.filename)" :height="post.tn_height" :width="post.tn_width">
        </router-link>
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
