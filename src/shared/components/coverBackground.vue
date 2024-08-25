<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  hideDrawer: {
    type: Boolean,
    default: false,
  },
});

const computedClass = computed(() => {
  return {
    'hide-drawer': props.hideDrawer,
  };
});
</script>

<template>
  <div :class="computedClass"></div>
</template>

<style scoped>
div {
  background-color: rgb(85 85 85 / 70%);
  z-index: 5;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
}

.hide-drawer {
  z-index: 100;
}
</style>
