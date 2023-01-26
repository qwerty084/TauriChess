<script setup lang="ts">
import { ref, provide, useSlots } from 'vue';

const tabTitles = ref();
tabTitles.value = useSlots()
  ?.default?.()
  .map((tab) => tab?.props?.title);

const selectedTitle = ref(tabTitles.value[0]);
provide('selectedTitle', selectedTitle);
</script>

<template>
  <div class="mb-4">
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option
          v-for="title in tabTitles"
          :key="title.title"
          :selected="title === selectedTitle"
        >
          {{ title }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="space-x-4" aria-label="Settings Tabs">
        <ul class="flex cursor-pointer">
          <li
            v-for="title in tabTitles"
            :key="title.title"
            :class="[
              title === selectedTitle
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:text-gray-700',
              'px-3 py-2 font-medium text-sm rounded-md',
            ]"
            :aria-current="title.current ? 'page' : undefined"
            @click="selectedTitle = title"
          >
            {{ title }}
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div>
    <slot />
  </div>
</template>
