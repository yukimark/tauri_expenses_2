<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useDatabaseStore } from '../stores/databaseStore';

  const databaseStore = useDatabaseStore();
  const data = ref<any>(null);

  onMounted(async () => {
    try {
      data.value = await databaseStore.selectQuery('SELECT * FROM categories;');
      console.log(data.value);
    } catch (error) {
      console.error('Query error', error);
    }
  })
</script>

<template>
  <div class="title"><h1>お小遣い帳</h1></div>
  <form>
    <div>

    </div>
  </form>
</template>

<style scoped>
  h1 {
    font-size: 30px;
    font-weight: 500;
  }

  .title {
    padding-top: 20px;
  }
</style>
