import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetUpdateProfile } from '../types.ts'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<GetUpdateProfile[]>([])

  const set = async (params: GetUpdateProfile[]) => {
    profile.value = params
  }

  return { profile, set }
})
