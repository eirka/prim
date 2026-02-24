<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import handlers from '@/api/handlers'
import PrimPagination from '@/components/PrimPagination.vue'

const route = useRoute()
const router = useRouter()

const data = ref(route.meta.data?.tags?.items || [])
const pagination = ref({
  totalItems: route.meta.data?.tags?.total || 0,
  currentPage: route.meta.data?.tags?.current_page || 1,
  numPages: route.meta.data?.tags?.pages || 1,
  itemsPerPage: route.meta.data?.tags?.per_page || 10,
  maxSize: 3
})

const sort = ref({ column: 'total', desc: true })
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

const rowClass = (type) => {
  switch (type) {
    case 2: return 'row-artist'
    case 3: return 'row-character'
    case 4: return 'row-copyright'
    default: return ''
  }
}

const searchTags = async () => {
  if (!searchterm.value || searchterm.value.length < 3) return
  try {
    const result = await handlers.tagsearch(searchterm.value)
    data.value = result.tagsearch || []
  } catch { /* ignore */ }
}

const onPageChange = (page) => {
  if (page === 1) router.push('/tags')
  else router.push('/tags/' + page)
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
  <div class="taglist">
    <div class="taglist_container">
      <div class="tags_list">
        <div class="tags_bar">
          <div class="tags_search">
            <form role="form" class="form-inline" @submit.prevent>
              <input type="text" class="form-control" v-model="searchterm" required minlength="3" maxlength="128" placeholder="Search" @input="searchTags">
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
                <router-link :to="'/tag/' + tag.id + '/1'" rel="nofollow">{{ tag.tag }}</router-link>
              </td>
              <td align="center">{{ tag.total }}</td>
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
