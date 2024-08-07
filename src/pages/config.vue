<script setup lang="ts">
import MultipleChoiceMenu from '../components/multipleChoiceMenu.vue'
import { MultipleChoiceMenuParams, CreateCategory, ModalParams } from '../types'
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

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
  apply_button_message: undefined,
  close_button_message: undefined,
})

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
    <form @submit.prevent="submitFormUpdateCategory"></form>
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
</style>
