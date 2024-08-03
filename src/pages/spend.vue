<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDatabaseStore } from '../stores/databaseStore'
import { GetCategory, CreateSpend, ModalParams, GetSpend } from '../types.ts'
import Modal from '../components/modal.vue'
import type { Header, Item, SortType } from 'vue3-easy-data-table'
import { formatDateToYYYYMMDD, formatDateToYYYYMM } from '../helper/formatDate.ts'

const databaseStore = useDatabaseStore()

const today: Date = new Date()
const yearMonthDay: string = formatDateToYYYYMMDD(today)
const yearMonth: string = formatDateToYYYYMM(today)

const categoryAll = ref<GetCategory[]>([])
const spendAll = ref<GetSpend[]>([])

const headers = ref<Header[]>([
  { text: '日付', value: 'date', sortable: true, width: 110 },
  { text: '項目', value: 'category', width: 130 },
  { text: '金額', value: 'price', sortable: true, width: 200 },
  { text: '固定費', value: 'fixed_cost', width: 90 },
  { text: '後払い', value: 'deferred_pay', width: 90 },
  { text: 'メモ', value: 'memo', width: 500 },
])
const items = ref<Item[]>([])
const sortBy: string[] = ['date', 'price']
const sortType: SortType[] = ['desc', 'desc']

const formData = ref<CreateSpend>({
  date: yearMonthDay,
  category_id: null,
  price: null,
  fixed_cost: false,
  deferred_pay: false,
  memo: '',
})

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
})

onMounted(async () => {
  try {
    categoryAll.value = (await databaseStore.getCategoryAll()) as {
      id: number
      category: string
    }[]
    spendAll.value = (await databaseStore.getSpendsYearMonth(yearMonth)) as {
      id: number
      date: string
      category: string
      price: number
      fixed_cost: boolean
      deferred_pay: boolean
      memo: string
    }[]
    items.value = spendAll.value
    console.log(spendAll.value)
  } catch (error) {
    console.error('Query error', error)
  }
})

const submitForm = async () => {
  const value = formData.value
  try {
    await databaseStore.createSpend([value.date, value.category_id, value.price, value.fixed_cost, value.deferred_pay, value.memo])
    console.log('spend save success')
    modalParams.value = {
      status: true,
      class: 'success',
      message: 'お小遣い帳の保存に成功しました。',
    }
  } catch (error) {
    console.error(error)
    modalParams.value = {
      status: true,
      class: 'error',
      message: 'お小遣い帳の保存に失敗しました。',
    }
  }
  formData.value = {
    date: yearMonthDay,
    category_id: null,
    price: null,
    fixed_cost: false,
    deferred_pay: false,
    memo: '',
  }
  spendAll.value = (await databaseStore.getSpendsYearMonth(yearMonth)) as {
    id: number
    date: string
    category: string
    price: number
    fixed_cost: boolean
    deferred_pay: boolean
    memo: string
  }[]
  items.value = spendAll.value
}

const modalClose = (isOpen: boolean) => {
  modalParams.value.status = isOpen
}

const deleteItem = async (item: Item) => {
  await databaseStore.deleteSpendMatchId([item.id])
  spendAll.value = (await databaseStore.getSpendsYearMonth(yearMonth)) as {
    id: number
    date: string
    category: string
    price: number
    fixed_cost: boolean
    deferred_pay: boolean
    memo: string
  }[]
  items.value = spendAll.value
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
          <option v-for="category in categoryAll" :value="category.id" :key="category.id">
            {{ category.category }}
          </option>
        </select>
      </div>
      <div class="input-price spend-form-contents">
        <label for="input-price">金額</label>
        <input type="number" id="input-price" v-model="formData.price" required />
      </div>
    </div>
    <div class="spend-form-row2">
      <div class="spend-form-contents">
        <input type="checkbox" id="fixed-cost" v-model="formData.fixed_cost" />
        <label for="fixed-cost">固定費</label>
      </div>
      <div class="spend-form-contents">
        <input type="checkbox" id="deferred-pay" v-model="formData.deferred_pay" />
        <label for="deferred-pay">後払い</label>
      </div>
      <div class="spend-form-contents">
        <label for="input-memo">メモ</label>
        <input type="text" id="input-memo" v-model="formData.memo" />
      </div>
      <div class="spend-form-contents spend-form-button">
        <button>Save</button>
      </div>
    </div>
  </form>

  <div class="table">
    <EasyDataTable :headers="headers" :items="items" :sort-by="sortBy" :sort-type="sortType" multi-sort>
      <template #item-delete="item">
        <button @click="deleteItem(item)"><i class="fa-solid fa-trash"></i></button>
      </template>
    </EasyDataTable>
  </div>
  <Modal v-bind="modalParams" @modal-status="modalClose" />
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

.table {
  margin: 10px 20px 0px;
}
</style>
