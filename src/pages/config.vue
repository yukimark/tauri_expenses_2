<script setup lang="ts">
import MultipleChoiceMenu from '../shared/components/multipleChoiceMenu.vue';
import { MultipleChoiceMenuParams, CreateCategory, ModalParams, UpdateDeleteCategory, GetUpdateProfile } from '../types';
import { ref } from 'vue';
import { useDatabaseStore } from '../stores/databaseStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useProfileStore } from '../stores/profileStore';
import Modal from '../shared/components/modal.vue';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();
const profileStore = useProfileStore();

const multipleChoiceMenuParams: MultipleChoiceMenuParams[] = [
  { id: 1, value: '項目の追加' },
  { id: 2, value: '項目の編集･削除' },
  { id: 3, value: '集計目標値の設定' },
];

const categoryMenuChoice = ref<number>(1);

const formDataCreateCategory = ref<CreateCategory>({
  category: '',
  spend_target_value: 0,
});

const formDataUpdateDeleteCategory = ref<UpdateDeleteCategory>({
  id: null,
  category: '',
  spend_target_value: 0,
  initial_flag: true,
});

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
});

const usedCategory = ref<boolean>(true);

const updateProfile = ref<GetUpdateProfile>({
  target_value_total_price: profileStore.profile[0].target_value_total_price,
  target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
  target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
});

const setModalParams = ({ cssClass, message }: { cssClass: string; message: string }) => {
  modalParams.value = {
    status: true,
    class: cssClass,
    message: message,
  };
};

const modalClose = (isOpen: boolean): void => {
  modalParams.value = {
    status: isOpen,
    class: '',
    message: '',
  };
};

const categoryMenuToggle = (index: number): void => {
  categoryMenuChoice.value = index;
  formDataCreateCategory.value = {
    category: '',
    spend_target_value: 0,
  };
  formDataUpdateDeleteCategory.value = {
    id: null,
    category: '',
    spend_target_value: 0,
    initial_flag: true,
  };
  updateProfile.value = {
    target_value_total_price: profileStore.profile[0].target_value_total_price,
    target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
    target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
  };
};

const submitFormCreateCategory = async (): Promise<void> => {
  const value = formDataCreateCategory.value;
  try {
    await databaseStore.createCategory([value.category, value.spend_target_value]);
    await categoryStore.set(await databaseStore.getCategoryAll());
    setModalParams({ cssClass: 'success', message: '項目の登録に成功しました。' });
  } catch (error) {
    console.error(error);
    setModalParams({ cssClass: 'error', message: '項目の登録に失敗しました。' });
  }
  formDataCreateCategory.value = {
    category: '',
    spend_target_value: 0,
  };
};

const submitFormUpdateCategory = async (): Promise<void> => {
  const value = formDataUpdateDeleteCategory.value;
  try {
    await databaseStore.updateCategory([value.category, value.spend_target_value, value.id!]);
    await categoryStore.set(await databaseStore.getCategoryAll());
    setModalParams({ cssClass: 'success', message: '項目の更新に成功しました。' });
  } catch (error) {
    console.error(error);
    setModalParams({ cssClass: 'error', message: '項目の更新に失敗しました。' });
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
    setModalParams({ cssClass: 'success', message: '項目の削除に成功しました。' });
  } catch (error) {
    console.error(error);
    setModalParams({ cssClass: 'error', message: '項目の削除に失敗しました。' });
  }
  formDataUpdateDeleteCategory.value = {
    id: null,
    category: '',
    spend_target_value: 0,
    initial_flag: true,
  };
};

