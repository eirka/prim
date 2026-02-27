<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { getAvatar, getFormAction } from '@/composables/useUtils';
import config from '@/config';
import handlers from '@/api/handlers';
import userHandlers from '@/api/userHandlers';
import { getErrorMessage } from '@/types';

const auth = useAuthStore();
const toast = useToast();

// Login form
const loginForm = ref({ name: '', password: '' });
const logIn = async () => {
  try {
    const data = await userHandlers.login({
      ib: config.ib_id,
      name: loginForm.value.name,
      password: loginForm.value.password,
    });
    auth.destroySession();
    await auth.setAuthState();
    toast.success(data.success_message);
    loginForm.value = { name: '', password: '' };
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Register form
const registerForm = ref({ name: '', password: '', check_password: '', email: '' });
const newUser = async () => {
  try {
    const data = await userHandlers.register({
      ib: config.ib_id,
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
    });
    toast.success(data.success_message);
    registerForm.value = { name: '', password: '', check_password: '', email: '' };
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

// Account settings
interface WhoamiDisplay {
  id: number;
  name: string;
  group: number;
  avatar: string;
  email: string;
}

const activePanel = ref('Account');
const whoami = ref<WhoamiDisplay | null>(null);
const passwordForm = ref({ oldpassword: '', newpassword: '' });
const emailForm = ref({ email: '' });

// Fetch whoami if authenticated
if (auth.isAuthenticated) {
  handlers
    .whoami()
    .then((data) => {
      if (!data.user.authenticated) {
        auth.destroySession();
        return;
      }
      whoami.value = {
        id: data.user.id,
        name: data.user.name,
        group: data.user.group,
        avatar: getAvatar(data.user.id),
        email: data.user.email || 'No Email Set',
      };
    })
    .catch(() => {});
}

const changePassword = async () => {
  try {
    const data = await userHandlers.password({
      ib: config.ib_id,
      oldpw: passwordForm.value.oldpassword,
      newpw: passwordForm.value.newpassword,
    });
    toast.success(data.success_message);
    passwordForm.value = { oldpassword: '', newpassword: '' };
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const updateEmail = async () => {
  try {
    const data = await userHandlers.email({
      ib: config.ib_id,
      email: emailForm.value.email,
    });
    toast.success(data.success_message);
    emailForm.value = { email: '' };
    // Refresh whoami
    const refreshed = await handlers.whoami();
    if (refreshed.user.authenticated && whoami.value) {
      whoami.value.email = refreshed.user.email || 'No Email Set';
    }
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};
</script>

<template>
  <!-- Login/Register (not authenticated) -->
  <div v-if="!auth.isAuthenticated" class="account">
    <div class="account_row">
      <div class="account_subcontainer left">
        <div class="account_title">Sign in</div>
        <form role="form" @submit.prevent="logIn">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Name"
              required
              v-model="loginForm.name"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              required
              v-model="loginForm.password"
            />
          </div>
          <div class="form-group">
            <button class="button button-primary button-block" type="submit">Sign in</button>
          </div>
        </form>
      </div>
      <div class="account_subcontainer right">
        <div class="account_title">Register</div>
        <form role="form" @submit.prevent="newUser">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Name"
              required
              minlength="3"
              maxlength="20"
              v-model="registerForm.name"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              required
              minlength="8"
              v-model="registerForm.password"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              placeholder="Password (retype)"
              required
              minlength="8"
              v-model="registerForm.check_password"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Email (optional)"
              v-model="registerForm.email"
            />
          </div>
          <div class="form-group">
            <button
              class="button button-success button-block"
              type="submit"
              :disabled="registerForm.password !== registerForm.check_password"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Account settings (authenticated) -->
  <div v-if="auth.isAuthenticated" class="account">
    <div v-if="whoami" class="account_header">
      <div class="user_info">
        <div v-if="whoami.avatar" class="user_avatar">
          <div class="avatar avatar-medium">
            <div class="avatar-inner">
              <img :src="whoami.avatar" />
            </div>
          </div>
        </div>
        <div class="user_name">
          <span>{{ whoami.name }}</span>
        </div>
      </div>
      <div class="logout">
        <a class="button button-primary" href="#" @click.prevent="auth.logOut()">Sign out</a>
      </div>
    </div>

    <div class="settings_container">
      <div class="settings_menu">
        <button
          class="button button-block button-primary"
          :class="{ active: activePanel === 'Account' }"
          @click="activePanel = 'Account'"
        >
          Account
        </button>
        <button
          class="button button-block button-primary"
          :class="{ active: activePanel === 'Avatar' }"
          @click="activePanel = 'Avatar'"
        >
          Avatar
        </button>
      </div>
      <div class="settings_box">
        <!-- Account panel -->
        <div v-if="activePanel === 'Account'">
          <div v-if="whoami" class="settings_panel">
            <div class="settings_info">
              <div class="info_row">
                <span class="info_label">Email:</span>
                <span>{{ whoami.email }}</span>
              </div>
            </div>
            <div class="settings_form">
              <h4>Change Password</h4>
              <form @submit.prevent="changePassword">
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Old Password"
                    required
                    v-model="passwordForm.oldpassword"
                  />
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="New Password"
                    required
                    minlength="8"
                    v-model="passwordForm.newpassword"
                  />
                </div>
                <div class="form-group">
                  <button class="button button-primary button-block" type="submit">
                    Change Password
                  </button>
                </div>
              </form>
              <h4>Change Email</h4>
              <form @submit.prevent="updateEmail">
                <div class="form-group">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="New Email"
                    required
                    v-model="emailForm.email"
                  />
                </div>
                <div class="form-group">
                  <button class="button button-primary button-block" type="submit">
                    Update Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Avatar panel -->
        <div v-if="activePanel === 'Avatar'">
          <form
            :action="getFormAction('/post/user/avatar')"
            method="post"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="csrf_token" :value="config.csrf_token" />
            <div class="form-group">
              <input type="file" name="file" required />
            </div>
            <div class="form-group">
              <button class="button button-primary button-block" type="submit">
                Upload Avatar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
