<script setup lang="ts">
import { Engine } from '@/types/Engine';

import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineProps({
  engines: {
    type: Object as () => Engine[],
    required: true,
  },
});

defineEmits<{
  (e: 'editEngine', engineId: string): void;
  (e: 'deleteEngine', engineId: string): void;
  (e: 'setDefaultEngine', engineId: string): void;
}>();
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
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
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Path
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Default
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Edit / Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="engine in engines" :key="engine.id">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                  >
                    {{ engine.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ engine.path }}
                  </td>
                  <td
                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 pl-10"
                  >
                    <label for="default-engine" class="sr-only"></label>
                    <input
                      id="default-engine"
                      type="checkbox"
                      :checked="engine.isDefault"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      @input="$emit('setDefaultEngine', engine.id)"
                    />
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-center gap-4"
                  >
                    <button @click="$emit('editEngine', engine.id)">
                      <PencilIcon class="w-5 h-5" />
                      <span class="sr-only">, {{ engine.name }}</span>
                    </button>
                    <button @click="$emit('deleteEngine', engine.id)">
                      <TrashIcon class="w-5 h-5" />
                      <span class="sr-only">, {{ engine.name }}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
