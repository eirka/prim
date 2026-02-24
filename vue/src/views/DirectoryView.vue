<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import handlers from '@/api/handlers'
import PrimPagination from '@/components/PrimPagination.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const data = ref(route.meta.data?.directory?.items || [])
const pagination = ref({
  totalItems: route.meta.data?.directory?.total || 0,
  currentPage: route.meta.data?.directory?.current_page || 1,
  numPages: route.meta.data?.directory?.pages || 1,
  itemsPerPage: route.meta.data?.directory?.per_page || 10,
  maxSize: 3
})

const sort = ref({ column: 'last_post', desc: true })
const searchterm = ref('')

const changeSorting = (column) => {
  if (sort.value.column === column) {
    sort.value.desc = !sort.value.desc
  } else {
    sort.value.column = column
    sort.value.desc = false
  }
}

const sortedData = ref([])
import { watch } from 'vue'
watch([data, sort], () => {
  const arr = [...data.value]
  arr.sort((a, b) => {
    const col = sort.value.column
    const aVal = a[col]
    const bVal = b[col]
    if (aVal < bVal) return sort.value.desc ? 1 : -1
    if (aVal > bVal) return sort.value.desc ? -1 : 1
    return 0
  })
  sortedData.value = arr
}, { immediate: true, deep: true })

const searchThreads = async () => {
  if (!searchterm.value || searchterm.value.length < 3) return
  try {
    const result = await handlers.threadsearch(searchterm.value)
    data.value = result.threadsearch || []
  } catch { /* ignore */ }
}

const onPageChange = (page) => {
  if (page === 1) router.push('/directory')
  else router.push('/directory/' + page)
}

const onKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  if (e.shiftKey && e.key === 'ArrowLeft' && pagination.value.currentPage > 1) {
    onPageChange(pagination.value.currentPage - 1)
  } else if (e.shiftKey && e.key === 'ArrowRight' && pagination.value.currentPage < pagination.value.numPages) {
    onPageChange(pagination.value.currentPage + 1)
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="directory">
    <div class="directory_container">
      <div class="directory_list">
        <div class="directory_bar">
          <div class="directory_search">
            <form role="form" class="form-inline" @submit.prevent>
              <input type="text" class="form-control" v-model="searchterm" required minlength="3" maxlength="128" placeholder="Search" @input="searchThreads">
            </form>
          </div>
        </div>
        <div v-if="!sortedData.length" class="no_threads">
          <span>No threads <i class="fa fa-frown-o"></i></span>
        </div>
        <table v-if="sortedData.length">
          <thead>
            <tr>
              <th style="text-align:left;"><a href="#" @click.prevent="changeSorting('title')">Title</a></th>
              <th style="text-align:center;"><a href="#" @click.prevent="changeSorting('postcount')"><i class="fa fa-fw fa-comment-o" title="Posts"></i></a></th>
              <th style="text-align:center;"><a href="#" @click.prevent="changeSorting('images')"><i class="fa fa-fw fa-picture-o" title="Images"></i></a></th>
              <th style="text-align:center;"><a href="#" @click.prevent="changeSorting('last_post')">Last Post</a></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="thread in sortedData" :key="thread.id">
              <td style="width:auto;text-align:left;">
                <i v-if="thread.closed" title="Closed" class="fa fa-lock"></i>
                <i v-if="thread.sticky" title="Sticky" class="fa fa-thumb-tack"></i>
                <router-link :to="'/thread/' + thread.id + '/1'" rel="nofollow">{{ thread.title }}</router-link>
                <span v-if="auth.getLastActive(thread.last_post)" class="label label-alert">NEW</span>
                <router-link v-if="thread.pages > 1" :to="'/thread/' + thread.id + '/' + thread.pages" title="Last page" class="label lastpage">last page</router-link>
              </td>
              <td style="width:3em;text-align:center;">{{ thread.postcount }}</td>
              <td style="width:3em;text-align:center;">{{ thread.images }}</td>
              <td style="width:20%;text-align:center;">{{ new Date(thread.last_post).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div class="directory_bar">
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
