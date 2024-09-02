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

/** お小遣い帳集計の表に使う項目 */
const headers = ref<Header[]>([
  { text: '項目', value: 'name', width: 130 },
  { text: '金額', value: 'price', width: 150 },
  { text: '目標', value: 'target_value', width: 130 },
  { text: '目標との差', value: 'difference_value', width: 150 },
]);
/** お小遣い帳のカテゴリごとの合計を入れる */
const itemsSpend = ref<Item[]>([]);
/** お小遣い帳の概要の集計したものを入れる */
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

/**
 * spendのcategoryごとの合計を集計する
 */
const spendTotalling = (): void => {
  spendCategoryTotals.value = categoryStore.category.map((category) => {
    const categorySum = spendAll.value.reduce((acc, curr) => (category.category === curr.category ? acc + curr.price : acc), 0);
    return {
      name: category.category,
      price: categorySum,
      target_value: category.spend_target_value,
      difference_value: category.spend_target_value - categorySum,
    };
  });
  itemsSpend.value = priceToLocale(spendCategoryTotals.value);
};

/**
 * spend全体の集計
 */
const spendSummaryTotalling = (): void => {
  spendAll.value.forEach((spend) => {
    if (!spend.fixed_cost) {
      spendFixedCostTotal.value += spend.price;
    }
    if (spend.deferred_pay) {
      spendDeferredPayTotal.value += spend.price;
    }
    spendPriceTotal.value += spend.price;
  });
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
/**
 * テーブルに出力するため数値を3桁区切りの文字列にする。
 * @param spendAll spendのcategoryごとの合計をまとめた配列
 */
const priceToLocale = (spendAll: SpendCategoryTotal[]) => {
  return spendAll.map((spend) => ({
    ...spend,
    price: spend.price.toLocaleString(),
    target_value: spend.target_value.toLocaleString(),
    difference_value: spend.difference_value.toLocaleString(),
  }));
};

// TODO:返り値の型
/**
 * テーブルに出力するため数値を3桁区切りの文字列にする。
 * @param itemsCommon spend全体の集計をまとめた配列
 */
const totalPriceToLocale = (itemsCommon: Item[]) => {
  return itemsCommon.map((item) => ({
    ...item,
    price: item.price.toLocaleString(),
    target_value: item.target_value.toLocaleString(),
    difference_value: item.difference_value.toLocaleString(),
  }));
};

/**
 * 表で数値が入っている項目は要素を右寄せにする。
 * @param column 表の項目名
 */
const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string): string => {
  if (column === 'price' || column === 'target_value' || column === 'difference_value') return 'direction-right';
  return '';
};

/**
 * 表で目標値よりも金額のほうが高いときに背景を赤くする。
 * @param item 表の行
 */
const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item): string => {
  if (parseFloat(item.difference_value.replace(/,/g, '')) < 0) return 'back-red';
  return '';
};

onMounted(async () => {
  try {
    await getSpendAllSetItem();
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
