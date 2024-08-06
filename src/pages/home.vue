<script setup lang="ts">
import { useDatabaseStore } from '../stores/databaseStore'
import { useCategoryStore } from '../stores/categoryStore'
import { formatDateToYYYYMM } from '../helper/formatDate'
import { GetSpend, SpendCategoryTotal } from '../types'
import { onMounted, ref } from 'vue'
import type { Header, Item, BodyItemClassNameFunction } from 'vue3-easy-data-table'


const databaseStore = useDatabaseStore()
const categoryStore = useCategoryStore()

const today: Date = new Date()
const thisMonth: string = formatDateToYYYYMM(today)

const spendAll = ref<GetSpend[]>([])
const spendCategoryTotals = ref<SpendCategoryTotal[]>([])

const selectedMonth = ref<string>(thisMonth)

const spendPriceTotal = ref<number>(0)
const spendFixedCostTotal = ref<number>(0)
const spendDeferredPayTotal = ref<number>(0)


const headers = ref<Header[]>([
  { text: '項目', value: 'name', width: 130 },
  { text: '金額', value: 'price', width: 150 },
  { text: '目標', value: 'target_value', width: 130 },
])
const itemsSpend = ref<Item[]>([])
const itemsCommon = ref<Item[]>([])

const getSpendAllSetItem = async () => {
  spendCategoryTotals.value = []
  spendPriceTotal.value = 0
  spendFixedCostTotal.value = 0
  spendDeferredPayTotal.value = 0
  itemsCommon.value = []
  spendAll.value = await databaseStore.getSpendsYearMonth(selectedMonth.value)
  categoryStore.category.forEach(category => {
    let categorySum:number = 0
    spendAll.value.forEach(spend => {
      if (category.category === spend.category) {
        categorySum += spend.price
      }
    })
    spendCategoryTotals.value.push({name: category.category, price: categorySum, target_value: category.spend_target_value})
  })
  spendAll.value.forEach(spend => {
    if (!spend.fixed_cost) {
      spendFixedCostTotal.value += spend.price
    }
    if (spend.deferred_pay) {
      spendDeferredPayTotal.value += spend.price
    }
    spendPriceTotal.value += spend.price
  })
  itemsSpend.value = priceToLocale(spendCategoryTotals.value)
  itemsCommon.value = [
    { name: '合計', price: spendPriceTotal.value.toLocaleString(), target_value: 150000 },
    { name: '変動費', price: spendFixedCostTotal.value.toLocaleString(), target_value: 70000 },
    { name: '後払い', price: spendDeferredPayTotal.value.toLocaleString(), target_value: 70000 }
  ]
}

const priceToLocale = (spendAll: SpendCategoryTotal[]) => {
  return spendAll.map((spend) => ({
    ...spend,
    price: spend.price.toLocaleString(),
    target_value: spend.target_value.toLocaleString(),
  }))
}

const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, rowNumber: number): string => {
  if (column === 'price' || column === 'target_value') return 'direction-right'
  return ''
}

onMounted(async () => {
  try {
    getSpendAllSetItem()
    console.log(spendCategoryTotals)
  } catch (error) {
    console.error('Query error', error)
  }
})
</script>

<template>
  <div class="title"><h1>ホーム</h1></div>
  <div class="select-month">
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
      />
      <EasyDataTable
        :headers="headers"
        :items="itemsSpend"
        :rows-per-page="50"
        :body-item-class-name="bodyItemClassNameFunction"
      />
    </div>
  </div>
</template>

<style scoped>
.select-month {
  display: flex;
  height: 40px;
  line-height: 40px;
  margin-top: 30px;
  padding-left: 20px;
}

.custom-date-picker {
  width: 150px;
  margin-left: 10px;
  margin-right: 10px;
}

button {
  background-color: lightgray;
}

button:hover {
  color: red;
}

.contents {
  display: flex;
  margin-top: 30px;
  padding: 0px 20px 0px;
}

.pie-chart-box {
  width: 400px;
}

.spend-sum-table {
  width: 600px;
}
</style>
