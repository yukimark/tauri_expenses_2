<script setup lang="ts">
import MultipleChoiceMenu from '../shared/components/multipleChoiceMenu.vue';
import { MultipleChoiceMenuParams, ModalParams, GetUpdateProfile } from '../types';
import { ref } from 'vue';
import { useDatabaseStore } from '../stores/databaseStore';
import { useProfileStore } from '../stores/profileStore';
import Modal from '../shared/components/modal.vue';
import FormCreateCategory from '../shared/components/formCreateCategory.vue';
import FormUpdateDeleteCategory from '../shared/components/formUpdateDeleteCategory.vue';

const databaseStore = useDatabaseStore();
const profileStore = useProfileStore();

const multipleChoiceMenuParams: MultipleChoiceMenuParams[] = [
  { id: 1, value: '項目の追加' },
  { id: 2, value: '項目の編集･削除' },
  { id: 3, value: '集計目標値の設定' },
];

const categoryMenuChoice = ref<number>(1);

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
});

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

const callSetModalParams = ({ cssClass, message }: { cssClass: string; message: string }): void => {
  setModalParams({ cssClass: cssClass, message: message });
};

const categoryMenuToggle = (index: number): void => {
  categoryMenuChoice.value = index;
  updateProfile.value = {
    target_value_total_price: profileStore.profile[0].target_value_total_price,
    target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
    target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
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
</script>

<template>
  <h1 class="title">設定</h1>
  <div><h2>項目の追加･編集･削除</h2></div>
  <div class="select-menu">
    <MultipleChoiceMenu :items="multipleChoiceMenuParams" @select-menu="categoryMenuToggle" />
  </div>
  <div v-if="categoryMenuChoice === 1">
    <FormCreateCategory @modal-params="callSetModalParams" />
  </div>
  <div v-if="categoryMenuChoice === 2">
    <FormUpdateDeleteCategory @modal-params="callSetModalParams" />
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
