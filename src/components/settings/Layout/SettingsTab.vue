<script lang="ts" setup>
import { inject } from 'vue';

defineProps({
  title: {
    type: String,
    default: '',
  },
});

const selectedTitle = inject('selectedTitle');
</script>

<template>
  <div v-show="title === selectedTitle">
    <slot />
  </div>
</template>
