<script setup lang="ts">
import { ModalParams } from '../../types.ts';
import { computed, ref } from 'vue';
import CoverBackground from './coverBackground.vue';

const props = defineProps<ModalParams>();

const emit = defineEmits<{
  (e: 'modal-status', isOpen: boolean): void;
}>();

function closeModal(): void {
  emit('modal-status', !props.status);
}

const computedClass = computed((): string => {
  return props.class ? props.class : '';
});

const hideDrawer = ref<boolean>(true);
</script>

<template>
  <div v-if="props.status" class="modal" :class="computedClass">
    <p>{{ props.message }}</p>
    <div class="button-box">
      <button v-if="props.apply_button_message">{{ props.apply_button_message }}</button>
      <button @click="closeModal">{{ props.close_button_message ? props.close_button_message : '閉じる' }}</button>
    </div>
  </div>
  <CoverBackground v-if="props.status" :hideDrawer="hideDrawer" />
</template>

<style scoped>
.modal {
  position: absolute;
  top: 15%;
  left: 20%;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: whitesmoke;
  width: 600px;
  height: 150px;
  font-size: 20px;
  font-weight: bold;
}

.modal p {
  height: 90px;
  line-height: 90px;
}

.button-box {
  display: flex;
  height: 50px;
  line-height: 50px;
  justify-content: flex-end;
  margin-right: 10px;
}

button {
  background-color: inherit;
  width: 100px;
  height: 50px;
  line-height: 50px;
  color: whitesmoke;
  margin-right: 20px;
}

button:hover {
  background-color: #1a1919;
  border-radius: 50%;
}

.success {
  background-color: rgb(50 50 204);
}

.error {
  background-color: rgb(216 58 58);
}
</style>
