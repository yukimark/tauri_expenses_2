<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useDatabaseStore } from '../stores/databaseStore';
  import { GetCategory, Categories, CreateSpend, ModalParams } from '../types.ts';
  import Modal from '../components/modal.vue';

  function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const today: Date = new Date();
  const formattedDate: string = formatDateToYYYYMMDD(today);

  const databaseStore = useDatabaseStore();
  const categoryAll = ref<GetCategory[]>([]);
  const formData = ref<CreateSpend>({
    date: formattedDate,
    category_id: null,
    price: null,
    fixed_cost: false,
    deferred_pay: false,
    memo: ''
  });

  const modalParams = ref<ModalParams>({
    status: false,
    class: '',
    message: ''
  });
  

  onMounted(async () => {
    try {
      const result: Categories<GetCategory> = await databaseStore.selectQuery('SELECT id, category FROM categories order by id asc;');
      categoryAll.value = result;
      console.log(categoryAll.value);
      console.log(formData.value.category_id);
    } catch (error) {
      console.error('Query error', error);
    }
  })

  const submitForm = async () => {
    const value = formData.value;
    try {
      await databaseStore.executeQuery(
          'INSERT into spends (date, category_id, price, fixed_cost, deferred_pay, memo) VALUES ($1, $2, $3, $4, $5, $6)',
          [value.date, value.category_id, value.price, value.fixed_cost, value.deferred_pay, value.memo]
        );
      console.log('spend save success');
      formData.value = {
        date: formattedDate,
        category_id: null,
        price: null,
        fixed_cost: false,
        deferred_pay: false,
        memo: ''
      }
      modalParams.value = {
        status: true,
        class: 'success',
        message: 'お小遣い帳の保存に成功しました。'
      }
    } catch (error) {
      console.error(error);
      modalParams.value = {
        status: true,
        class: 'error',
        message: 'お小遣い帳の保存に失敗しました。'
      }
    }
  }

  const modalClose = (isOpen: boolean) => {
    modalParams.value.status = isOpen;
  }
    
</script>

<template>
  <div class="title"><h1>お小遣い帳</h1></div>
  <form @submit.prevent="submitForm">
    <div class="spend-form-row1">
      <div class="input-date spend-form-contents">
        <p>日付</p>
        <VueDatePicker
          class="custom-date-picker"
          v-model="formData.date"
          format="yyyy-MM-dd"
          model-type="yyyy-MM-dd"
          locale="ja"
          week-start="0"
          :enable-time-picker="false"
          auto-apply
          :month-change-on-scroll="false"
          required
          :max-date="new Date()"
        />
      </div>
      <div class="input-category-id spend-form-contents">
        <label for="input-category">項目</label>
        <select id="input-category" v-model="formData.category_id" required>
          <option v-for="category in categoryAll" :value="category.id">
            {{ category.category }}
          </option>
        </select>
      </div>
      <div class="input-price spend-form-contents">
        <label for="input-price">金額</label>
        <input type="number" id="input-price" v-model="formData.price" required>
      </div>
    </div>
    <div class="spend-form-row2">
      <div class="spend-form-contents">
        <input type="checkbox" id="fixed-cost" v-model="formData.fixed_cost">
        <label for="fixed-cost">固定費</label>
      </div>
      <div class="spend-form-contents">
        <input type="checkbox" id="deferred-pay" v-model="formData.deferred_pay">
        <label for="deferred-pay">後払い</label>
      </div>
      <div class="spend-form-contents">
        <label for="input-memo">メモ</label>
        <input type="text" id="input-memo" v-model="formData.memo">
      </div>
      <div class="spend-form-contents spend-form-button">
        <button>Save</button>
      </div>
    </div>
  </form>

  <Modal v-bind="modalParams" @modal-status="modalClose"/>
</template>

<style scoped>
  h1 {
    font-size: 28px;
    font-weight: 500;
  }

  form {
    margin: 30px;
    border: solid 2px rgb(106, 106, 196);
  }

  input {
    outline: solid 1px gray;
  }

  .title {
    padding-top: 20px;
  }

  .spend-form-row1 {
    display: flex;
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
  }

  .spend-form-row1 label {
    margin-right: 10px;
  }

  .spend-form-contents {
    margin-left: 20px;
  }

  .input-date {
    display: flex;
  }

  .custom-date-picker {
    width: 150px;
    margin-left: 10px;
  }

  .spend-form-row2 {
    display: flex;
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
  }

  .spend-form-row2 label {
    margin-left: 10px;
  }

  #input-memo {
    margin-left: 10px;
  }
</style>
