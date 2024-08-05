<script setup lang="ts">
import { useDatabaseStore } from '../stores/databaseStore'
import { useCategoryStore } from '../stores/categoryStore'
import { formatDateToYYYYMM } from '../helper/formatDate'
import { GetSpend } from '../types'
import { onMounted, ref } from 'vue'

const databaseStore = useDatabaseStore()
const categoryStore = useCategoryStore()

const today: Date = new Date()
const thisMonth: string = formatDateToYYYYMM(today)

const spendAll = ref<GetSpend[]>([])
const categoryTotals: {name: string, price: number}[] = []

onMounted(async () => {
  try {
    spendAll.value = await databaseStore.getSpendsYearMonth(thisMonth)
    categoryStore.category.forEach(category => {
      let value:number = 0
      spendAll.value.forEach(spend => {
        if (category.category === spend.category) {
          value += spend.price
        }
      })
      categoryTotals.push({name: category.category, price: value})
    })
    console.log(categoryTotals)
  } catch (error) {
    console.error('Query error', error)
  }
})
</script>

<template>
  <div class="title"><h1>ホーム</h1></div>
  <div class="contents">
    <div class="pie-chart-box">
      
    </div>
    <div class="spend-sum-table"></div>
  </div>
</template>

<style scoped>
.contents {
  display: flex;
}

.pie-chart-box {
  width: 500px;
  height: 600px
}

.spend-sum-table {
  width: 300px;
  height: 600px;
}
</style>
