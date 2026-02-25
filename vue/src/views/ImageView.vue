<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { getImgSrc } from '@/composables/useUtils'
import config from '@/config'
import handlers from '@/api/handlers'
import userHandlers from '@/api/userHandlers'
import modHandlers from '@/api/modHandlers'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const imageData = ref(route.meta.data?.image || {})
const tags = ref(imageData.value.tags || [])
const ext = ref(imageData.value.filename ? imageData.value.filename.split('.').pop() : '')
const starred = ref(false)
const selected = ref(null)
const tagList = ref([])

// Set page title
document.title = 'Image ' + imageData.value.id + ' | ' + config.title

// Check favorite status
const checkFavorite = async () => {
  try {
    const data = await userHandlers.favorite(route.params.id)
    starred.value = data.starred
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

if (auth.isAuthenticated) checkFavorite()

// Tag search
const searchTags = async (term) => {
  if (!term || term.length < 3) return
  try {
    const data = await handlers.tagsearch(term)
    tagList.value = (data.tagsearch || []).slice(0, 6)
  } catch { /* ignore */ }
}

// Update tags
const updateTags = async () => {
  try {
    const data = await handlers.image(route.params.id)
    tags.value = data.image.tags
    selected.value = null
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

// Add tag
const addTag = async () => {
  if (!selected.value || typeof selected.value !== 'number') {
    toast.error('Tag Does Not Exist')
    return
  }
  try {
    const data = await handlers.addtag({
      tag: selected.value,
      image: imageData.value.id,
      ib: config.ib_id
    })
    updateTags()
    toast.success(data.success_message)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

// Delete tag
const deleteTag = async (imageId, tagId) => {
  if (!confirm('Are you sure you want to delete this tag?')) return
  try {
    const data = await modHandlers.deleteimagetag(imageId, tagId)
    updateTags()
    toast.success(data.success_message)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

// Add favorite
const addFavorite = async () => {
  try {
    const data = await userHandlers.addfavorite({ image: imageData.value.id })
    checkFavorite()
    toast.success(data.success_message)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

// Tag type class
const tagClass = (type) => {
  switch (Number(type)) {
    case 1: return 'tag-default'
    case 2: return 'tag-artist'
    case 3: return 'tag-character'
    case 4: return 'tag-copyright'
    default: return 'tag-default'
  }
}

// Keyboard shortcuts
const onKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  if (e.key === 'ArrowLeft' && imageData.value.prev) {
    router.push('/image/' + imageData.value.prev)
  } else if (e.key === 'ArrowRight' && imageData.value.next) {
    router.push('/image/' + imageData.value.next)
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="image">
    <div class="image_container">
      <div class="image_box">
        <div class="image_box_nav">
          <div class="image_controls">
            <ul class="pagination">
              <li v-if="imageData.prev">
                <router-link class="fa fa-arrow-left" :to="'/image/' + imageData.prev"></router-link>
              </li>
              <li v-if="auth.isAuthenticated">
                <a :class="starred ? 'fa fa-heart favorited' : 'fa fa-heart-o'" href="#" @click.prevent="addFavorite"></a>
              </li>
              <li>
                <router-link class="fa fa-list" :to="'/thread/' + imageData.thread + '/1'"></router-link>
              </li>
              <li v-if="imageData.next">
                <router-link class="fa fa-arrow-right" :to="'/image/' + imageData.next"></router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="image_box_image">
          <video v-if="ext === 'webm'" :src="getImgSrc(imageData.filename)" :height="imageData.height" :width="imageData.width" autoplay loop controls></video>
          <a v-else target="_self" :href="getImgSrc(imageData.filename)">
            <img :src="getImgSrc(imageData.filename)" :height="imageData.height" :width="imageData.width">
          </a>
        </div>
        <div class="image_box_nav">
          <div class="image_controls">
            <ul class="pagination">
              <li v-if="imageData.prev">
                <router-link class="fa fa-arrow-left" :to="'/image/' + imageData.prev"></router-link>
              </li>
              <li v-if="auth.isAuthenticated">
                <a :class="starred ? 'fa fa-heart favorited' : 'fa fa-heart-o'" href="#" @click.prevent="addFavorite"></a>
              </li>
              <li>
                <router-link class="fa fa-list" :to="'/thread/' + imageData.thread + '/1'"></router-link>
              </li>
              <li v-if="imageData.next">
                <router-link class="fa fa-arrow-right" :to="'/image/' + imageData.next"></router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="image_info">
        <div class="source_links">
          <a class="tag tag-source" target="_blank" :href="'https://saucenao.com/search.php?url=' + encodeURIComponent(getImgSrc(imageData.filename))">SauceNao</a>
          <a class="tag tag-source" target="_blank" :href="'https://iqdb.org/?url=' + encodeURIComponent(getImgSrc(imageData.filename))">iqdb</a>
          <a class="tag tag-source" target="_blank" :href="'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(getImgSrc(imageData.filename)) + '&safe=off'">Google</a>
        </div>
        <div class="tag_input">
          <form @submit.prevent="addTag">
            <input type="text" class="form-control" placeholder="Add Tag" list="tag-suggestions" @input="searchTags($event.target.value)">
            <datalist id="tag-suggestions">
              <option v-for="tag in tagList" :key="tag.id" :value="tag.id">{{ tag.tag }}</option>
            </datalist>
            <button class="button button-block button-primary" type="submit">Add</button>
          </form>
        </div>
        <div v-if="!tags || tags.length === 0" class="no_tags">
          No tags <i class="fa fa-frown-o"></i>
        </div>
        <div v-if="tags && tags.length > 0">
          <div v-for="tag in tags" :key="tag.id" class="tags">
            <div v-if="auth.showModControls" class="mod_button">
              <a class="delete_button fa fa-times" title="Delete Tag" href="#" @click.prevent="deleteTag(imageData.id, tag.id)"></a>
            </div>
            <div class="tag_button">
              <router-link class="tag" :class="tagClass(tag.type)" rel="nofollow" :to="'/tag/' + tag.id + '/1'">{{ tag.tag }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
