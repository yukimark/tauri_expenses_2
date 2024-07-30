// stores/databaseStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import Database from '@tauri-apps/plugin-sql';

export const useDatabaseStore = defineStore('database', () => {
  const db = ref<Database | null>(null);

  const loadDatabase = async () => {
    try {
      db.value = await Database.load('sqlite:expenses.db');
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error', error);
    }
  };

  const executeQuery = async (query: string, params?: any[]) => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.execute(query, params);
  };

  const selectQuery = async (query: string) => {
    if (!db.value) {
      throw new Error('Database is not connected');
    }
    return db.value.select(query);
  }



  return { db, loadDatabase, executeQuery, selectQuery };
});
