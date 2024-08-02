// stores/databaseStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Database from '@tauri-apps/plugin-sql'

export const useDatabaseStore = defineStore('database', () => {
  const db = ref<Database | null>(null)

  const loadDatabase = async () => {
    try {
      db.value = await Database.load('sqlite:expenses.db')
      console.log('Database connected')
    } catch (error) {
      console.error('Database connection error', error)
    }
  }

  const executeQuery = async (query: string, params?: any[]) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.execute(query, params)
  }

  const selectQuery = async (query: string, params?: any[]) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.select(query, params)
  }

  const getSpendsYearMonth = async (yearMonth: string) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.select(
      `
        SELECT spends.date, categories.category, spends.price, spends.fixed_cost, spends.deferred_pay, spends.memo
        FROM spends
        LEFT JOIN categories ON spends.category_id = categories.id
        WHERE spends.date LIKE ?
        order by spends.created_at desc;
      `,
      [`${yearMonth}%`],
    )
  }

  return { db, loadDatabase, executeQuery, selectQuery, getSpendsYearMonth }
})
