<script lang="ts" setup>
import { ref, watch } from 'vue';
import {
  HomeIcon,
  CogIcon,
  PlayIcon,
  AcademicCapIcon,
} from '@heroicons/vue/24/outline';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const navigation = ref([
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Play', href: '/play', icon: PlayIcon, current: false },
  { name: 'Study', href: '/study', icon: AcademicCapIcon, current: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
]);

watch(route, () => {
  // display current route highlighted in nav
  navigation.value.map((item) => {
    const matchingRoute = item.href === route.path;
    item.current = matchingRoute;
  });
});
</script>

<template>
  <nav class="mt-5 flex-1 space-y-1 px-2">
    <RouterLink
      v-for="item in navigation"
      :key="item.name"
      :to="item.href"
      :class="[
        item.current
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
      ]"
      ><component
        :is="item.icon"
        :class="[
          item.current
            ? 'text-gray-300'
            : 'text-gray-400 group-hover:text-gray-300',
          'mr-3 flex-shrink-0 h-6 w-6',
        ]"
        aria-hidden="true"
      />
      {{ item.name }}</RouterLink
    >
  </nav>
</template>
