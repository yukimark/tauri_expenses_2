<script setup lang="ts">
import { useDatabaseStore } from '../stores/databaseStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useProfileStore } from '../stores/profileStore';
import { formatDateToYYYYMM } from '../shared/functions/formatDate';
import { GetSpend, SpendCategoryTotal } from '../types';
import { onMounted, ref } from 'vue';
import type { Header, Item, BodyItemClassNameFunction, BodyRowClassNameFunction } from 'vue3-easy-data-table';

const databaseStore = useDatabaseStore();
const categoryStore = useCategoryStore();
const profileStore = useProfileStore();

const today = new Date();
const thisMonth = formatDateToYYYYMM(today);

const spendAll = ref<GetSpend[]>([]);
const spendCategoryTotals = ref<SpendCategoryTotal[]>([]);

const selectedMonth = ref(thisMonth);

const spendPriceTotal = ref<number>(0);
const spendFixedCostTotal = ref<number>(0);
const spendDeferredPayTotal = ref<number>(0);

const headers = ref<Header[]>([
  { text: '項目', value: 'name', width: 130 },
  { text: '金額', value: 'price', width: 150 },
  { text: '目標', value: 'target_value', width: 130 },
  { text: '目標との差', value: 'difference_value', width: 150 },
]);
const itemsSpend = ref<Item[]>([]);
const itemsCommon = ref<Item[]>([]);

const getSpendAllSetItem = async (): Promise<void> => {
  refValueInit();
  spendAll.value = await databaseStore.getSpendsYearMonth(selectedMonth.value);
  spendTotalling();
  spendSummaryTotalling();
};

const refValueInit = (): void => {
  spendCategoryTotals.value = [];
  spendPriceTotal.value = 0;
  spendFixedCostTotal.value = 0;
  spendDeferredPayTotal.value = 0;
  itemsCommon.value = [];
};

const spendTotalling = (): void => {
  categoryStore.category.forEach((category) => {
    let categorySum = 0;
    spendAll.value.forEach((spend) => {
      if (category.category === spend.category) {
        categorySum += spend.price;
      }
    });
    const differenceSpendTarget: number = category.spend_target_value - categorySum;
    spendCategoryTotals.value.push({
      name: category.category,
      price: categorySum,
      target_value: category.spend_target_value,
      difference_value: differenceSpendTarget,
    });
  });
};

const spendSummaryTotalling = (): void => {
  spendAll.value.forEach((spend) => {
    if (spend.fixed_cost === 'false') {
      spendFixedCostTotal.value += spend.price;
    }
    if (spend.deferred_pay === 'true') {
      spendDeferredPayTotal.value += spend.price;
    }
    spendPriceTotal.value += spend.price;
  });
  itemsSpend.value = priceToLocale(spendCategoryTotals.value);
  itemsCommon.value = [
    { name: '合計', price: spendPriceTotal.value, target_value: profileStore.profile[0].target_value_total_price },
    { name: '変動費', price: spendFixedCostTotal.value, target_value: profileStore.profile[0].target_value_fixed_cost },
    { name: '後払い', price: spendDeferredPayTotal.value, target_value: profileStore.profile[0].target_value_deferred_pay },
  ];
  itemsCommon.value.forEach((itemCommon) => {
    itemCommon['difference_value'] = itemCommon.target_value - itemCommon.price;
  });
  itemsCommon.value = totalPriceToLocale(itemsCommon.value);
};

// TODO:返り値の型
const priceToLocale = (spendAll: SpendCategoryTotal[]) => {
  return spendAll.map((spend) => ({
    ...spend,
    price: spend.price.toLocaleString(),
    target_value: spend.target_value.toLocaleString(),
    difference_value: spend.difference_value.toLocaleString(),
  }));
};

// TODO:返り値の型
const totalPriceToLocale = (itemsCommon: Item[]) => {
  return itemsCommon.map((item) => ({
    ...item,
    price: item.price.toLocaleString(),
    target_value: item.target_value.toLocaleString(),
    difference_value: item.difference_value.toLocaleString(),
  }));
};

const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string): string => {
  if (column === 'price' || column === 'target_value' || column === 'difference_value') return 'direction-right';
  return '';
};

const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item): string => {
  if (parseFloat(item.difference_value.replace(/,/g, '')) < 0) return 'back-red';
  return '';
};

onMounted(async () => {
  try {
    await getSpendAllSetItem();
    console.log(spendCategoryTotals);
  } catch (error) {
    console.error('Query error', error);
  }
});
</script>

<template>
  <h1 class="title">ホーム</h1>
  <div class="select-month input-date">
    <p>年月</p>
    <VueDatePicker
      class="custom-date-picker"
      v-model="selectedMonth"
      format="yyyy-MM"
      model-type="yyyy-MM"
      locale="ja"
      auto-apply
      month-picker
      :month-change-on-scroll="false"
      required
      :max-date="new Date()"
    />
    <button type="button" @click="getSpendAllSetItem">更新</button>
  </div>
  <div class="contents">
    <div class="pie-chart-box"></div>
    <div class="spend-sum-table">
      <EasyDataTable
        :headers="headers"
        :items="itemsCommon"
        :rows-per-page="3"
        :body-item-class-name="bodyItemClassNameFunction"
        :body-row-class-name="bodyRowClassNameFunction"
      />
      <EasyDataTable
        :headers="headers"
        :items="itemsSpend"
        :rows-per-page="50"
        :body-item-class-name="bodyItemClassNameFunction"
        :body-row-class-name="bodyRowClassNameFunction"
      />
    </div>
  </div>
</template>

<style scoped>
.select-month {
  height: 40px;
  line-height: 40px;
  margin-top: 30px;
  padding-left: 20px;
}

.custom-date-picker {
  width: 150px;
  margin: 0 10px;
}

button {
  background-color: lightgray;
  padding: 0 5px;
}

button:hover {
  color: red;
}

.contents {
  display: flex;
  margin-top: 30px;
  padding: 0 20px;
}

.pie-chart-box {
  width: 380px;
}

.spend-sum-table {
  width: 580px;
}
</style>
