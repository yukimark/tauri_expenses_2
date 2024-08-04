import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetCategory } from '../types.ts'

export const useCategoryStore = defineStore('category', () => {
  const category = ref<GetCategory[]>([])

  const set = (params: GetCategory[]) => {
    category.value = params
  }

  return { category, set }
})
