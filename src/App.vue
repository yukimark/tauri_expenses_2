<script setup lang="ts">
import 'normalize.css'
import { ref, onMounted } from 'vue'
import Drawer from './components/drawer.vue'
import { useDatabaseStore } from './stores/databaseStore'
import { useCategoryStore } from './stores/categoryStore'

const databaseStore = useDatabaseStore()
const categoryStore = useCategoryStore()

const isReady = ref<boolean>(false)

onMounted(async () => {
  await databaseStore.loadDatabase()
  await categoryStore.set(await databaseStore.getCategoryAll())
  isReady.value = true
})
</script>

<template>
  <div class="container">
    <Drawer />
    <router-view v-if="isReady" />
  </div>
</template>

<style>
body {
  width: 1000px;
  height: 100%;

  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: white;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

html {
  height: 100%;
}

#app {
  height: inherit;
}

.container {
  margin: 0;
  width: 1000px;
  height: inherit;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #da0202;
}

h1 {
  text-align: center;
  margin: 0;
  font-size: 28px;
  font-weight: 500;
}

input {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
  background-color: white;
  border: none;
  width: inherit;
  height: inherit;
}

button:hover {
  background-color: #c9c9c9;
  border-radius: 50%;
}

input,
button {
  outline: none;
}

p {
  margin: 0;
}

.title {
  padding-top: 20px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
