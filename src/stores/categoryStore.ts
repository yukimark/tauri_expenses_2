import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetCategory } from '../types.ts'

export const useCategoryStore = defineStore('category', () => {
  const category = ref<GetCategory[]>([])

  const set = async (params: GetCategory[]): Promise<void> => {
    category.value = params
  }

  return { category, set }
})
