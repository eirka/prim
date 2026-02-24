import { defineStore } from 'pinia'
import { ref } from 'vue'
import config from '@/config'

const IB_CACHE_KEY = `ib${config.ib_id}.data`

export const useBoardStore = defineStore('board', () => {
  const group = ref(1)

  const set = (g) => {
    group.value = g
  }

  const setDefault = () => {
    set(1)
  }

  const saveCache = () => {
    try {
      localStorage.setItem(IB_CACHE_KEY, JSON.stringify({ group: group.value }))
    } catch (e) { /* ignore */ }
  }

  const getCache = () => {
    try {
      const cached = localStorage.getItem(IB_CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (e) {
      return null
    }
  }

  return { group, set, setDefault, saveCache, getCache }
})
