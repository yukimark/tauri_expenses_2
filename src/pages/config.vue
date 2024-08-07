<script setup lang="ts">
import MultipleChoiceMenu from '../components/multipleChoiceMenu.vue'
import { MultipleChoiceMenuParams, CreateCategory, ModalParams, UpdateDeleteCategory } from '../types'
import { ref } from 'vue'
import { useDatabaseStore } from '../stores/databaseStore'
import { useCategoryStore } from '../stores/categoryStore'
import Modal from '../components/modal.vue'

const databaseStore = useDatabaseStore()
const categoryStore = useCategoryStore()

const multipleChoiceMenuParams: MultipleChoiceMenuParams[] = [
  { id: 1, value: '項目の追加' },
  { id: 2, value: '項目の編集･削除' },
]

const categoryMenuChoice = ref<number>(1)

const formDataCreateCategory = ref<CreateCategory>({
  category: '',
  spend_target_value: 0,
})

const formDataUpdateDeleteCategory = ref<UpdateDeleteCategory>({
  id: null,
  category: '',
  spend_target_value: 0,
  initial_flag: true,
})

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
  apply_button_message: undefined,
  close_button_message: undefined,
})

const usedCategory = ref<boolean>(true)

const setModalParams = ({
  cssClass,
  message,
  apply_button_message,
  close_button_message,
}: {
  cssClass: string
  message: string
  apply_button_message?: string
  close_button_message?: string
}) => {
  modalParams.value = {
    status: true,
    class: cssClass,
    message: message,
    apply_button_message: apply_button_message,
    close_button_message: close_button_message,
  }
}

const modalClose = (isOpen: boolean) => {
  modalParams.value = {
    status: isOpen,
    class: '',
    message: '',
    apply_button_message: undefined,
    close_button_message: undefined,
  }
}

const categoryMenuToggle = async (index: number) => {
  categoryMenuChoice.value = index
  formDataCreateCategory.value = {
    category: '',
    spend_target_value: 0,
  }
  formDataUpdateDeleteCategory.value = {
    id: null,
    category: '',
    spend_target_value: 0,
    initial_flag: true,
  }
}

const submitFormCreateCategory = async () => {
  const value = formDataCreateCategory.value
  try {
    await databaseStore.createCategory([value.category, value.spend_target_value])
    await categoryStore.set(await databaseStore.getCategoryAll())
    setModalParams({ cssClass: 'success', message: '項目の登録に成功しました。' })
  } catch (error) {
    console.error(error)
    setModalParams({ cssClass: 'error', message: '項目の登録に失敗しました。' })
  }
  formDataCreateCategory.value = {
    category: '',
    spend_target_value: 0,
  }
}

const submitFormUpdateCategory = async () => {}

const submitFormDeleteCategory = async () => {}

const formDisplaySetParams = async () => {
  const result = categoryStore.category.find((item) => item.id === formDataUpdateDeleteCategory.value.id)!
  const data = await databaseStore.usedCategory(result.id)
  usedCategory.value = data[0].exists_flag === 1
  formDataUpdateDeleteCategory.value = {
    id: result.id,
    category: result.category,
    spend_target_value: result.spend_target_value,
    initial_flag: result.initial_flag,
  }
}
</script>

<template>
  <div class="title"><h1>設定</h1></div>
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
            <input type="text" v-model="formDataUpdateDeleteCategory.category" />
          </div>
          <div v-else class="form-contents">
            <label for="input-category">項目</label>
            <input type="text" v-model="formDataUpdateDeleteCategory.category" readonly class="read-only" />
          </div>
          <div class="form-contents">
            <label for="input-spend-target-value">目標値</label>
            <input type="number" v-model="formDataUpdateDeleteCategory.spend_target_value" />
          </div>
          <button @click="submitFormUpdateCategory" type="button">更新</button>
          <button v-if="!formDataUpdateDeleteCategory.initial_flag && !usedCategory" @click="submitFormDeleteCategory" type="button">削除</button>
        </div>
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
  margin: 0px 30px 0px;
}

.read-only {
  background-color: rgb(223, 222, 222);
}
</style>
