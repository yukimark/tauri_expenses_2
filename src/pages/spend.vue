<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useDatabaseStore } from '../stores/databaseStore';
  import { Category, Categories, Spend } from '../types.ts';

  let today: Date = new Date();
  let formattedDate =`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const databaseStore = useDatabaseStore();
  const categoryAll = ref<Category[]>([]);
  const inputDate = ref<String>(formattedDate);

  
  onMounted(async () => {
    try {
      const result: Categories<Category> = await databaseStore.selectQuery('SELECT id, category FROM categories order by id asc;');
      categoryAll.value = result;
      console.log(categoryAll.value);
    } catch (error) {
      console.error('Query error', error);
    }
  })
</script>

<template>
  <div class="title"><h1>お小遣い帳</h1></div>
  <form>
    <div>
      <div class="input-date">
        <VueDatePicker
          v-model="inputDate"
          format="yyyy/MM/dd"
          model-type="yyyy-MM-dd"
          locale="ja"
          week-start="0"
          :enable-time-picker="false"
          auto-apply
          :month-change-on-scroll="false"
          required
          :max-date="new Date()"
          />
        {{ inputDate }}
      </div>
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

  .input-date {
    width: 200px;
  }
</style>
