<script setup lang="ts">
import { Engine } from '@/types/Engine';

defineProps({
  engines: {
    type: Object as () => Engine[],
    required: true,
  },
});

defineEmits<{
  (e: 'editEngine', engineId: string): void;
  (e: 'deleteEngine', engineId: string): void;
}>();
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div
      class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg"
    >
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>
            <th
              scope="col"
              class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Path
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Edit</span>
              <span class="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="engine in engines" :key="engine.id">
            <td
              class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6"
            >
              {{ engine.name }}
              <dl class="font-normal lg:hidden">
                <dt class="sr-only">Title</dt>
                <dd class="mt-1 truncate text-gray-700">{{ engine.name }}</dd>
                <dt class="sr-only sm:hidden">Email</dt>
                <dd class="mt-1 truncate text-gray-500 sm:hidden">
                  {{ engine.path }}
                </dd>
              </dl>
            </td>
            <td class="px-3 py-4 text-sm text-gray-500">{{ engine.path }}</td>
            <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                class="text-indigo-600 hover:text-indigo-900"
                @click="$emit('editEngine', engine.id)"
              >
                Edit<span class="sr-only">, {{ engine.name }}</span>
              </button>
              <button
                class="text-indigo-600 hover:text-indigo-900"
                @click="$emit('deleteEngine', engine.id)"
              >
                Delete<span class="sr-only">, {{ engine.name }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
