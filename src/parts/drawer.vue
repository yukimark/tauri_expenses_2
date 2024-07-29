<script setup lang="ts">
  import { ref } from "vue";

  const drawerFlag = ref<boolean>(false);

  function toggleDrawerMenu() {
    drawerFlag.value = !drawerFlag.value;
  }

  
</script>

<template>
  <div class="drawer-open-button">
    <!-- メニュー3本線 -->
    <button @click="toggleDrawerMenu"><i class="fa-solid fa-bars fa-2xl"></i></button>
  </div>
  <div class="drawer-menu" v-if="drawerFlag">
    <div>

    </div>
    <!-- メニュー閉じる -->
    <div>
      <button><i class="fa-solid fa-chevron-left fa-xl"></i></button>
    </div>
  </div>
</template>

<style scoped>
  button {
    background-color: white;
    border: none;
    width: inherit;
    height: inherit;
  }

  button:hover {
    background-color: #c9c9c9;
    border-radius: 50%;
  }

  .drawer-open-button {
    width: 45px;
    height: 45px;
    line-height: 45px;
  }

  .drawer-open-button:hover {
    background-color: #c9c9c9;
    border-radius: 50%;
  }
</style>
