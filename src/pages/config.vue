<script setup lang="ts">
import MultipleChoiceMenu from '../shared/components/multipleChoiceMenu.vue';
import { MultipleChoiceMenuParams, ModalParams } from '../types';
import { ref } from 'vue';
import Modal from '../shared/components/modal.vue';
import FormCreateCategory from '../shared/components/formCreateCategory.vue';
import FormUpdateDeleteCategory from '../shared/components/formUpdateDeleteCategory.vue';
import formUpdateProfile from '../shared/components/formUpdateProfile.vue';

const multipleChoiceMenuParams: MultipleChoiceMenuParams[] = [
  { id: 1, value: '項目の追加' },
  { id: 2, value: '項目の編集･削除' },
  { id: 3, value: '集計目標値の設定' },
];

const categoryMenuChoice = ref<number>(1);

const modalParams = ref<ModalParams>({
  status: false,
  class: '',
  message: '',
});

const setModalParams = ({ cssClass, message }: { cssClass: string; message: string }) => {
  modalParams.value = {
    status: true,
    class: cssClass,
    message: message,
  };
};

const modalClose = (isOpen: boolean): void => {
  modalParams.value = {
    status: isOpen,
    class: '',
    message: '',
  };
};

const callSetModalParams = ({ cssClass, message }: { cssClass: string; message: string }): void => {
  setModalParams({ cssClass: cssClass, message: message });
};

const categoryMenuToggle = (index: number): void => {
  categoryMenuChoice.value = index;
};
</script>

<template>
  <h1 class="title">設定</h1>
  <div><h2>項目の追加･編集･削除</h2></div>
  <div class="select-menu">
    <MultipleChoiceMenu :items="multipleChoiceMenuParams" @select-menu="categoryMenuToggle" />
  </div>
  <div v-if="categoryMenuChoice === 1">
    <FormCreateCategory @modal-params="callSetModalParams" />
  </div>
  <div v-if="categoryMenuChoice === 2">
    <FormUpdateDeleteCategory @modal-params="callSetModalParams" />
  </div>
  <div v-if="categoryMenuChoice === 3">
    <formUpdateProfile @modal-params="callSetModalParams" />
  </div>
  <Modal v-bind="modalParams" @modal-status="modalClose" />
</template>

<style scoped>
.select-menu {
  margin: 0 30px;
}
</style>
