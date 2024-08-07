// stores/databaseStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Database from '@tauri-apps/plugin-sql'
import { GetCategory, GetSpend } from '../types.ts'

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

  const getSpendsYearMonth = async (yearMonth: string): Promise<GetSpend[]> => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.select(
      `
        SELECT spends.id, spends.date, categories.category, spends.price, spends.fixed_cost, spends.deferred_pay, spends.memo
        FROM spends
        LEFT JOIN categories ON spends.category_id = categories.id
        WHERE spends.date LIKE ?
        order by spends.created_at desc;
      `,
      [`${yearMonth}%`],
    )
  }

  const createSpend = async (
    params: [date: string, category_id: number | null, price: number | null, fixed_cost: boolean, deferred_pay: boolean, memo: string],
  ) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    db.value.execute('INSERT into spends (date, category_id, price, fixed_cost, deferred_pay, memo) VALUES ($1, $2, $3, $4, $5, $6)', params)
  }

  const deleteSpendsMatchId = async (params: number[]) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    const idsString = params.join(',')
    db.value.execute(`BEGIN TRANSACTION; DELETE FROM spends WHERE id IN (${idsString}); COMMIT;`)
  }

  const getCategoryAll = async (): Promise<GetCategory[]> => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.select('SELECT id, category, initial_flag, spend_target_value FROM categories order by id asc;')
  }

  const createCategory = async (params: [category: string, spend_target_value: number]) => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    params.push(0)
    db.value.execute('INSERT into categories (category, spend_target_value, initial_flag) VALUES ($1, $2, $3)', params)
  }

  const usedCategory = async (id: number): Promise<[{exists_flag: number}]> => {
    if (!db.value) {
      throw new Error('Database is not connected')
    }
    return db.value.select(`SELECT EXISTS (SELECT 1 FROM spends WHERE category_id == ${id}) AS exists_flag;`)
  }

  return { db, loadDatabase, executeQuery, selectQuery, getSpendsYearMonth, getCategoryAll, createSpend, deleteSpendsMatchId, createCategory, usedCategory }
})
