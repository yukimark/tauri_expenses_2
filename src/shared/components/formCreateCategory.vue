<script setup lang="ts">
import { ref } from 'vue';
import { CreateCategory } from '../../types';
import { useDatabaseStore } from '../../stores/databaseStore';
import { useCategoryStore } from '../../stores/categoryStore';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();

const emit = defineEmits<{
  (e: 'modal-params', payload: { cssClass: string; message: string }): void;
}>();

const formDataCreateCategory = ref<CreateCategory>({
  category: '',
  spend_target_value: 0,
});

const sendModalParams = (cssClass: string, message: string): void => {
  emit('modal-params', { cssClass, message });
};

const submitFormCreateCategory = async (): Promise<void> => {
  const value = formDataCreateCategory.value;
  try {
    await databaseStore.createCategory([value.category, value.spend_target_value]);
    await categoryStore.set(await databaseStore.getCategoryAll());
    sendModalParams('success', '項目の登録に成功しました。');
  } catch (error) {
    console.error(error);
    sendModalParams('error', '項目の登録に失敗しました。');
  }
  formDataCreateCategory.value = {
    category: '',
    spend_target_value: 0,
  };
};
</script>

<template>
  <form class="mt-10" @submit.prevent="submitFormCreateCategory">
    <div class="form-row mb-20">
      <div class="form-contents">
        <label for="input-category">項目</label>
        <input id="input-category" v-model="formDataCreateCategory.category" type="text" required />
      </div>
      <div class="form-contents">
        <label for="input-spend-target-value">目標値</label>
        <input id="input-spend-target-value" v-model="formDataCreateCategory.spend_target_value" type="number" required />
      </div>
      <button class="ml-20">save</button>
    </div>
  </form>
</template>
