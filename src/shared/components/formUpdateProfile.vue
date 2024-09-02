<script setup lang="ts">
import { ref } from 'vue';
import { GetUpdateProfile } from '../../types';
import { useDatabaseStore } from '../../stores/databaseStore';
import { useProfileStore } from '../../stores/profileStore';

const databaseStore = useDatabaseStore();
const profileStore = useProfileStore();

const emit = defineEmits<{
  (e: 'modal-params', payload: { cssClass: string; message: string }): void;
}>();

const updateProfile = ref<GetUpdateProfile>({
  target_value_total_price: profileStore.profile[0].target_value_total_price,
  target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
  target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
});

const sendModalParams = (cssClass: string, message: string): void => {
  emit('modal-params', { cssClass, message });
};

const submitFormUpdateProfile = async (): Promise<void> => {
  const value = updateProfile.value;
  try {
    await databaseStore.updateProfile([value.target_value_total_price, value.target_value_fixed_cost, value.target_value_deferred_pay]);
    await profileStore.set(await databaseStore.getProfile());
    sendModalParams('success', '集計目標値の更新に成功しました。');
  } catch (error) {
    console.error(error);
    sendModalParams('success', '集計目標値の更新に失敗しました。');
  }
  updateProfile.value = {
    target_value_total_price: profileStore.profile[0].target_value_total_price,
    target_value_fixed_cost: profileStore.profile[0].target_value_fixed_cost,
    target_value_deferred_pay: profileStore.profile[0].target_value_deferred_pay,
  };
};
</script>

<template>
  <form style="height: 180px">
    <div class="form-row" style="height: 80px">
      <div class="form-contents">
        <label for="input-total-price">合計の目標</label>
        <input id="input-total-price" v-model="updateProfile.target_value_total_price" type="number" />
      </div>
      <div class="form-contents">
        <label for="input-fixed-cost">変動費の目標</label>
        <input id="input-fixed-cost" v-model="updateProfile.target_value_fixed_cost" type="number" />
      </div>
      <div class="form-contents">
        <label for="input-deferred-pay">後払いの目標</label>
        <input id="input-deferred-pay" v-model="updateProfile.target_value_deferred_pay" type="number" />
      </div>
    </div>
    <div class="form-row mb-20" style="justify-content: flex-end; margin-right: 30px">
      <button style="height: 40px" type="button" @click="submitFormUpdateProfile">更新</button>
    </div>
  </form>
</template>
