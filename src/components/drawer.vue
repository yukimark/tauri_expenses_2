<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import CoverBackground from '../parts/coverBackground.vue';

const drawerFlag = ref<boolean>(false);

function toggleDrawerMenu(): void {
  drawerFlag.value = !drawerFlag.value;
}
</script>

<template>
  <div class="drawer-toggle-button">
    <button @click="toggleDrawerMenu">
      <i class="fa-solid fa-bars fa-2xl"></i>
    </button>
  </div>
  <div v-if="drawerFlag" class="drawer-menu">
    <div @click="toggleDrawerMenu">
      <RouterLink to="/">ホーム</RouterLink>
    </div>
    <div @click="toggleDrawerMenu">
      <RouterLink to="/spend">お小遣い帳</RouterLink>
    </div>
    <div @click="toggleDrawerMenu">
      <RouterLink to="/config">設定</RouterLink>
    </div>
  </div>
  <CoverBackground v-if="drawerFlag" @click="toggleDrawerMenu" />
</template>

<style scoped>
.drawer-toggle-button {
  width: 45px;
  height: 45px;
  line-height: 45px;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 20;
  pointer-events: auto;
}

.drawer-toggle-button:hover {
  background-color: #c9c9c9;
  border-radius: 50%;
}

.drawer-menu {
  width: 250px;
  border: none;
  border-right: solid 1px rgb(161 161 161);
  background-color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: auto;
  padding-top: 60px;
}

.drawer-menu div {
  height: 60px;
  line-height: 60px;
}

.drawer-menu div a {
  font-size: 22px;
  font-weight: bold;
  color: rgb(48 48 48);
  width: inherit;
  height: inherit;
  display: block;
}

.drawer-menu div a:hover {
  color: rgb(241 11 11);
}
</style>
