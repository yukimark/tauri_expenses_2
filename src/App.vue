<script setup lang="ts">
import 'normalize.css';
import { ref, onMounted } from 'vue';
import Drawer from './shared/components/drawer.vue';
import { useDatabaseStore } from './stores/databaseStore';
import { useCategoryStore } from './stores/categoryStore';
import { useProfileStore } from './stores/profileStore';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();
const profileStore = useProfileStore();

const isReady = ref<boolean>(false);

onMounted(async () => {
  await databaseStore.loadDatabase();
  await categoryStore.set(await databaseStore.getCategoryAll());
  await profileStore.set(await databaseStore.getProfile());
  isReady.value = true;
});
</script>

<template>
  <div class="container">
    <Drawer />
    <router-view v-if="isReady" />
  </div>
</template>

<style scoped>
.container {
  margin: 0;
  width: 1000px;
  height: inherit;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
}
</style>