const submitFormUpdateProfile = async (): Promise<void> => {
  const value = updateProfile.value;
  try {
    await databaseStore.updateProfile([value.target_value_total_price, value.target_value_fixed_cost, value.target_value_deferred_pay]);
    await profileStore.set(await databaseStore.getProfile());
    setModalParams({ cssClass: 'success', message: '集計目標値の更新に成功しました。' });
  } catch (error) {
    console.error(error);
    setModalParams({ cssClass: 'error', message: '集計目標値の更新に失敗しました。' });
  }
  updateProfile.value = {
    target_value_total_price: profileStore.profile[0].target_value_total_price,
    target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
    target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
  };
};

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
</script>

<template>
  <h1 class="title">設定</h1>
  <div><h2>項目の追加･編集･削除</h2></div>
  <div class="select-menu">
    <MultipleChoiceMenu :items="multipleChoiceMenuParams" @select-menu="categoryMenuToggle" />
  </div>
  <div v-if="categoryMenuChoice === 1">
    <form @submit.prevent="submitFormCreateCategory">
      <div class="form-row mb-20">
        <div class="form-contents">
          <label for="input-category">項目</label>
          <input type="text" id="input-category" v-model="formDataCreateCategory.category" required />
        </div>
        <div class="form-contents">
          <label for="input-spend-target-value">目標値</label>
          <input type="number" id="input-spend-target-value" v-model="formDataCreateCategory.spend_target_value" required />
        </div>
        <button>save</button>
      </div>
    </form>
  </div>
  <div v-if="categoryMenuChoice === 2">
    <form>
      <div class="form-row mb-20">
        <div class="form-contents">
          <label for="input-category">項目</label>
          <select id="input-category" @change="formDisplaySetParams" v-model="formDataUpdateDeleteCategory.id" required>
            <option v-for="category in categoryStore.category" :value="category.id" :key="category.id">
              {{ category.category }}
            </option>
          </select>
        </div>
        <div v-if="formDataUpdateDeleteCategory.id" style="display: flex">
          <div v-if="!formDataUpdateDeleteCategory.initial_flag && !usedCategory" class="form-contents">
            <label for="input-category">項目</label>
            <input type="text" v-model="formDataUpdateDeleteCategory.category" id="input-category" />
          </div>
          <div v-else class="form-contents">
            <label for="input-category">項目</label>
            <input type="text" v-model="formDataUpdateDeleteCategory.category" readonly class="read-only" id="input-category" />
          </div>
          <div class="form-contents">
            <label for="input-spend-target-value">目標値</label>
            <input type="number" v-model="formDataUpdateDeleteCategory.spend_target_value" id="input-spend-target-value" />
          </div>
          <button @click="submitFormUpdateCategory" type="button">更新</button>
          <button v-if="!formDataUpdateDeleteCategory.initial_flag && !usedCategory" @click="submitFormDeleteCategory" type="button">削除</button>
        </div>
      </div>
    </form>
  </div>
  <div v-if="categoryMenuChoice === 3">
    <form style="height: 180px">
      <div class="form-row" style="height: 80px">
        <div class="form-contents">
          <label for="input-total-price">合計の目標</label>
          <input type="number" v-model="updateProfile.target_value_total_price" id="input-total-price" />
        </div>
        <div class="form-contents">
          <label for="input-fixed-cost">変動費の目標</label>
          <input type="number" v-model="updateProfile.target_value_fixed_cost" id="input-fixed-cost" />
        </div>
        <div class="form-contents">
          <label for="input-deferred-pay">後払いの目標</label>
          <input type="number" v-model="updateProfile.target_value_deferred_pay" id="input-deferred-pay" />
        </div>
      </div>
      <div class="form-row mb-20" style="justify-content: flex-end; margin-right: 30px">
        <button @click="submitFormUpdateProfile" type="button" style="height: 40px">更新</button>
      </div>
    </form>
  </div>
  <Modal v-bind="modalParams" @modal-status="modalClose" />
</template>

<style scoped>
form {
  margin-top: 10px;
}

button {
  margin-left: 20px;
}

.select-menu {
  margin: 0 30px;
}

.read-only {
  background-color: rgb(223 222 222);
}
</style>
