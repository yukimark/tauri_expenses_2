// stores/databaseStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import Database from '@tauri-apps/plugin-sql';
import { GetCategory, GetSpend, GetUpdateProfile } from '../types.ts';

export const useDatabaseStore = defineStore('database', () => {
  const db = ref<Database | null>(null);

  const loadDatabase = async (): Promise<void> => {
    try {
      db.value = await Database.load('sqlite:expenses.db');
      await db.value.execute('PRAGMA foreign_keys = true;');
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error', error);
    }
  };

  const getSpendsYearMonth = async (yearMonth: string): Promise<GetSpend[]> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.select(
      `
        SELECT spends.id, spends.date, categories.category, spends.price, spends.fixed_cost, spends.deferred_pay, spends.memo
        FROM spends
        LEFT JOIN categories ON spends.category_id = categories.id
        WHERE spends.date LIKE ?
        ORDER BY spends.created_at DESC;
      `,
      [`${yearMonth}%`],
    );
  };

  const createSpend = async (
    params: [date: string, category_id: number | null, price: number | null, fixed_cost: boolean, deferred_pay: boolean, memo: string],
  ): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    db.value.execute('INSERT INTO spends (date, category_id, price, fixed_cost, deferred_pay, memo) VALUES ($1, $2, $3, $4, $5, $6);', params);
  };

  const deleteSpendsMatchId = async (params: number[]): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    const idsString = params.join(',');
    db.value.execute(`BEGIN TRANSACTION; DELETE FROM spends WHERE id IN (${idsString}); COMMIT;`);
  };

  const getCategoryAll = async (): Promise<GetCategory[]> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.select('SELECT id, category, initial_flag, spend_target_value FROM categories ORDER BY id ASC;');
  };

  const createCategory = async (params: [category: string, spend_target_value: number]): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    params.push(0);
    db.value.execute('INSERT INTO categories (category, spend_target_value, initial_flag) VALUES ($1, $2, $3);', params);
  };

  const usedCategory = async (id: number): Promise<[{ exists_flag: number }]> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.select(`SELECT EXISTS (SELECT 1 FROM spends WHERE category_id == ${id}) AS exists_flag;`);
  };

  const updateCategory = async (params: [category: string, spend_target_value: number, id: number]): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    db.value.execute(
      `
      UPDATE categories
      SET category = ?, spend_target_value = ?
      WHERE id = ?;
      `,
      params,
    );
  };

  const deleteCategory = async (id: number): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    db.value.execute(`BEGIN TRANSACTION; DELETE FROM categories WHERE id = ${id}; COMMIT;`);
  };

  const getProfile = async (): Promise<GetUpdateProfile[]> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.select('SELECT target_value_total_price, target_value_fixed_cost, target_value_deferred_pay FROM profiles WHERE id = 1;');
  };

  const updateProfile = async (
    params: [target_value_total_price: number, target_value_fixed_cost: number, target_value_deferred_pay: number],
  ): Promise<void> => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    db.value.execute(
      `
      UPDATE profiles
      SET target_value_total_price = ?, target_value_fixed_cost = ?, target_value_deferred_pay = ?
      WHERE id = 1;
      `,
      params,
    );
  };

  return {
    db,
    loadDatabase,
    getSpendsYearMonth,
    getCategoryAll,
    createSpend,
    deleteSpendsMatchId,
    createCategory,
    usedCategory,
    updateCategory,
    deleteCategory,
    getProfile,
    updateProfile,
  };
});
