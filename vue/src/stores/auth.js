import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import handlers from '@/api/handlers'
import userHandlers from '@/api/userHandlers'
import { useBoardStore } from './board'
import { useToast } from 'vue-toastification'
import { getAvatar } from '@/composables/useUtils'

const CACHE_KEY = 'global.cache'

export const useAuthStore = defineStore('auth', () => {
  const id = ref(1)
  const name = ref('Anonymous')
  const isAuthenticated = ref(false)
  const avatar = ref(null)
  const lastactive = ref(new Date())

  const set = (uid, uname, auth, uavatar, ulast) => {
    id.value = uid
    name.value = uname
    isAuthenticated.value = auth
    avatar.value = uavatar
    lastactive.value = ulast
  }

  const setDefault = () => {
    set(1, 'Anonymous', false, null, new Date())
  }

  const saveCache = () => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        id: id.value,
        name: name.value,
        isAuthenticated: isAuthenticated.value,
        avatar: avatar.value,
        lastactive: lastactive.value
      }))
    } catch (e) { /* ignore */ }
  }

  const getCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (e) {
      return null
    }
  }

  const destroySession = () => {
    localStorage.clear()
    setDefault()
    const board = useBoardStore()
    board.setDefault()
  }

  const setAuthState = async () => {
    const board = useBoardStore()
    const cas = getCache()
    const cib = board.getCache()

    if (cas && cib) {
      set(cas.id, cas.name, cas.isAuthenticated, cas.avatar, cas.lastactive)
      board.set(cib.group)
    } else {
      setDefault()
      board.setDefault()
    }

    try {
      const data = await handlers.whoami()
      const ss = data.user

      if (cas && !ss.authenticated) {
        destroySession()
        return
      }

      if (ss.authenticated) {
        set(ss.id, ss.name, true, getAvatar(ss.id), new Date(ss.last_active))
        saveCache()
        board.set(ss.group)
        board.saveCache()
      }
    } catch {
      destroySession()
    }
  }

  const logOut = async () => {
    try {
      await userHandlers.logout()
    } catch { /* ignore */ }
    destroySession()
    const toast = useToast()
    toast.success('Logged Out')
  }

  const showModControls = computed(() => {
    if (!isAuthenticated.value) return false
    const board = useBoardStore()
    return board.group === 3 || board.group === 4
  })

  const getLastActive = (date) => {
    if (!date) return false
    const d = new Date(date)
    return !isNaN(d.getTime()) && lastactive.value < d
  }

  return {
    id, name, isAuthenticated, avatar, lastactive,
    set, setDefault, destroySession, setAuthState, logOut,
    showModControls, getLastActive, saveCache
  }
})
