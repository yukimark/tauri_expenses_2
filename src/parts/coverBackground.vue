<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  hideDrawer?: boolean
}>()

const computedClass = computed(() => {
  return {
    'hide-drawer': props.hideDrawer,
  }
})
</script>

<template>
  <div :class="computedClass"></div>
</template>

<style scoped>
div {
  background-color: rgb(85, 85, 85, 0.7);
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
}

.hide-drawer {
  z-index: 100;
}
</style>
