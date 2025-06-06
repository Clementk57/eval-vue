<template>
  <button
    :type="type"
    :class="btnClass"
    @click="$emit('click')"
    v-bind="$attrs"
  >
    <i v-if="iconLeft" :class="`bi bi-${iconLeft} me-1`"></i>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: ''  
  },
  iconLeft: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'button'
  }
})

const btnClass = computed(() => {
  const classes = ['btn', `btn-${props.variant}`]
  if (props.size === 'sm') classes.push('btn-sm')
  if (props.size === 'lg') classes.push('btn-lg')
  return classes.join(' ')
})
</script>

<style scoped>
</style>
