<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/databaseStore';
import { useCategoryStore } from '../stores/categoryStore.ts';
import { CreateSpend, ModalParams, GetSpend, MultipleChoiceMenuParams } from '../types.ts';
import Modal from '../shared/components/modal.vue';
import MultipleChoiceMenu from '../shared/components/multipleChoiceMenu.vue';
import type { Header, Item, BodyItemClassNameFunction } from 'vue3-easy-data-table';
import { formatDateToYYYYMMDD, formatDateToYYYYMM, formatDateToYYYYMMLastMonth } from '../shared/functions/formatDate.ts';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();

const today = new Date();
const yearMonthDay = formatDateToYYYYMMDD(today);
const thisMonth = formatDateToYYYYMM(today);
const lastMonth = formatDateToYYYYMMLastMonth(today);

const spendAll = ref<GetSpend[]>([]);

/** お小遣い帳一覧の表の項目 */
const headers = ref<Header[]>([
  { text: '日付', value: 'date', width: 110 },
  { text: '項目', value: 'category', width: 130 },
  { text: '金額', value: 'price', width: 150 },
  { text: '固定費', value: 'fixed_cost', width: 90 },
  { text: '後払い', value: 'deferred_pay', width: 90 },
  { text: 'メモ', value: 'memo', width: 350 },
]);
/** お小遣い帳一覧が入る */
const items = ref<Item[]>([]);
/** お小遣い帳削除時に使うチェックボックス選択したものが入る */
const itemsSelected = ref<Item[]>([]);

const formData = ref<CreateSpend>({
  date: yearMonthDay,
  category_id: null,
  price: null,
  fixed_cost: false,
  deferred_pay: true,
  memo: '',
});

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
});

const multipleChoiceMenuParams: MultipleChoiceMenuParams[] = [
  { id: 1, value: '今月' },
  { id: 2, value: '先月' },
];

const getSpendAllYearMonth = ref<number>(1);

const getSpendAllSetItem = async (): Promise<void> => {
  spendAll.value = await databaseStore.getSpendsYearMonth(getSpendAllYearMonth.value > 1 ? lastMonth : thisMonth);
  items.value = priceToLocale(spendAll.value);
};

// TODO:返り値の型
/**
 * テーブルに出力するため数値を3桁区切りの文字列にする。
 * @param spendAll 指定したお小遣い帳を取得した配列
 * @return お小遣い帳の金額を3桁区切りの文字列に変換した配列
 */
const priceToLocale = (spendAll: GetSpend[]) => {
  return spendAll.map((spend) => ({
    ...spend,
    price: spend.price.toLocaleString(),
  }));
};

/**
 * 表の指定項目を右寄せもしくは中央揃えにする。
 * @param column 表の項目名
 * @return 指定項目を右寄せもしくは中央揃えにするcssを返す
 */
const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string): string => {
  if (column === 'price') return 'direction-right';
  if (['fixed_cost', 'deferred_pay'].includes(column)) return 'direction-center';
  return '';
};

const setModalParams = ({ cssClass, message }: { cssClass: string; message: string }) => {
  modalParams.value = {
    status: true,
    class: cssClass,
    message: message,
  };
};

onMounted(async () => {
  try {
    await getSpendAllSetItem();
  } catch (error) {
    console.error('Query error', error);
  }
});

const submitFormCreateSpend = async (): Promise<void> => {
  const value = formData.value;
  try {
    await databaseStore.createSpend([value.date, value.category_id, value.price, value.fixed_cost, value.deferred_pay, value.memo]);
    await getSpendAllSetItem();
    setModalParams({ cssClass: 'success', message: 'お小遣い帳の保存に成功しました。' });
  } catch (error) {
    console.error(error);
    setModalParams({ cssClass: 'error', message: 'お小遣い帳の保存に失敗しました。' });
  }
  formData.value = {
    date: yearMonthDay,
    category_id: null,
    price: null,
    fixed_cost: false,
    deferred_pay: true,
    memo: '',
  };
};

const modalClose = (isOpen: boolean): void => {
  modalParams.value = {
    status: isOpen,
    class: '',
    message: '',
  };
};

const deleteItems = async (itemArray: Item[]): Promise<void> => {
  if (itemArray.length === 0) {
    setModalParams({ cssClass: 'success', message: '削除するときはアイテムにチェックを入れてください。' });
    return;
  }
  const ids: number[] = itemArray.map((item) => item.id);
  await databaseStore.deleteSpendsMatchId(ids);
  await getSpendAllSetItem();
  setModalParams({ cssClass: 'success', message: '選択したデータを削除しました。' });
};

const spendAllMonthToggle = async (index: number): Promise<void> => {
  getSpendAllYearMonth.value = index;
  getSpendAllSetItem();
};
</script>

<template>
  <h1 class="title">お小遣い帳</h1>
  <form @submit.prevent="submitFormCreateSpend">
    <div class="form-row">
      <div class="input-date form-contents">
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
      <div class="form-contents">
        <label for="input-category">項目</label>
        <select id="input-category" v-model="formData.category_id" required>
          <option v-for="category in categoryStore.category" :value="category.id" :key="category.id">
            {{ category.category }}
          </option>
        </select>
      </div>
      <div class="form-contents">
        <label for="input-price">金額</label>
        <input type="number" id="input-price" v-model="formData.price" required />
      </div>
    </div>
    <div class="form-row-last">
      <div class="form-contents">
        <input type="checkbox" id="fixed-cost" v-model="formData.fixed_cost" />
        <label for="fixed-cost">固定費</label>
      </div>
      <div class="form-contents">
        <input type="checkbox" id="deferred-pay" v-model="formData.deferred_pay" />
        <label for="deferred-pay">後払い</label>
      </div>
      <div class="form-contents">
        <label for="input-memo">メモ</label>
        <input type="text" id="input-memo" v-model="formData.memo" />
      </div>
      <div class="form-contents spend-form-button">
        <button>Save</button>
      </div>
    </div>
  </form>

  <div class="table-contents">
    <MultipleChoiceMenu :items="multipleChoiceMenuParams" @select-menu="spendAllMonthToggle" />
    <div class="spend-trash">
      <button type="button" @click="deleteItems(itemsSelected)">
        <span>選択した項目を削除</span>
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
  <div class="table">
    <EasyDataTable v-model:items-selected="itemsSelected" :headers="headers" :items="items" :body-item-class-name="bodyItemClassNameFunction" />
  </div>
  <Modal v-bind="modalParams" @modal-status="modalClose" />
</template>

<style scoped>
.custom-date-picker {
  width: 150px;
  margin-left: 10px;
}

#input-memo {
  margin-left: 10px;
}

.table-contents {
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
}

.spend-trash {
  text-align: right;
  margin: 0 20px;
}

.table {
  margin: 10px 20px 0;
}
</style>
