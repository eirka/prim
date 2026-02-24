import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/scss/prim.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'bottom-right',
  maxToasts: 5
})

// Restore auth state on startup
const auth = useAuthStore()
auth.setAuthState()

app.mount('#app')
