import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetProfile } from '../types.ts'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<GetProfile[]>([])

  const set = async (params: GetProfile[]) => {
    profile.value = params
  }

  return { profile, set }
})
