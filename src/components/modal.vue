<script setup lang="ts">
import { ModalParams } from '../types.ts'
import { computed } from 'vue'

const props = defineProps<ModalParams>()

const emit = defineEmits(['modal-status'])

function closeModal() {
  emit('modal-status', !props.status)
}

const computedClass = computed(() => {
  return props.class ? props.class : ''
})
</script>

<template>
  <div v-if="props.status" class="modal" :class="computedClass">
    <p>{{ props.message }}</p>
    <button @click="closeModal">閉じる</button>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 15%;
  left: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: whitesmoke;
  width: 600px;
  height: 100px;
  font-size: 20px;
  font-weight: bold;
}

button {
  background-color: inherit;
  width: 100px;
  height: 50px;
  line-height: 50px;
  color: whitesmoke;
}

button:hover {
  background-color: #1a1919;
  border-radius: 50%;
}

.success {
  background-color: rgb(50, 50, 204);
}

.error {
  background-color: rgb(216, 58, 58);
}
</style>
