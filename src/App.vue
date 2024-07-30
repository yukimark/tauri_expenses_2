<script setup lang="ts">
  import 'normalize.css';
  import { onMounted, ref } from "vue";
  import Database from '@tauri-apps/plugin-sql';
  import Drawer from "./components/drawer.vue";

  onMounted(async () => {
    try {
      await Database.load('sqlite:expense.db');
      console.log('db connect success');
    } catch (error) {
      console.error('db connect error');
    }
  })

  const drawerState = ref<boolean>(false);
  const drawerStatus = (isOpen: boolean) => {
    drawerState.value = isOpen;
  }
</script>

<template>
  <div class="container" :class="{ draweropen: drawerState.valueOf() }">
    <Drawer @drawer-status="drawerStatus"/>
    <router-view />
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
    /* padding-top: 2vh; */
    width: 1000px;
    height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: relative;
  }

  .draweropen {
    background-color: rgb(85, 85, 85);
    pointer-events: none;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }

  a:hover {
    color: #535bf2;
  }

  h1 {
    text-align: center;
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
