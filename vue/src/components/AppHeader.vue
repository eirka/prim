<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { usergroupClass } from '@/composables/useUtils'
import DiscordWidget from './DiscordWidget.vue'

const route = useRoute()
const auth = useAuthStore()
const board = useBoardStore()

const menuVisible = ref(false)
const userMenuVisible = ref(false)

const toggleMenu = () => { menuVisible.value = !menuVisible.value }
const toggleUserMenu = () => { userMenuVisible.value = !userMenuVisible.value }

const isActive = (path) => route.path.split('/')[1] === path

const handleClickOutside = (event, el) => {
  if (el && !el.contains(event.target)) return true
  return false
}
</script>

<template>
  <header class="header">
    <div class="header_box">
      <div class="header_left">
        <router-link to="/" class="header_logo">Prim</router-link>
        <button class="header_toggle fa fa-bars" @click="toggleMenu"></button>
      </div>
      <nav class="header_nav" :class="{ visible: menuVisible }">
        <ul class="nav_items">
          <li><router-link :class="{ active: isActive('directory') }" to="/directory">Threads</router-link></li>
          <li><router-link :class="{ active: isActive('trending') }" to="/trending">Popular</router-link></li>
          <li><router-link :class="{ active: isActive('tags') }" to="/tags">Tags</router-link></li>
          <DiscordWidget />
        </ul>
      </nav>
      <div class="header_right">
        <div v-if="auth.isAuthenticated" class="user_menu_container">
          <button class="user_menu_toggle" @click="toggleUserMenu">
            <span :class="usergroupClass(board.group)">{{ auth.name }}</span>
          </button>
          <ul v-if="userMenuVisible" class="user_menu dropdown-menu">
            <li>
              <div class="username">
                <span :class="usergroupClass(board.group)">{{ auth.name }}</span>
              </div>
            </li>
            <li class="divider"></li>
            <li><router-link to="/favorites"><i style="color:#D67474;" class="fa fa-heart"></i>Favorites</router-link></li>
            <li class="divider"></li>
            <li v-if="auth.showModControls"><router-link to="/admin"><i class="fa fa-key"></i>Admin</router-link></li>
            <li><router-link to="/account"><i class="fa fa-cog"></i>Settings</router-link></li>
            <li><a href="#" @click.prevent="auth.logOut()"><i class="fa fa-plug"></i>Sign out</a></li>
          </ul>
        </div>
        <router-link v-else to="/account" class="button button-primary">Sign in</router-link>
      </div>
    </div>
  </header>
</template>
