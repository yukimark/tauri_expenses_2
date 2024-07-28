<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsg.value = await invoke("greet", { name: name.value });
}

import Database from '@tauri-apps/plugin-sql';

onMounted(async () => {
  try {
    const db = await Database.load('sqlite:expense.db');
    console.log(db);
    console.log('success');
  } catch (error) {
    console.error('Error');
  }
})
// const db = await Database.load('sqlite:expenses.db');
// const result = await db.execute(
//   "INSERT into spends (category_id, price, fixed_cost, deferred_pay, memo) VALUES ($1, $2, $3, $4, $5)",
//   [1, 123, 1, 1, ""],
// );
// console.log(result);
</script>

<template>
  <form class="row" @submit.prevent="greet">
    <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    <button type="submit">Greet</button>
  </form>

  <p>{{ greetMsg }}</p>
</template>
