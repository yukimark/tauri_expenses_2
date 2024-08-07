<script setup lang="ts">
import { ref } from 'vue'
import { MultipleChoiceMenuParams } from '../types'

const props = defineProps<{
  items: MultipleChoiceMenuParams[]
}>()

const emit = defineEmits(['select-menu'])

const selectMenu = ref<number>(1)

const selectMenuChange = (index: number) => {
  selectMenu.value = index
  emit('select-menu', index)
}
</script>

<template>
  <div class="multiple-choice-menu">
    <template v-for="(item, index) in props.items" :key="index">
      <button v-if="selectMenu !== item.id" @click="selectMenuChange(item.id)">{{ item.value }}</button>
      <div v-else>{{ item.value }}</div>
      <span v-if="index !== items.length - 1">|</span>
    </template>
  </div>
</template>

<style scoped>
.multiple-choice-menu {
  display: flex;
  margin-left: 10px;
}

.multiple-choice-menu button {
  text-decoration: underline;
  color: rgb(106, 106, 196);
}

.multiple-choice-menu button:hover {
  color: red;
  background-color: inherit;
}

.multiple-choice-menu span {
  margin-left: 5px;
  margin-right: 8px;
}
</style>
