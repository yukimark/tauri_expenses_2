<script setup lang="ts">
import { ref } from 'vue';
import { UpdateDeleteCategory } from '../../types';
import { useDatabaseStore } from '../../stores/databaseStore';
import { useCategoryStore } from '../../stores/categoryStore';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();

const emit = defineEmits<{
  (e: 'modal-params', payload: { cssClass: string; message: string }): void;
}>();

const formDataUpdateDeleteCategory = ref<UpdateDeleteCategory>({
  id: null,
  category: '',
  spend_target_value: 0,
  initial_flag: true,
});

const usedCategory = ref<boolean>(true);

const sendModalParams = (cssClass: string, message: string): void => {
  emit('modal-params', { cssClass, message });
};

/** 選択したcategoryに合わせてformを表示する */
const formDisplaySetParams = async (): Promise<void> => {
  const result = categoryStore.category.find((item) => item.id === formDataUpdateDeleteCategory.value.id)!;
  const data = await databaseStore.usedCategory(result.id);
  usedCategory.value = data[0].exists_flag === 1;
  formDataUpdateDeleteCategory.value = {
    id: result.id,
    category: result.category,
    spend_target_value: result.spend_target_value,
    initial_flag: result.initial_flag,
  };
};

const submitFormUpdateCategory = async (): Promise<void> => {
  const value = formDataUpdateDeleteCategory.value;
  try {
    await databaseStore.updateCategory([value.category, value.spend_target_value, value.id!]);
    await categoryStore.set(await databaseStore.getCategoryAll());
    sendModalParams('success', '項目の更新に成功しました。');
  } catch (error) {
    console.error(error);
    sendModalParams('error', '項目の更新に失敗しました。');
  }
  formDataUpdateDeleteCategory.value = {
    id: null,
    category: '',
    spend_target_value: 0,
    initial_flag: true,
  };
};

const submitFormDeleteCategory = async (): Promise<void> => {
  const value = formDataUpdateDeleteCategory.value;
  try {
    await databaseStore.deleteCategory(value.id!);
    await categoryStore.set(await databaseStore.getCategoryAll());
    sendModalParams('success', '項目の削除に成功しました。');
  } catch (error) {
    console.error(error);
    sendModalParams('error', '項目の削除に失敗しました。');
  }
  formDataUpdateDeleteCategory.value = {
    id: null,
    category: '',
    spend_target_value: 0,
    initial_flag: true,
  };
};
</script>

<template>
  <form class="mt-10">
    <div class="form-row mb-20">
      <div class="form-contents">
        <label for="input-category">項目</label>
        <select id="input-category" v-model="formDataUpdateDeleteCategory.id" required @change="formDisplaySetParams">
          <option v-for="category in categoryStore.category" :key="category.id" :value="category.id">
            {{ category.category }}
          </option>
        </select>
      </div>
      <div v-if="formDataUpdateDeleteCategory.id" style="display: flex">
        <div v-if="!formDataUpdateDeleteCategory.initial_flag && !usedCategory" class="form-contents">
          <label for="input-category">項目</label>
          <input id="input-category" v-model="formDataUpdateDeleteCategory.category" type="text" />
        </div>
        <div v-else class="form-contents">
          <label for="input-category">項目</label>
          <input id="input-category" v-model="formDataUpdateDeleteCategory.category" type="text" readonly class="read-only" />
        </div>
        <div class="form-contents">
          <label for="input-spend-target-value">目標値</label>
          <input id="input-spend-target-value" v-model="formDataUpdateDeleteCategory.spend_target_value" type="number" />
        </div>
        <button type="button" @click="submitFormUpdateCategory" class="ml-20">更新</button>
        <button v-if="!formDataUpdateDeleteCategory.initial_flag && !usedCategory" type="button" @click="submitFormDeleteCategory" class="ml-20">
          削除
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.read-only {
  background-color: rgb(223 222 222);
}
</style>
