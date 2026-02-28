<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBoardStore } from '@/stores/board';
import { usergroupClass } from '@/composables/useUtils';
import handlers from '@/api/handlers';
import config from '@/config';
import type { Imageboard } from '@/types';
import DiscordWidget from './DiscordWidget.vue';

const route = useRoute();
const auth = useAuthStore();
const board = useBoardStore();

const menuVisible = ref(false);
const userMenuVisible = ref(false);
const imageboards = ref<Imageboard[]>([]);

handlers
  .imageboards()
  .then((data) => {
    imageboards.value = data.imageboards
      .filter((ib) => ib.id !== config.ib_id)
      .map((ib) => ({ ...ib, url: ib.url.replace(/^(https?:)?\/\//, '') }));
  })
  .catch(() => {
    /* silently leave imageboards empty */
  });


const isActive = (path: string) => route.path.split('/')[1] === path;
</script>

<template>
  <header class="header">
    <div class="header_bar">
      <div class="left">
        <div class="nav_menu">
          <ul @mouseenter="menuVisible = true" @mouseleave="menuVisible = false">
            <li>
              <a href="#"><i class="fa fa-fw fa-bars"></i></a>
              <ul v-if="menuVisible">
                <li v-for="ib in imageboards" :key="ib.id">
                  <a :href="'//' + ib.url">{{ ib.title }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="nav_items">
          <ul>
            <li>
              <router-link :class="{ active: isActive('directory') }" to="/directory"
                >Threads</router-link
              >
            </li>
            <li>
              <router-link :class="{ active: isActive('trending') }" to="/trending"
                >Popular</router-link
              >
            </li>
            <li>
              <router-link :class="{ active: isActive('tags') }" to="/tags">Tags</router-link>
            </li>
            <DiscordWidget />
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="user_menu">
          <div v-if="!auth.isAuthenticated" class="login">
            <router-link to="/account" class="button-login">Sign in</router-link>
          </div>
          <div v-else>
            <ul @mouseenter="userMenuVisible = true" @mouseleave="userMenuVisible = false">
              <li>
                <div class="avatar avatar-medium">
                  <div class="avatar-inner">
                    <a href="#"><img :src="auth.avatar ?? ''" /></a>
                  </div>
                </div>
                <ul v-if="userMenuVisible">
                  <li>
                    <div class="username">
                      <span :class="usergroupClass(board.group)">{{ auth.name }}</span>
                    </div>
                  </li>
                  <li class="divider"></li>
                  <li>
                    <router-link to="/favorites"
                      ><i style="color: #d67474" class="fa fa-heart"></i>Favorites</router-link
                    >
                  </li>
                  <li class="divider"></li>
                  <li v-if="auth.showModControls">
                    <router-link to="/admin"><i class="fa fa-key"></i>Admin</router-link>
                  </li>
                  <li>
                    <router-link to="/account"><i class="fa fa-cog"></i>Settings</router-link>
                  </li>
                  <li>
                    <a href="#" @click.prevent="auth.logOut()"
                      ><i class="fa fa-plug"></i>Sign out</a
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="site_logo">
          <router-link to="/">Prim</router-link>
        </div>
      </div>
    </div>
  </header>
</template>
